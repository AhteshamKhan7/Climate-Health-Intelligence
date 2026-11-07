from typing import Literal, Optional

from pydantic import BaseModel, Field

from app.schemas.risk import CommunityProfile


class AlertEvaluationRequest(BaseModel):
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)

    location_name: Optional[str] = Field(
        default=None,
        max_length=100
    )

    community_profile: CommunityProfile = "general"


class AlertStatusUpdate(BaseModel):
    status: Literal[
        "active",
        "acknowledged",
        "resolved"
    ]