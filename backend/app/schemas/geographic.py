from typing import Literal

from pydantic import BaseModel, Field


CommunityProfileType = Literal[
    "general",
    "elderly",
    "children",
    "outdoor_workers",
    "flood_affected"
]


class GeographicLocation(BaseModel):
    name: str = Field(min_length=1, max_length=100)

    latitude: float = Field(ge=-90, le=90)

    longitude: float = Field(ge=-180, le=180)


class GeographicAssessmentRequest(BaseModel):
    locations: list[GeographicLocation] = Field(
        min_length=2,
        max_length=10
    )

    community_profile: CommunityProfileType = "general"