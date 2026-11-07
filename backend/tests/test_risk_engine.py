
from app.engine.risk_engine import (
    classify_risk,
    calculate_heat_hazard,
    calculate_air_hazard,
    calculate_rain_hazard,
    calculate_risk_score,
    assess_climate_health_risk
)


def test_risk_classification():

    assert classify_risk(10) == "Low"
    assert classify_risk(30) == "Moderate"
    assert classify_risk(60) == "High"
    assert classify_risk(85) == "Very High"


def test_heat_hazard():

    score, evidence = calculate_heat_hazard(
        apparent_temperature=40,
        temperature=38,
        humidity=75
    )

    assert score == 90
    assert len(evidence) >= 3


def test_heat_evidence_available_at_low_temperature():

    score, evidence = calculate_heat_hazard(
        apparent_temperature=30,
        temperature=29.8,
        humidity=33
    )

    assert score == 30
    assert len(evidence) >= 3

    assert any(
        "Apparent temperature" in item
        for item in evidence
    )


def test_missing_heat_data():

    score, evidence = calculate_heat_hazard(
        apparent_temperature=None,
        temperature=None,
        humidity=None
    )

    assert score is None
    assert evidence == []


def test_air_hazard():

    score, evidence = calculate_air_hazard(
        us_aqi=150,
        pm25=50,
        pm10=70
    )

    assert score == 60
    assert len(evidence) >= 3


def test_air_hazard_using_pm25_fallback():

    score, evidence = calculate_air_hazard(
        us_aqi=None,
        pm25=50,
        pm10=70
    )

    assert score == 60
    assert len(evidence) >= 2


def test_rain_hazard():

    forecast = {
        "precipitation_sum": [5, 60, 20],
        "precipitation_probability_max": [20, 80, 50]
    }

    score, evidence = calculate_rain_hazard(
        forecast
    )

    assert score == 78
    assert len(evidence) == 3

    assert any(
        "Heavy forecast rainfall" in item
        for item in evidence
    )

def test_zero_rainfall_baseline():

    forecast = {
        "precipitation_sum": [0, 0, 0],
        "precipitation_probability_max": [0, 0, 0]
    }

    score, evidence = calculate_rain_hazard(
        forecast
    )

    assert score == 0

    assert any(
        "No rainfall" in item
        for item in evidence
    )


def test_rainfall_probability_without_rain():

    forecast = {
        "precipitation_sum": [0, 0, 0],
        "precipitation_probability_max": [0, 50, 20]
    }

    score, evidence = calculate_rain_hazard(
        forecast
    )

    assert score == 5


def test_missing_rain_data():

    score, evidence = calculate_rain_hazard({})

    assert score is None
    assert evidence == []


def test_risk_formula():

    result = calculate_risk_score(
        hazard=80,
        exposure=90,
        vulnerability=85
    )

    assert result == 61.2


def test_complete_assessment():

    environmental_data = {

        "weather": {
            "temperature_c": 39,
            "feels_like_c": 40,
            "humidity_percent": 75
        },

        "air_quality": {
            "us_aqi": 150,
            "pm25_ug_m3": 50,
            "pm10_ug_m3": 70
        },

        "forecast": {
            "daily": {
                "precipitation_sum": [5, 60, 20],
                "precipitation_probability_max": [
                    20, 80, 50
                ]
            }
        }
    }

    result = assess_climate_health_risk(
        environmental_data,
        "outdoor_workers"
    )

    assert result["overall_risk"]["score"] is not None

    assert result["community"]["profile"] == (
        "outdoor_workers"
    )

    assert result["hazards"]["heat"]["risk_score"] is not None

    assert result["hazards"]["air"]["risk_score"] is not None

    assert result["hazards"]["rain"]["risk_score"] is not None

    assert len(result["recommendations"]) > 0

    assert result["disease_suitability"]["status"] == (
        "not_assessed"
    )


def test_moderate_hazard_is_not_hidden_by_low_overall():

    environmental_data = {

        "weather": {
            "temperature_c": 29.8,
            "feels_like_c": 30,
            "humidity_percent": 33
        },

        "air_quality": {
            "us_aqi": 110,
            "pm25_ug_m3": 35.9,
            "pm10_ug_m3": 42.3
        },

        "forecast": {
            "daily": {
                "precipitation_sum": [0, 0, 0],
                "precipitation_probability_max": [0, 0, 0]
            }
        }
    }

    result = assess_climate_health_risk(
        environmental_data,
        "outdoor_workers"
    )

    assert result["overall_risk"]["classification"] == "Low"

    assert result["hazards"]["air"]["classification"] == (
        "Moderate"
    )

    assert result["explanation"]["important_hazards"][0][
        "hazard"
    ] == "air"

    assert "air" in result["explanation"]["summary"].lower()


def test_missing_hazards_are_not_zero_risk():

    environmental_data = {
        "weather": {
            "temperature_c": None,
            "feels_like_c": None,
            "humidity_percent": None
        },
        "air_quality": {
            "us_aqi": None,
            "pm25_ug_m3": None,
            "pm10_ug_m3": None
        },
        "forecast": {
            "daily": {}
        }
    }

    result = assess_climate_health_risk(
        environmental_data,
        "general"
    )

    assert result["overall_risk"]["score"] is None

    assert result["overall_risk"]["classification"] == (
        "Unavailable"
    )

    assert len(
        result["data_quality"]["unavailable_hazards"]
    ) == 3

    assert result["data_quality"]["weights_normalized"] is False
