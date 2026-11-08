
import asyncio
import logging
import json

from app.services.open_meteo import (
    get_environmental_data,
    EnvironmentalDataError
)

from app.engine.risk_engine import (
    assess_climate_health_risk
)


logger = logging.getLogger(__name__)


# ==================================================
# 1. ENVIRONMENTAL DEBUG INFORMATION
# ==================================================

def build_environmental_debug(environmental_data):
    """
    Extract environmental readings and provider metadata.
    """

    metadata = environmental_data.get("metadata", {})
    weather = environmental_data.get("weather", {})
    air = environmental_data.get("air_quality", {})

    return {
        "provider": metadata.get("provider"),
        "retrieved_at": metadata.get("retrieved_at"),

        "weather_data_time": metadata.get("weather_data_time"),
        "air_quality_data_time": metadata.get("air_quality_data_time"),

        "requested_location": environmental_data.get("location"),

        "weather_grid_location": metadata.get(
            "weather_grid_location"
        ),

        "air_quality_grid_location": metadata.get(
            "air_quality_grid_location"
        ),

        "weather_readings": {
            "temperature_c": weather.get("temperature_c"),
            "feels_like_c": weather.get("feels_like_c"),
            "humidity_percent": weather.get("humidity_percent"),
            "precipitation_mm": weather.get("precipitation_mm"),
            "rain_mm": weather.get("rain_mm"),
            "wind_speed_kmh": weather.get("wind_speed_kmh")
        },

        "air_quality_readings": {
            "us_aqi": air.get("us_aqi"),
            "european_aqi": air.get("european_aqi"),
            "pm25_ug_m3": air.get("pm25_ug_m3"),
            "pm10_ug_m3": air.get("pm10_ug_m3"),
            "nitrogen_dioxide_ug_m3": air.get(
                "nitrogen_dioxide_ug_m3"
            ),
            "ozone_ug_m3": air.get("ozone_ug_m3")
        }
    }


# ==================================================
# 2. SINGLE LOCATION ASSESSMENT
# ==================================================

async def assess_single_location(location, community_profile):
    """
    Assess one location using its own coordinates.

    IMPORTANT:
    hazard_scores = raw hazard intensity.
    risk_scores = community-adjusted risk.
    """

    location_information = {
        "name": location.name,
        "latitude": location.latitude,
        "longitude": location.longitude
    }

    try:

        # Fetch environmental information for this location.

        environmental_data = await get_environmental_data(
            location.latitude,
            location.longitude
        )

        if not environmental_data.get("success"):
            raise EnvironmentalDataError(
                "Environmental service returned unsuccessful data."
            )

        # Preserve raw environmental information.

        environmental_debug = build_environmental_debug(
            environmental_data
        )

        # Run the existing risk engine.

        assessment = assess_climate_health_risk(
            environmental_data=environmental_data,
            community_profile=community_profile
        )

        overall_risk = assessment.get("overall_risk", {})
        hazards = assessment.get("hazards", {})

        # --------------------------------------------------
        # CRITICAL CORRECTION
        # --------------------------------------------------
        # Extract RAW hazard scores, not adjusted risk scores.
        #
        # Previously:
        # result.get("risk_score")
        #
        # Correct:
        # result.get("hazard_score")
        #
        # The community API will apply exposure and
        # vulnerability exactly once.

        hazard_scores = {
            hazard: result.get("hazard_score")
            for hazard, result in hazards.items()
        }

        # Keep adjusted scores separately.

        risk_scores = {
            hazard: result.get("risk_score")
            for hazard, result in hazards.items()
        }

        logger.info(
            "Geographic assessment: %s | "
            "Coordinates: (%s, %s) | "
            "Raw hazards: %s | "
            "Adjusted risks: %s | "
            "Overall: %s",
            location.name,
            location.latitude,
            location.longitude,
            hazard_scores,
            risk_scores,
            overall_risk.get("score")
        )

        return {
            "location": location_information,

            "status": "success",

            "overall_risk_score": overall_risk.get("score"),

            "classification": overall_risk.get(
                "classification",
                "Unavailable"
            ),

            "dominant_hazard": overall_risk.get(
                "dominant_hazard"
            ),

            # Raw hazard intensity for map layers
            # and community assessment requests.
            "hazard_scores": hazard_scores,

            # Exposure/vulnerability-adjusted scores.
            "risk_scores": risk_scores,

            "environmental_debug": environmental_debug,

            "assessment": assessment,

            "error": None
        }

    except EnvironmentalDataError as exc:

        logger.warning(
            "Environmental data unavailable for %s: %s",
            location.name,
            str(exc)
        )

        return {
            "location": location_information,
            "status": "failed",
            "overall_risk_score": None,
            "classification": "Unavailable",
            "dominant_hazard": None,

            "hazard_scores": {
                "heat": None,
                "air": None,
                "rain": None
            },

            "risk_scores": {
                "heat": None,
                "air": None,
                "rain": None
            },

            "environmental_debug": None,
            "assessment": None,
            "error": str(exc)
        }

    except Exception as exc:

        logger.exception(
            "Unexpected geographic assessment error for %s",
            location.name
        )

        return {
            "location": location_information,
            "status": "failed",
            "overall_risk_score": None,
            "classification": "Unavailable",
            "dominant_hazard": None,

            "hazard_scores": {
                "heat": None,
                "air": None,
                "rain": None
            },

            "risk_scores": {
                "heat": None,
                "air": None,
                "rain": None
            },

            "environmental_debug": None,
            "assessment": None,
            "error": f"Unexpected assessment error: {str(exc)}"
        }


# ==================================================
# 3. MULTI-LOCATION GEOGRAPHIC ASSESSMENT
# ==================================================

async def compare_geographic_locations(
    locations,
    community_profile="general"
):
    """
    Assess multiple geographic locations concurrently.

    Each location is fetched using its own coordinates.
    """

    semaphore = asyncio.Semaphore(2)

    async def limited_assessment(location):

        async with semaphore:

            return await assess_single_location(
                location,
                community_profile
            )

    results = await asyncio.gather(
        *[
            limited_assessment(location)
            for location in locations
        ]
    )

    # --------------------------------------------------
    # SORT RESULTS
    # --------------------------------------------------

    results.sort(
        key=lambda item: (
            item["overall_risk_score"] is None,
            -(
                item["overall_risk_score"]
                if item["overall_risk_score"] is not None
                else 0
            )
        )
    )

    # --------------------------------------------------
    # ASSIGN RANKS
    # --------------------------------------------------

    rank = 1

    for result in results:

        if result["overall_risk_score"] is not None:
            result["rank"] = rank
            rank += 1
        else:
            result["rank"] = None

    # --------------------------------------------------
    # ASSESSMENT COUNTS
    # --------------------------------------------------

    successful_results = [
        item for item in results
        if item["status"] == "success"
    ]

    successful_count = len(successful_results)
    failed_count = len(results) - successful_count

    # --------------------------------------------------
    # SCORE DIAGNOSTICS
    # --------------------------------------------------

    overall_scores = [
        item["overall_risk_score"]
        for item in successful_results
        if item["overall_risk_score"] is not None
    ]

    unique_overall_scores = sorted(set(overall_scores))

    weather_grid_locations = {
        json.dumps(
            item["environmental_debug"]["weather_grid_location"],
            sort_keys=True
        )
        for item in successful_results
        if item.get("environmental_debug")
        and item["environmental_debug"].get("weather_grid_location")
    }

    air_grid_locations = {
        json.dumps(
            item["environmental_debug"]["air_quality_grid_location"],
            sort_keys=True
        )
        for item in successful_results
        if item.get("environmental_debug")
        and item["environmental_debug"].get("air_quality_grid_location")
    }

    score_diagnostics = {
        "locations_assessed": successful_count,

        "unique_overall_scores": len(unique_overall_scores),

        "overall_scores_are_identical": (
            len(unique_overall_scores) <= 1
            if overall_scores
            else None
        ),

        "unique_weather_grid_locations": len(
            weather_grid_locations
        ),

        "unique_air_quality_grid_locations": len(
            air_grid_locations
        ),

        "note": (
            "Different coordinates can share environmental "
            "model grid cells. Identical readings must not be "
            "artificially modified."
        )
    }

    logger.info(
        "Geographic comparison completed: "
        "%s successful, %s failed, "
        "%s unique overall scores.",
        successful_count,
        failed_count,
        len(unique_overall_scores)
    )

    # --------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------

    return {
        "community_profile": community_profile,

        "total_locations": len(results),

        "successful_assessments": successful_count,

        "failed_assessments": failed_count,

        "ranking_method": (
            "Descending order of overall composite "
            "environmental health-risk screening score."
        ),

        "score_diagnostics": score_diagnostics,

        "results": results,

        "limitations": [
            (
                "Scores are prototype screening estimates, "
                "not validated clinical predictions."
            ),

            (
                "Community profiles are illustrative assumptions, "
                "not measured ward-level demographic data."
            ),

            (
                "Nearby locations may share environmental "
                "model grid cells and receive identical readings."
            ),

            (
                "Location rankings depend on environmental "
                "data availability and model grid resolution."
            ),

            (
                "Hazard intensity and community-adjusted risk "
                "are separate measurements."
            ),

            (
                "A higher screening score does not confirm "
                "that a location has experienced a health emergency."
            )
        ]
    }
