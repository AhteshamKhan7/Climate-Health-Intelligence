import asyncio

from app.services.open_meteo import (
    get_environmental_data,
    EnvironmentalDataError
)

from app.engine.risk_engine import (
    assess_climate_health_risk
)


async def assess_single_location(location, community_profile):
    """
    Fetch environmental data and calculate risk
    for one geographic location.
    """

    try:
        environmental_data = await get_environmental_data(
            location.latitude,
            location.longitude
        )

        assessment = assess_climate_health_risk(
            environmental_data=environmental_data,
            community_profile=community_profile
        )

        overall_risk = assessment["overall_risk"]

        hazards = assessment["hazards"]

        return {
            "location": {
                "name": location.name,
                "latitude": location.latitude,
                "longitude": location.longitude
            },

            "status": "success",

            "overall_risk_score": overall_risk["score"],

            "classification": overall_risk["classification"],

            "dominant_hazard": overall_risk["dominant_hazard"],

            "hazard_scores": {
                hazard: result["risk_score"]
                for hazard, result in hazards.items()
            },

            "assessment": assessment,

            "error": None
        }

    except EnvironmentalDataError as exc:

        return {
            "location": {
                "name": location.name,
                "latitude": location.latitude,
                "longitude": location.longitude
            },

            "status": "failed",

            "overall_risk_score": None,

            "classification": "Unavailable",

            "dominant_hazard": None,

            "hazard_scores": {
                "heat": None,
                "air": None,
                "rain": None
            },

            "assessment": None,

            "error": str(exc)
        }


async def compare_geographic_locations(
    locations,
    community_profile="general"
):
    """
    Assess multiple locations concurrently,
    then rank them by overall screening score.
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

    # Highest available risk score appears first.
    results.sort(
        key=lambda item: (
            item["overall_risk_score"] is None,
            -(item["overall_risk_score"] or 0)
        )
    )

    # Assign ranks only to locations with a score.
    rank = 1

    for result in results:

        if result["overall_risk_score"] is not None:
            result["rank"] = rank
            rank += 1
        else:
            result["rank"] = None

    successful_count = sum(
        1 for item in results
        if item["status"] == "success"
    )

    failed_count = len(results) - successful_count

    return {
        "community_profile": community_profile,

        "total_locations": len(results),

        "successful_assessments": successful_count,

        "failed_assessments": failed_count,

        "ranking_method": (
            "Descending order of overall composite "
            "environmental health-risk screening score."
        ),

        "results": results,

        "limitations": [
            "Scores are prototype screening estimates, "
            "not validated clinical predictions.",

            "Community profiles are illustrative assumptions.",

            "Location rankings depend on environmental "
            "data availability and model grid resolution.",

            "A higher screening score does not confirm "
            "that a location has experienced a health emergency."
        ]
    }