
from datetime import datetime, timezone
from typing import Any


# ==================================================
# 1. COMMUNITY VULNERABILITY PROFILES
# ==================================================

COMMUNITY_PROFILES = {
    "general": {
        "label": "General population",
        "vulnerability": 50,
        "exposure": {
            "heat": 60,
            "air": 60,
            "rain": 60
        }
    },
    "elderly": {
        "label": "Elderly people",
        "vulnerability": 80,
        "exposure": {
            "heat": 75,
            "air": 75,
            "rain": 65
        }
    },
    "children": {
        "label": "Children",
        "vulnerability": 75,
        "exposure": {
            "heat": 70,
            "air": 75,
            "rain": 65
        }
    },
    "outdoor_workers": {
        "label": "Outdoor workers",
        "vulnerability": 85,
        "exposure": {
            "heat": 90,
            "air": 85,
            "rain": 70
        }
    },
    "flood_affected": {
        "label": "Flood-affected communities",
        "vulnerability": 85,
        "exposure": {
            "heat": 60,
            "air": 65,
            "rain": 95
        }
    }
}


# Overall assessment weights.
HAZARD_WEIGHTS = {
    "heat": 0.40,
    "air": 0.30,
    "rain": 0.30
}


# ==================================================
# 2. GENERAL UTILITIES
# ==================================================

def clamp(value: float) -> float:
    return round(max(0.0, min(100.0, value)), 2)


def classify_risk(score: float) -> str:

    if score < 25:
        return "Low"

    if score < 50:
        return "Moderate"

    if score < 75:
        return "High"

    return "Very High"


def valid_number(value):
    """Return a finite number or None."""

    if value is None:
        return None

    try:
        number = float(value)

        if not __import__("math").isfinite(number):
            return None

        return number

    except (ValueError, TypeError):
        return None


# ==================================================
# 3. HEAT HAZARD ENGINE
# ==================================================

def calculate_heat_hazard(
    apparent_temperature,
    temperature,
    humidity
):

    apparent_temperature = valid_number(
        apparent_temperature
    )

    temperature = valid_number(temperature)
    humidity = valid_number(humidity)

    temp = (
        apparent_temperature
        if apparent_temperature is not None
        else temperature
    )

    if temp is None:
        return None, []

    evidence = []

    # Base screening score.
    if temp < 27:
        score = 10

    elif temp < 32:
        score = 30

    elif temp < 39:
        score = 60

    else:
        score = 85

    evidence.append(
        f"Apparent temperature: {temp}°C."
    )

    if temperature is not None:
        evidence.append(
            f"Actual modelled air temperature: "
            f"{temperature}°C."
        )

    if humidity is not None:

        evidence.append(
            f"Relative humidity: {humidity}%."
        )

        if humidity >= 70:
            score += 5

            evidence.append(
                "High relative humidity may increase "
                "heat discomfort."
            )

    if temp >= 32:
        evidence.append(
            "Elevated apparent temperature requires "
            "additional heat-health awareness."
        )

    return clamp(score), evidence


# ==================================================
# 4. AIR POLLUTION HAZARD ENGINE
# ==================================================

def calculate_air_hazard(
    us_aqi,
    pm25,
    pm10
):

    us_aqi = valid_number(us_aqi)
    pm25 = valid_number(pm25)
    pm10 = valid_number(pm10)

    evidence = []

    if us_aqi is not None:

        aqi = us_aqi

        if aqi <= 50:
            score = 10 + (aqi / 50) * 10

        elif aqi <= 100:
            score = 20 + ((aqi - 50) / 50) * 20

        elif aqi <= 150:
            score = 40 + ((aqi - 100) / 50) * 20

        elif aqi <= 200:
            score = 60 + ((aqi - 150) / 50) * 20

        else:
            score = 80 + min(
                (aqi - 200) / 100,
                1
            ) * 20

        evidence.append(
            f"Reported US AQI: {aqi}."
        )

    elif pm25 is not None:

        if pm25 <= 5:
            score = 10

        elif pm25 <= 15:
            score = 20

        elif pm25 <= 35:
            score = 40

        elif pm25 <= 55:
            score = 60

        elif pm25 <= 100:
            score = 80

        else:
            score = 95

        evidence.append(
            f"PM2.5-based screening estimate: {pm25} µg/m³."
        )

    else:
        return None, []

    if pm25 is not None:
        evidence.append(
            f"PM2.5 concentration: {pm25} µg/m³."
        )

    if pm10 is not None:
        evidence.append(
            f"PM10 concentration: {pm10} µg/m³."
        )

    if us_aqi is not None and us_aqi > 100:
        evidence.append(
            "US AQI exceeds 100; sensitive groups "
            "may need additional precautions."
        )

    return clamp(score), evidence


# ==================================================
# 5. RAINFALL HAZARD ENGINE
# ==================================================

def calculate_rain_hazard(daily_forecast):

    if not daily_forecast:
        return None, []

    rainfall_values = daily_forecast.get(
        "precipitation_sum", []
    )

    probability_values = daily_forecast.get(
        "precipitation_probability_max", []
    )

    rainfall_values = [
        valid_number(value)
        for value in rainfall_values
    ]

    probability_values = [
        valid_number(value)
        for value in probability_values
    ]

    rainfall_values = [
        value for value in rainfall_values
        if value is not None
    ]

    probability_values = [
        value for value in probability_values
        if value is not None
    ]

    if not rainfall_values:
        return None, []

    max_rainfall = max(rainfall_values)

    probability = (
        max(probability_values)
        if probability_values
        else None
    )

    # Corrected baseline:
    # Zero rainfall begins with zero hazard intensity.
    if max_rainfall == 0:
        score = 0

    elif max_rainfall < 10:
        score = 10

    elif max_rainfall < 25:
        score = 25

    elif max_rainfall < 50:
        score = 45

    elif max_rainfall < 100:
        score = 70

    else:
        score = 90

    # Forecast probability can increase screening priority.
    if probability is not None:

        score += probability * 0.10

    evidence = [
        f"Maximum forecast daily rainfall: "
        f"{max_rainfall} mm."
    ]

    if probability is not None:

        evidence.append(
            f"Maximum forecast precipitation probability: "
            f"{probability}%."
        )

    if max_rainfall == 0 and (
        probability is None or probability == 0
    ):

        evidence.append(
            "No rainfall is indicated in the available "
            "forecast window."
        )

    elif max_rainfall >= 50:

        evidence.append(
            "Heavy forecast rainfall warrants checking "
            "official weather and flood advisories."
        )

    return clamp(score), evidence


# ==================================================
# 6. EXPOSURE AND VULNERABILITY CALCULATION
# ==================================================

def calculate_risk_score(
    hazard,
    exposure,
    vulnerability
):

    if hazard is None:
        return None

    return round(
        (hazard * exposure * vulnerability) / 10000,
        2
    )


# ==================================================
# 7. RECOMMENDATION ENGINE
# ==================================================

def generate_recommendations(
    hazard_scores,
    community_profile
):

    recommendations = []

    heat = hazard_scores.get("heat")
    air = hazard_scores.get("air")
    rain = hazard_scores.get("rain")

    if heat is not None and heat >= 40:

        recommendations.extend([
            "Maintain adequate hydration.",
            "Reduce prolonged outdoor exposure "
            "during hot periods.",
            "Follow official heat-health advisories."
        ])

    if air is not None and air >= 40:

        recommendations.extend([
            "Monitor official air-quality advisories.",
            "Reduce prolonged outdoor activity "
            "when air pollution is elevated."
        ])

    if rain is not None and rain >= 40:

        recommendations.extend([
            "Monitor official rainfall and flood warnings.",
            "Avoid walking or driving through floodwater.",
            "Use safe drinking water and maintain hygiene "
            "in flood-affected areas."
        ])

    if community_profile == "elderly":

        recommendations.append(
            "Check on older adults regularly during "
            "extreme weather."
        )

    elif community_profile == "children":

        recommendations.append(
            "Ensure children have safe drinking water "
            "and appropriate weather protection."
        )

    elif community_profile == "outdoor_workers":

        recommendations.extend([
            "Provide accessible drinking water and "
            "shaded rest areas.",
            "Review outdoor work schedules during "
            "unfavourable environmental conditions."
        ])

    elif community_profile == "flood_affected":

        recommendations.append(
            "Prioritize safe shelter, drinking water "
            "and hygiene awareness."
        )

    if not recommendations:

        recommendations.append(
            "Continue monitoring environmental conditions "
            "and follow official public-health advisories."
        )

    return list(dict.fromkeys(recommendations))


# ==================================================
# 8. EXPLANATION ENGINE
# ==================================================

def generate_explanation(
    overall_score,
    classification,
    dominant_hazard,
    hazard_results
):

    if overall_score is None:

        return {
            "summary": (
                "Insufficient environmental data for "
                "an overall assessment."
            ),
            "dominant_hazard": None,
            "contributing_factors": [],
            "important_hazards": [],
            "method": "Hazard x Exposure x Vulnerability"
        }

    important_hazards = []

    for name, result in hazard_results.items():

        if (
            result["classification"] in
            ["Moderate", "High", "Very High"]
        ):

            important_hazards.append({
                "hazard": name,
                "score": result["risk_score"],
                "classification": result["classification"]
            })

    factors = []

    for result in hazard_results.values():
        factors.extend(result["evidence"])

    if important_hazards:

        names = ", ".join(
            item["hazard"]
            for item in important_hazards
        )

        summary = (
            f"The overall composite screening priority is "
            f"{classification.lower()}, but additional "
            f"attention is warranted for: {names}."
        )

    else:

        summary = (
            f"The overall environmental health-risk "
            f"screening priority is {classification.lower()}."
        )

    return {

        "summary": summary,

        "dominant_hazard": dominant_hazard,

        "contributing_factors": factors,

        "important_hazards": important_hazards,

        "method": "Hazard x Exposure x Vulnerability"
    }


# ==================================================
# 9. INTEGRATED MULTI-HAZARD ENGINE
# ==================================================

def assess_climate_health_risk(
    environmental_data: dict[str, Any],
    community_profile: str = "general"
):

    if community_profile not in COMMUNITY_PROFILES:

        raise ValueError(
            "Unsupported community profile."
        )

    profile = COMMUNITY_PROFILES[community_profile]

    weather = environmental_data.get(
        "weather", {}
    )

    air = environmental_data.get(
        "air_quality", {}
    )

    daily_forecast = (
        environmental_data
        .get("forecast", {})
        .get("daily", {})
    )

    # Calculate individual hazards.
    heat_hazard, heat_evidence = calculate_heat_hazard(
        weather.get("feels_like_c"),
        weather.get("temperature_c"),
        weather.get("humidity_percent")
    )

    air_hazard, air_evidence = calculate_air_hazard(
        air.get("us_aqi"),
        air.get("pm25_ug_m3"),
        air.get("pm10_ug_m3")
    )

    rain_hazard, rain_evidence = calculate_rain_hazard(
        daily_forecast
    )

    hazards = {
        "heat": heat_hazard,
        "air": air_hazard,
        "rain": rain_hazard
    }

    evidence = {
        "heat": heat_evidence,
        "air": air_evidence,
        "rain": rain_evidence
    }

    # Calculate individual risk scores.
    hazard_results = {}

    for hazard_name, hazard_score in hazards.items():

        exposure = profile["exposure"][hazard_name]

        risk_score = calculate_risk_score(
            hazard_score,
            exposure,
            profile["vulnerability"]
        )

        hazard_results[hazard_name] = {

            "hazard_score": hazard_score,

            "exposure_score": exposure,

            "vulnerability_score": profile[
                "vulnerability"
            ],

            "risk_score": risk_score,

            "classification": (
                classify_risk(risk_score)
                if risk_score is not None
                else "Unavailable"
            ),

            "evidence": evidence[hazard_name]
        }

    # Identify hazards with usable data.
    available_hazards = [
        name
        for name, result in hazard_results.items()
        if result["risk_score"] is not None
    ]

    unavailable_hazards = [
        name
        for name, result in hazard_results.items()
        if result["risk_score"] is None
    ]

    # Normalize weights only across available hazards.
    overall_score = None
    classification = "Unavailable"
    dominant_hazard = None

    if available_hazards:

        available_weight = sum(
            HAZARD_WEIGHTS[name]
            for name in available_hazards
        )

        overall_score = sum(
            hazard_results[name]["risk_score"]
            * HAZARD_WEIGHTS[name]
            / available_weight
            for name in available_hazards
        )

        overall_score = round(overall_score, 2)

        classification = classify_risk(overall_score)

        dominant_hazard = max(
            available_hazards,
            key=lambda name: hazard_results[name]["risk_score"]
        )

    # Generate explanations.
    explanation = generate_explanation(
        overall_score,
        classification,
        dominant_hazard,
        hazard_results
    )

    # Generate recommendations.
    recommendations = generate_recommendations(
        hazards,
        community_profile
    )

    return {

        "assessment_id": (
            "CT-"
            + datetime.now(timezone.utc).strftime(
                "%Y%m%d%H%M%S%f"
            )
        ),

        "generated_at": datetime.now(
            timezone.utc
        ).isoformat(),

        "assessment_type": (
            "Environmental health-risk screening"
        ),

        "overall_risk": {
            "score": overall_score,
            "classification": classification,
            "dominant_hazard": dominant_hazard,
            "important_hazards": explanation[
                "important_hazards"
            ]
        },

        "hazards": hazard_results,

        "community": {
            "profile": community_profile,
            "label": profile["label"],
            "vulnerability_score": profile["vulnerability"],
            "profile_type": "Illustrative prototype profile"
        },

        "explanation": explanation,

        "recommendations": recommendations,

        "disease_suitability": {
            "status": "not_assessed",
            "reason": (
                "Verified disease surveillance and "
                "additional disease-specific indicators "
                "are not yet integrated."
            )
        },

        "data_quality": {

            "available_hazards": available_hazards,

            "unavailable_hazards": unavailable_hazards,

            "weights_normalized": bool(available_hazards),

            "limitations": [
                "Prototype screening model, not a validated "
                "clinical prediction model.",
                "Rainfall screening does not confirm flooding.",
                "Community profiles are illustrative, not "
                "measured local demographic data.",
                "Environmental model data may differ from "
                "conditions at the exact selected location.",
                "Risk classifications use prototype thresholds."
            ]
        }
    }
