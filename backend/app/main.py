
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.config import (
    APP_NAME,
    APP_VERSION,
    FRONTEND_URL
)

from app.services.open_meteo import (
    get_environmental_data,
    EnvironmentalDataError
)

from app.schemas.risk import AssessmentRequest

from app.engine.risk_engine import (
    assess_climate_health_risk
)


app = FastAPI(
    title=APP_NAME,
    description="ClimateTwin Climate-Health Intelligence Backend",
    version=APP_VERSION
)


# FRONTEND CONNECTION
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# ROOT
@app.get("/")
async def root():

    return {
        "project": "ClimateTwin",
        "message": "Backend running successfully!",
        "version": APP_VERSION
    }


# HEALTH CHECK
@app.get("/api/health")
async def health_check():

    return {
        "status": "healthy",
        "service": "ClimateTwin Backend",
        "version": APP_VERSION
    }


# ENVIRONMENTAL DATA
@app.get("/api/environment")
async def environment(

    latitude: float = Query(..., ge=-90, le=90),

    longitude: float = Query(..., ge=-180, le=180)

):

    try:

        return await get_environmental_data(
            latitude,
            longitude
        )

    except EnvironmentalDataError as exc:

        raise HTTPException(
            status_code=502,
            detail=str(exc)
        ) from exc


# INTEGRATED CLIMATE-HEALTH ASSESSMENT
@app.post("/api/assess")
async def assess(request: AssessmentRequest):

    try:

        # Step 1: Fetch environmental information.
        environmental_data = await get_environmental_data(
            request.latitude,
            request.longitude
        )

        # Step 2: Calculate all available hazard risks.
        assessment = assess_climate_health_risk(
            environmental_data=environmental_data,
            community_profile=request.community_profile
        )

        # Step 3: Attach location and source information.
        assessment["location"] = {
            "name": request.location_name,
            "latitude": request.latitude,
            "longitude": request.longitude
        }

        assessment["environmental_data"] = environmental_data

        # Step 4: Return unified intelligence response.
        return {
            "success": True,
            "project": "ClimateTwin",
            "assessment": assessment
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
