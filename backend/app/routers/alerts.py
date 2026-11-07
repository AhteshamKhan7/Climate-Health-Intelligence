
from typing import Optional, Literal

from fastapi import APIRouter, HTTPException, Query

from app.schemas.alerts import (
    AlertEvaluationRequest,
    AlertStatusUpdate,
)
from app.services.open_meteo import (
    get_environmental_data,
    EnvironmentalDataError,
)
from app.engine.risk_engine import assess_climate_health_risk
from app.engine.alert_engine import evaluate_assessment_for_alerts
from app.services.alerts import (
    get_alerts,
    get_alert_by_id,
    update_alert_status,
)

router = APIRouter(
    prefix="/api/alerts",
    tags=["Automated Alerts"],
)


@router.post("/evaluate")
async def evaluate_location_alerts(
    request: AlertEvaluationRequest,
):
    try:
        environmental_data = await get_environmental_data(
            request.latitude,
            request.longitude,
        )

        assessment = assess_climate_health_risk(
            environmental_data,
            request.community_profile,
        )

        location = {
            "name": request.location_name or "Selected Location",
            "latitude": request.latitude,
            "longitude": request.longitude,
        }

        alert_result = evaluate_assessment_for_alerts(
            assessment=assessment,
            location=location,
            community_profile=request.community_profile,
        )

        return {
            "success": True,
            "data_source": environmental_data.get("metadata"),
            "overall_risk": assessment.get("overall_risk"),
            "evaluation": alert_result,
            "notice": (
                "Alerts are generated from prototype screening "
                "thresholds. They are not official emergency "
                "warnings or validated health predictions."
            ),
        }

    except EnvironmentalDataError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Environmental data service error: {str(exc)}",
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )


@router.get("")
def list_alerts(
    location: Optional[str] = Query(default=None),
    community_profile: Optional[str] = Query(default=None),
    status: Optional[
        Literal["active", "acknowledged", "resolved"]
    ] = Query(default=None),
    severity: Optional[
        Literal["moderate", "high", "critical"]
    ] = Query(default=None),
    limit: int = Query(default=50, ge=1, le=500),
):
    results = get_alerts(
        location=location,
        community_profile=community_profile,
        status=status,
        severity=severity,
        limit=limit,
    )

    return {
        "success": True,
        "count": len(results),
        "filters": {
            "location": location,
            "community_profile": community_profile,
            "status": status,
            "severity": severity,
            "limit": limit,
        },
        "alerts": results,
    }


@router.get("/{alert_id}")
def get_alert_details(alert_id: str):
    alert = get_alert_by_id(alert_id)

    if alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found",
        )

    return {
        "success": True,
        "alert": alert,
    }


@router.patch("/{alert_id}/status")
def change_alert_status(
    alert_id: str,
    request: AlertStatusUpdate,
):
    updated_alert = update_alert_status(
        alert_id,
        request.status,
    )

    if updated_alert is None:
        raise HTTPException(
            status_code=404,
            detail="Alert not found",
        )

    return {
        "success": True,
        "message": "Alert status updated successfully",
        "alert": updated_alert,
    }
