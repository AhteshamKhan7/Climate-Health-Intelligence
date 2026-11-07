
from typing import Optional

from fastapi import APIRouter, Query

from app.schemas.risk import CommunityProfile
from app.services.history import get_assessment_history


router = APIRouter(
    prefix="/api/history",
    tags=["Historical Risk Intelligence"]
)


# ==================================================
# 1. RETRIEVE HISTORICAL ASSESSMENTS
# ==================================================

@router.get("")
async def retrieve_history(
    location: Optional[str] = Query(
        default=None,
        description="Filter assessments by location name"
    ),
    community_profile: Optional[CommunityProfile] = Query(
        default=None,
        description="Filter by community vulnerability profile"
    ),
    limit: int = Query(
        default=50,
        ge=1,
        le=500,
        description="Maximum number of records to return"
    )
):
    """
    Retrieve previously saved climate-health assessments.
    Results are returned newest first.
    """

    records = get_assessment_history(
        location_name=location,
        community_profile=community_profile,
        limit=limit
    )

    return {
        "success": True,
        "module": "Historical Risk Intelligence",
        "total_records": len(records),
        "filters": {
            "location": location,
            "community_profile": community_profile
        },
        "assessments": records
    }


# ==================================================
# 2. HISTORICAL RISK TRENDS
# ==================================================

def calculate_metric_trend(data_points, metric):
    """Calculate change between the first and last available values."""

    available_points = [
        point for point in data_points
        if point.get(metric) is not None
    ]

    if len(available_points) < 2:
        return {
            "status": "insufficient_data",
            "first_value": (
                available_points[0][metric]
                if available_points else None
            ),
            "latest_value": (
                available_points[-1][metric]
                if available_points else None
            ),
            "absolute_change": None,
            "percentage_change": None,
            "direction": "unknown"
        }

    first_value = available_points[0][metric]
    latest_value = available_points[-1][metric]

    change = round(latest_value - first_value, 2)

    if change > 0.01:
        direction = "increased"
    elif change < -0.01:
        direction = "decreased"
    else:
        direction = "unchanged"

    percentage_change = (
        round((change / first_value) * 100, 2)
        if first_value != 0
        else None
    )

    return {
        "status": "available",
        "first_value": first_value,
        "latest_value": latest_value,
        "absolute_change": change,
        "percentage_change": percentage_change,
        "direction": direction
    }


@router.get("/trends")
async def historical_risk_trends(
    location: str = Query(
        ...,
        min_length=1,
        max_length=100,
        description="Location to compare over time"
    ),
    community_profile: CommunityProfile = Query(
        default="general",
        description="Community profile to compare"
    ),
    limit: int = Query(
        default=500,
        ge=2,
        le=500,
        description="Maximum number of historical observations"
    )
):
    """
    Compare historical screening scores for one location
    and one community profile.

    At least two observations are required to calculate change.
    """

    records = get_assessment_history(
        location_name=location,
        community_profile=community_profile,
        limit=limit
    )

    # Keep chronological order: oldest first.
    records.sort(
        key=lambda item: item["generated_at"]
    )

    data_points = []

    for record in records:

        data_points.append({
            "assessment_id": record["assessment_id"],
            "generated_at": record["generated_at"],
            "location": record["location_name"],
            "overall_score": record["overall_score"],
            "classification": record["classification"],
            "heat_score": record["heat_score"],
            "air_score": record["air_score"],
            "rain_score": record["rain_score"]
        })

    if len(data_points) < 2:

        return {
            "success": True,
            "module": "Historical Risk Trend Analysis",
            "status": "insufficient_data",
            "message": (
                "At least two saved assessments for the "
                "same location and community profile are "
                "required to calculate historical changes."
            ),
            "location": location,
            "community_profile": community_profile,
            "observation_count": len(data_points),
            "data_points": data_points,
            "trends": None
        }

    metrics = [
        "overall_score",
        "heat_score",
        "air_score",
        "rain_score"
    ]

    trends = {
        metric: calculate_metric_trend(
            data_points,
            metric
        )
        for metric in metrics
    }

    return {
        "success": True,
        "module": "Historical Risk Trend Analysis",
        "status": "available",
        "location": location,
        "community_profile": community_profile,
        "observation_count": len(data_points),
        "period": {
            "first_assessment": data_points[0]["generated_at"],
            "latest_assessment": data_points[-1]["generated_at"]
        },
        "data_points": data_points,
        "trends": trends,
        "methodology": (
            "Changes are calculated between the earliest "
            "and latest available saved assessments. "
            "These are historical screening-score changes, "
            "not validated health outcome predictions."
        )
    }
