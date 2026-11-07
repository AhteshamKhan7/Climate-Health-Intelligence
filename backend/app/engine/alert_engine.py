
from datetime import datetime, timezone

from app.services.alerts import create_or_update_alert


SEVERITY_THRESHOLDS = {
    "moderate": 25,
    "high": 50,
    "critical": 75
}


def classify_alert_severity(score: float) -> str | None:
    """Classify a risk score into an alert severity."""

    if score >= SEVERITY_THRESHOLDS["critical"]:
        return "critical"

    if score >= SEVERITY_THRESHOLDS["high"]:
        return "high"

    if score >= SEVERITY_THRESHOLDS["moderate"]:
        return "moderate"

    return None


def build_alert_message(
    hazard: str,
    severity: str,
    score: float,
    location_name: str,
    community_profile: str
) -> tuple[str, str]:

    hazard_labels = {
        "overall": "Overall climate-health risk",
        "heat": "Heat risk",
        "air": "Air pollution risk",
        "rain": "Rainfall risk"
    }

    label = hazard_labels.get(hazard, hazard.title())

    title = f"{severity.title()} {label} Alert - {location_name}"

    message = (
        f"{label} has reached a {severity} screening level "
        f"with a score of {score}. "
        f"Location: {location_name}. "
        f"Community profile: {community_profile}. "
        "Follow relevant official weather, air-quality "
        "and public-health advisories."
    )

    return title, message


def evaluate_assessment_for_alerts(
    assessment: dict,
    location: dict,
    community_profile: str
) -> dict:
    """
    Evaluate an existing ClimateTwin assessment.

    Overall risk and individual hazard scores are evaluated
    separately. Only Moderate, High and Critical scores
    generate alerts.
    """

    overall = assessment.get("overall_risk", {})
    hazards = assessment.get("hazards", {})

    location_name = (
        location.get("name")
        or "Unknown location"
    )

    candidates = []

    overall_score = overall.get("score")

    if overall_score is not None:
        candidates.append({
            "hazard": "overall",
            "score": overall_score
        })

    for hazard in ["heat", "air", "rain"]:

        hazard_data = hazards.get(hazard, {})
        score = hazard_data.get("risk_score")

        if score is not None:
            candidates.append({
                "hazard": hazard,
                "score": score
            })

    generated_alerts = []
    skipped_alerts = []

    for candidate in candidates:

        hazard = candidate["hazard"]
        score = candidate["score"]

        severity = classify_alert_severity(score)

        if severity is None:
            skipped_alerts.append({
                "hazard": hazard,
                "score": score,
                "reason": "Risk score is below the alert threshold."
            })
            continue

        title, message = build_alert_message(
            hazard=hazard,
            severity=severity,
            score=score,
            location_name=location_name,
            community_profile=community_profile
        )

        alert = {
            "location_name": location_name,
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "community_profile": community_profile,
            "hazard": hazard,
            "risk_score": score,
            "severity": severity,
            "title": title,
            "message": message,
            "assessment_id": assessment.get("assessment_id"),
            "generated_at": datetime.now(
                timezone.utc
            ).isoformat()
        }

        stored_alert = create_or_update_alert(alert)

        generated_alerts.append(stored_alert)

    return {
        "evaluation_status": "completed",
        "location": location_name,
        "community_profile": community_profile,
        "total_evaluated": len(candidates),
        "alerts_generated": len(generated_alerts),
        "alerts": generated_alerts,
        "below_threshold": skipped_alerts,
        "notice": (
            "Alerts are generated using ClimateTwin's "
            "prototype screening thresholds. They are not "
            "official emergency warnings or validated "
            "health predictions."
        )
    }
