from fastapi import APIRouter, HTTPException

from app.schemas.simulation import SimulationRequest
from app.services.open_meteo import (
    get_environmental_data,
    EnvironmentalDataError
)
from app.engine.simulation_engine import run_simulation


router = APIRouter(
    prefix="/api",
    tags=["What-if Simulator"]
)


@router.post("/simulate")
async def simulate_climate_scenario(
    request: SimulationRequest
):
    """
    Compare current environmental risk with
    a user-defined hypothetical climate scenario.
    """

    # Extract only the supplied scenario values.
    scenario_inputs = {
        key: value
        for key, value in request.dict(exclude_none=True).items()
        if key in {
            "temperature_c",
            "apparent_temperature_c",
            "humidity_percent",
            "us_aqi",
            "pm25_ug_m3",
            "pm10_ug_m3",
            "max_daily_rainfall_mm",
            "precipitation_probability_percent"
        }
    }

    if not scenario_inputs:
        raise HTTPException(
            status_code=422,
            detail=(
                "Provide at least one climate parameter "
                "to simulate."
            )
        )

    try:
        # Fetch actual baseline environmental data.
        environmental_data = await get_environmental_data(
            request.latitude,
            request.longitude
        )

        # Run both assessments using the existing risk engine.
        result = run_simulation(
            environmental_data=environmental_data,
            scenario_inputs=scenario_inputs,
            community_profile=request.community_profile
        )

        return {
            "success": True,
            "module": "ClimateTwin What-if Simulator",

            "location": {
                "name": request.location_name,
                "latitude": request.latitude,
                "longitude": request.longitude
            },

            "community_profile": request.community_profile,

            "data_source": environmental_data.get(
                "metadata", {}
            ),

            "scenario_inputs": scenario_inputs,

            "baseline": result["baseline"],

            "scenario": result["scenario"],

            "comparison": result["comparison"],

            "simulation_notice": (
                "The scenario is hypothetical. "
                "It is not a weather forecast or an actual "
                "environmental observation. Results use "
                "ClimateTwin's prototype screening model."
            ),

            "historical_storage": {
                "saved": False,
                "reason": (
                    "Simulated assessments are not saved "
                    "as actual historical observations."
                )
            }
        }

    except EnvironmentalDataError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc)
        ) from exc

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc