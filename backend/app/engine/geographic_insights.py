
from typing import Any


def classify_priority(score: float) -> str:
    """Classify a screening score using existing prototype thresholds."""

    if score < 25:
        return "Low"
    if score < 50:
        return "Moderate"
    if score < 75:
        return "High"
    return "Very High"


HAZARD_LABELS = {
    "heat": "Heat",
    "air": "Air pollution",
    "rain": "Rainfall"
}


HAZARD_ACTIONS = {
    "heat": [
        "Maintain adequate drinking water access.",
        "Provide shaded rest areas for outdoor workers.",
        "Review outdoor work schedules during hot periods.",
        "Follow official heat-health advisories."
    ],
    "air": [
        "Monitor official air-quality advisories.",
        "Reduce prolonged outdoor exposure when pollution is elevated.",
        "Consider additional precautions for sensitive groups."
    ],
    "rain": [
        "Monitor official rainfall and flood warnings.",
        "Avoid walking or driving through floodwater.",
        "Follow local safe-water and hygiene guidance."
    ]
}


def generate_geographic_insights(
    geographic_results: list[dict[str, Any]]
) -> dict[str, Any]:
    """
    Generate explainable geographic priority insights.

    Scores are existing community-adjusted screening risk scores.
    They are not measured population health outcomes.
    """

    successful = [
        item for item in geographic_results
        if (
            item.get("status") == "success"
            and item.get("overall_risk_score") is not None
        )
    ]

    failed = [
        item for item in geographic_results
        if item.get("status") != "success"
        or item.get("overall_risk_score") is None
    ]

    if not successful:
        return {
            "status": "insufficient_data",
            "highest_priority_location": None,
            "highest_individual_hazard": None,
            "hazard_alerts": [],
            "location_actions": [],
            "data_availability": {
                "successful_locations": 0,
                "failed_or_unavailable_locations": len(failed),
                "unavailable_location_names": [
                    item.get("location", {}).get("name", "Unknown")
                    for item in failed
                ]
            },
            "summary": (
                "No successful location assessments are available. "
                "Check environmental data availability and retry."
            )
        }

    # Identify the location with the highest overall score.
    highest_location = max(
        successful,
        key=lambda item: item["overall_risk_score"]
    )

    highest_priority_location = {
        "name": highest_location["location"]["name"],
        "score": highest_location["overall_risk_score"],
        "classification": highest_location["classification"],
        "dominant_hazard": highest_location.get("dominant_hazard"),
        "rank": highest_location.get("rank")
    }

    # Find the highest individual community-adjusted hazard risk.
    hazard_observations = []

    for location in successful:
        for hazard, score in location.get("hazard_scores", {}).items():

            if score is None:
                continue

            hazard_observations.append({
                "location": location["location"]["name"],
                "hazard": hazard,
                "hazard_label": HAZARD_LABELS.get(
                    hazard, hazard.replace("_", " ").title()
                ),
                "score": score,
                "classification": classify_priority(score)
            })

    highest_hazard = (
        max(
            hazard_observations,
            key=lambda item: item["score"]
        )
        if hazard_observations
        else None
    )

    # Detect moderate, high and very-high individual hazards.
    hazard_alerts = []

    for observation in hazard_observations:

        if observation["score"] >= 25:

            hazard_alerts.append({
                **observation,
                "priority": observation["classification"],
                "reason": (
                    f"{observation['hazard_label']} screening risk "
                    f"is {observation['classification'].lower()} "
                    f"in {observation['location']}."
                ),
                "recommended_actions": HAZARD_ACTIONS.get(
                    observation["hazard"], []
                )
            })

    hazard_alerts.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    # Build location-specific action summaries.
    location_actions = []

    for location in successful:

        location_hazards = [
            item for item in hazard_observations
            if item["location"] == location["location"]["name"]
            and item["score"] >= 25
        ]

        actions = []

        for item in location_hazards:
            actions.extend(
                HAZARD_ACTIONS.get(item["hazard"], [])
            )

        # Preserve original community recommendation output.
        assessment = location.get("assessment") or {}

        existing_recommendations = assessment.get(
            "recommendations", []
        )

        actions.extend(existing_recommendations)

        location_actions.append({
            "location": location["location"]["name"],
            "overall_score": location["overall_risk_score"],
            "classification": location["classification"],
            "priority_hazards": [
                item["hazard"]
                for item in location_hazards
            ],
            "recommended_actions": list(dict.fromkeys(actions))
        })

    # Summarize the overall geographic assessment.
    summary = (
        f"{highest_location['location']['name']} has the highest "
        f"overall screening score of "
        f"{highest_location['overall_risk_score']} "
        f"({highest_location['classification']})."
    )

    if highest_hazard:
        summary += (
            f" The highest individual hazard screening score is "
            f"{highest_hazard['hazard_label']} in "
            f"{highest_hazard['location']} "
            f"({highest_hazard['score']})."
        )

    return {
        "status": "success",

        "highest_priority_location": highest_priority_location,

        "highest_individual_hazard": highest_hazard,

        "hazard_alert_count": len(hazard_alerts),

        "hazard_alerts": hazard_alerts,

        "location_actions": location_actions,

        "data_availability": {
            "successful_locations": len(successful),
            "failed_or_unavailable_locations": len(failed),
            "unavailable_location_names": [
                item.get("location", {}).get("name", "Unknown")
                for item in failed
            ]
        },

        "summary": summary,

        "methodology_notice": (
            "Hazard values are community-adjusted screening risk "
            "scores from the prototype model. Alerts use the "
            "prototype classification thresholds. They are not "
            "validated health predictions or confirmed emergencies."
        )
    }
