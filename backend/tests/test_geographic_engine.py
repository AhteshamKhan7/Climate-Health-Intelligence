import asyncio
from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from app.engine import geographic_engine
from app.engine.geographic_engine import (
    compare_geographic_locations
)
from app.services.open_meteo import EnvironmentalDataError
from app.schemas.geographic import (
    GeographicAssessmentRequest
)


def make_location(name, latitude, longitude):
    return SimpleNamespace(
        name=name,
        latitude=latitude,
        longitude=longitude
    )


def fake_assessment(score, heat, air, rain):
    classification = (
        "Very High" if score >= 75
        else "High" if score >= 50
        else "Moderate" if score >= 25
        else "Low"
    )

    return {
        "overall_risk": {
            "score": score,
            "classification": classification,
            "dominant_hazard": "heat"
        },
        "hazards": {
            "heat": {"risk_score": heat},
            "air": {"risk_score": air},
            "rain": {"risk_score": rain}
        }
    }


def test_locations_are_ranked_highest_risk_first(monkeypatch):

    async def fake_environment(latitude, longitude):
        return {"test_latitude": latitude}

    def fake_risk_engine(environmental_data, community_profile):
        latitude = environmental_data["test_latitude"]

        if latitude == 1:
            return fake_assessment(20, 20, 10, 0)

        if latitude == 2:
            return fake_assessment(60, 60, 30, 0)

        return fake_assessment(40, 30, 40, 0)

    monkeypatch.setattr(
        geographic_engine,
        "get_environmental_data",
        fake_environment
    )

    monkeypatch.setattr(
        geographic_engine,
        "assess_climate_health_risk",
        fake_risk_engine
    )

    locations = [
        make_location("Pune", 1, 73),
        make_location("Mumbai", 2, 72),
        make_location("Nagpur", 3, 79)
    ]

    result = asyncio.run(
        compare_geographic_locations(
            locations,
            "outdoor_workers"
        )
    )

    ranked_names = [
        item["location"]["name"]
        for item in result["results"]
    ]

    assert ranked_names == ["Mumbai", "Nagpur", "Pune"]


def test_rank_numbers_are_assigned_correctly(monkeypatch):

    async def fake_environment(latitude, longitude):
        return {"test_latitude": latitude}

    def fake_risk_engine(environmental_data, community_profile):
        return fake_assessment(50, 50, 40, 0)

    monkeypatch.setattr(
        geographic_engine,
        "get_environmental_data",
        fake_environment
    )

    monkeypatch.setattr(
        geographic_engine,
        "assess_climate_health_risk",
        fake_risk_engine
    )

    locations = [
        make_location("Pune", 1, 73),
        make_location("Mumbai", 2, 72)
    ]

    result = asyncio.run(
        compare_geographic_locations(locations)
    )

    ranks = [
        item["rank"]
        for item in result["results"]
    ]

    assert ranks == [1, 2]


def test_failed_location_does_not_stop_other_assessments(
    monkeypatch
):

    async def fake_environment(latitude, longitude):

        if latitude == 0:
            raise EnvironmentalDataError(
                "Test environmental API failure"
            )

        return {"test_latitude": latitude}

    def fake_risk_engine(environmental_data, community_profile):
        return fake_assessment(35, 35, 20, 0)

    monkeypatch.setattr(
        geographic_engine,
        "get_environmental_data",
        fake_environment
    )

    monkeypatch.setattr(
        geographic_engine,
        "assess_climate_health_risk",
        fake_risk_engine
    )

    locations = [
        make_location("Pune", 1, 73),
        make_location("Failed location", 0, 72),
        make_location("Nagpur", 3, 79)
    ]

    result = asyncio.run(
        compare_geographic_locations(locations)
    )

    assert result["total_locations"] == 3
    assert result["successful_assessments"] == 2
    assert result["failed_assessments"] == 1

    failed = next(
        item for item in result["results"]
        if item["location"]["name"] == "Failed location"
    )

    assert failed["status"] == "failed"
    assert failed["overall_risk_score"] is None
    assert failed["rank"] is None


def test_geographic_request_requires_at_least_two_locations():

    with pytest.raises(ValidationError):

        GeographicAssessmentRequest(
            locations=[
                {
                    "name": "Pune",
                    "latitude": 18.5204,
                    "longitude": 73.8567
                }
            ]
        )


def test_geographic_request_rejects_more_than_ten_locations():

    locations = [
        {
            "name": f"Location {i}",
            "latitude": 18.0,
            "longitude": 73.0
        }
        for i in range(11)
    ]

    with pytest.raises(ValidationError):

        GeographicAssessmentRequest(
            locations=locations
        )


def test_geographic_request_rejects_invalid_coordinates():

    with pytest.raises(ValidationError):

        GeographicAssessmentRequest(
            locations=[
                {
                    "name": "Invalid",
                    "latitude": 120,
                    "longitude": 73
                },
                {
                    "name": "Pune",
                    "latitude": 18.5204,
                    "longitude": 73.8567
                }
            ]
        )