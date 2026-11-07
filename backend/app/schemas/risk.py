
from typing import Literal

from pydantic import BaseModel, Field


CommunityProfile = Literal[
    "general",
    "elderly",
    "children",
    "outdoor_workers",
    "flood_affected"
]


class AssessmentRequest(BaseModel):

    latitude: float = Field(
        ...,
        ge=-90,
        le=90,
        description="Location latitude"
    )

    longitude: float = Field(
        ...,
        ge=-180,
        le=180,
        description="Location longitude"
    )

    community_profile: CommunityProfile = Field(
        default="general",
        description="Selected community vulnerability profile"
    )

    location_name: str | None = Field(
        default=None,
        max_length=100
    )
