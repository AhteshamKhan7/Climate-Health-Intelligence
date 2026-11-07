from app.engine.community_recommendation_engine import (
    generate_community_recommendations
)

from app.engine.vulnerability_engine import (
    get_community_profile,
    calculate_community_risk,
    compare_communities
)

from app.schemas.vulnerability import (
    CommunityComparisonRequest,
    CommunityAssessmentRequest
)

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

# ==================================================
# MODULE 3: COMMUNITY VULNERABILITY INTELLIGENCE
# ==================================================

@app.post("/api/communities/compare")
async def community_comparison(
    request: CommunityComparisonRequest
):
    """
    Compare all supported community profiles
    using the same environmental hazard scores.
    """

    hazard_scores = {
        "heat": request.heat_score,
        "air": request.air_score,
        "rain": request.rain_score
    }

    try:

        comparisons = compare_communities(
            hazard_scores
        )

        return {
            "success": True,
            "module": "Community Vulnerability Intelligence",
            "comparison_count": len(comparisons),
            "hazard_inputs": hazard_scores,
            "comparisons": comparisons,
            "notice": (
                "Community profiles are illustrative "
                "prototype assumptions, not measured "
                "demographic statistics."
            )
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc


@app.post("/api/communities/assess")
async def community_assessment(
    request: CommunityAssessmentRequest
):
    """
    Assess environmental risk for one selected
    community vulnerability profile.
    """

    hazard_scores = {
        "heat": request.hazard_scores.heat_score,
        "air": request.hazard_scores.air_score,
        "rain": request.hazard_scores.rain_score
    }

    try:

        result = calculate_community_risk(
            hazard_scores,
            request.profile
        )

        return {
            "success": True,
            "module": "Community Vulnerability Intelligence",
            "assessment": result,
            "notice": (
                "This is an illustrative community "
                "screening assessment, not a clinical "
                "or demographic prediction."
            )
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc

# ==================================================
# MODULE 3.3: PERSONALIZED RECOMMENDATIONS
# ==================================================

@app.post("/api/communities/recommendations")
async def community_recommendations(
    request: CommunityAssessmentRequest
):

    hazard_scores = {
        "heat": request.hazard_scores.heat_score,
        "air": request.hazard_scores.air_score,
        "rain": request.hazard_scores.rain_score
    }

    try:

        result = generate_community_recommendations(
            hazard_scores,
            request.profile
        )

        return {
            "success": True,
            "module": "Personalized Community Recommendations",
            "result": result
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc
