
from app.engine.geographic_insights import (
    generate_geographic_insights
)


def sample_results():
    return [
        {
            "location": {"name": "Mumbai"},
            "status": "success",
            "overall_risk_score": 30.24,
            "classification": "Moderate",
            "dominant_hazard": "heat",
            "rank": 1,
            "hazard_scores": {
                "heat": 45.90,
                "air": 39.59,
                "rain": 0
            },
            "assessment": {
                "recommendations": [
                    "Maintain adequate hydration."
                ]
            }
        },
        {
            "location": {"name": "Pune"},
            "status": "success",
            "overall_risk_score": 18.80,
            "classification": "Low",
            "dominant_hazard": "air",
            "rank": 2,
            "hazard_scores": {
                "heat": 22.95,
                "air": 32.08,
                "rain": 0
            },
            "assessment": {
                "recommendations": []
            }
        },
        {
            "location": {"name": "Nagpur"},
            "status": "success",
            "overall_risk_score": 16.81,
            "classification": "Low",
            "dominant_hazard": "air",
            "rank": 3,
            "hazard_scores": {
                "heat": 22.95,
                "air": 25.43,
                "rain": 0
            },
            "assessment": {
                "recommendations": []
            }
        }
    ]


def test_highest_priority_location():
    result = generate_geographic_insights(sample_results())

    assert result["highest_priority_location"]["name"] == "Mumbai"
    assert result["highest_priority_location"]["score"] == 30.24


def test_highest_individual_hazard():
    result = generate_geographic_insights(sample_results())

    hazard = result["highest_individual_hazard"]

    assert hazard["location"] == "Mumbai"
    assert hazard["hazard"] == "heat"
    assert hazard["score"] == 45.90


def test_moderate_hazards_are_not_hidden():
    result = generate_geographic_insights(sample_results())

    alerted_locations = {
        item["location"]
        for item in result["hazard_alerts"]
    }

    assert "Mumbai" in alerted_locations
    assert "Pune" in alerted_locations
    assert "Nagpur" in alerted_locations


def test_location_actions_are_generated():
    result = generate_geographic_insights(sample_results())

    mumbai = next(
        item for item in result["location_actions"]
        if item["location"] == "Mumbai"
    )

    assert len(mumbai["recommended_actions"]) > 0


def test_failed_locations_are_reported():
    results = sample_results()

    results.append({
        "location": {"name": "Failed City"},
        "status": "failed",
        "overall_risk_score": None
    })

    result = generate_geographic_insights(results)

    assert result["data_availability"][
        "failed_or_unavailable_locations"
    ] == 1

    assert "Failed City" in result["data_availability"][
        "unavailable_location_names"
    ]


def test_no_successful_locations():
    result = generate_geographic_insights([
        {
            "location": {"name": "Failed City"},
            "status": "failed",
            "overall_risk_score": None
        }
    ])

    assert result["status"] == "insufficient_data"
    assert result["highest_priority_location"] is None
    assert result["hazard_alerts"] == []
