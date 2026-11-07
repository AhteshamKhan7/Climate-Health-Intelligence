from copy import deepcopy

from app.engine.risk_engine import assess_climate_health_risk


SCENARIO_FIELDS = [
    "temperature_c",
    "apparent_temperature_c",
    "humidity_percent",
    "us_aqi",
    "pm25_ug_m3",
    "pm10_ug_m3",
    "max_daily_rainfall_mm",
    "precipitation_probability_percent",
]


def apply_scenario_changes(
    environmental_data: dict,
    scenario_inputs: dict
) -> dict:
    """
    Create a separate environmental-data copy and
    apply only the scenario values supplied by the user.
    """

    scenario_data = deepcopy(environmental_data)

    weather = scenario_data.setdefault("weather", {})
    air = scenario_data.setdefault("air_quality", {})

    forecast = scenario_data.setdefault("forecast", {})
    daily = forecast.setdefault("daily", {})

    # Temperature
    if scenario_inputs.get("temperature_c") is not None:
        temperature = scenario_inputs["temperature_c"]

        weather["temperature_c"] = temperature

        # If apparent temperature is not explicitly supplied,
        # use the simulated temperature as a simple proxy.
        # This is not a new meteorological calculation.
        if scenario_inputs.get("apparent_temperature_c") is None:
            weather["feels_like_c"] = temperature

    if scenario_inputs.get("apparent_temperature_c") is not None:
        weather["feels_like_c"] = (
            scenario_inputs["apparent_temperature_c"]
        )

    # Humidity
    if scenario_inputs.get("humidity_percent") is not None:
        weather["humidity_percent"] = (
            scenario_inputs["humidity_percent"]
        )

    # Air quality
    if scenario_inputs.get("us_aqi") is not None:
        air["us_aqi"] = scenario_inputs["us_aqi"]

    if scenario_inputs.get("pm25_ug_m3") is not None:
        air["pm25_ug_m3"] = scenario_inputs["pm25_ug_m3"]

    if scenario_inputs.get("pm10_ug_m3") is not None:
        air["pm10_ug_m3"] = scenario_inputs["pm10_ug_m3"]

    # Rainfall
    if scenario_inputs.get("max_daily_rainfall_mm") is not None:
        daily["precipitation_sum"] = [
            scenario_inputs["max_daily_rainfall_mm"]
        ]

    if scenario_inputs.get(
        "precipitation_probability_percent"
    ) is not None:
        daily["precipitation_probability_max"] = [
            scenario_inputs[
                "precipitation_probability_percent"
            ]
        ]

    return scenario_data


def calculate_score_change(
    baseline_value,
    scenario_value
):
    if baseline_value is None or scenario_value is None:
        return {
            "baseline": baseline_value,
            "scenario": scenario_value,
            "change": None,
            "direction": "unavailable"
        }

    change = round(scenario_value - baseline_value, 2)

    if change > 0:
        direction = "increased"
    elif change < 0:
        direction = "decreased"
    else:
        direction = "unchanged"

    return {
        "baseline": baseline_value,
        "scenario": scenario_value,
        "change": change,
        "direction": direction
    }


def compare_assessments(
    baseline_assessment: dict,
    scenario_assessment: dict
):
    """
    Compare overall and individual hazard risk scores.
    """

    baseline_overall = baseline_assessment[
        "overall_risk"
    ]["score"]

    scenario_overall = scenario_assessment[
        "overall_risk"
    ]["score"]

    overall_change = calculate_score_change(
        baseline_overall,
        scenario_overall
    )

    hazard_changes = {}

    for hazard in ["heat", "air", "rain"]:

        baseline_score = baseline_assessment[
            "hazards"
        ][hazard]["risk_score"]

        scenario_score = scenario_assessment[
            "hazards"
        ][hazard]["risk_score"]

        hazard_changes[hazard] = calculate_score_change(
            baseline_score,
            scenario_score
        )

    return {
        "overall_risk": overall_change,
        "hazards": hazard_changes,
        "classification_changed": (
            baseline_assessment["overall_risk"]["classification"]
            != scenario_assessment["overall_risk"]["classification"]
        )
    }


def run_simulation(
    environmental_data: dict,
    scenario_inputs: dict,
    community_profile: str
):
    """
    Run baseline and scenario assessments using
    the same existing ClimateTwin risk engine.
    """

    baseline_assessment = assess_climate_health_risk(
        environmental_data=environmental_data,
        community_profile=community_profile
    )

    scenario_environment = apply_scenario_changes(
        environmental_data,
        scenario_inputs
    )

    scenario_assessment = assess_climate_health_risk(
        environmental_data=scenario_environment,
        community_profile=community_profile
    )

    comparison = compare_assessments(
        baseline_assessment,
        scenario_assessment
    )

    return {
        "baseline": baseline_assessment,
        "scenario": scenario_assessment,
        "comparison": comparison
    }