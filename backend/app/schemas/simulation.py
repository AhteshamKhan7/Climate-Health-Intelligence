from pydantic import BaseModel, Field

from app.schemas.risk import CommunityProfile


class SimulationRequest(BaseModel):
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

    location_name: str | None = Field(
        default=None,
        max_length=100
    )

    community_profile: CommunityProfile = "general"

    # Optional scenario changes.
    # Only supplied values will be changed.

    temperature_c: float | None = Field(
        default=None,
        ge=-50,
        le=65,
        description="Simulated air temperature in Celsius"
    )

    apparent_temperature_c: float | None = Field(
        default=None,
        ge=-60,
        le=70,
        description="Simulated apparent temperature in Celsius"
    )

    humidity_percent: float | None = Field(
        default=None,
        ge=0,
        le=100
    )

    us_aqi: float | None = Field(
        default=None,
        ge=0,
        le=500
    )

    pm25_ug_m3: float | None = Field(
        default=None,
        ge=0,
        le=1000
    )

    pm10_ug_m3: float | None = Field(
        default=None,
        ge=0,
        le=2000
    )

    max_daily_rainfall_mm: float | None = Field(
        default=None,
        ge=0,
        le=1000
    )

    precipitation_probability_percent: float | None = Field(
        default=None,
        ge=0,
        le=100
    )