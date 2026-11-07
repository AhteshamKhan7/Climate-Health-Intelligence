from app.routers.history import router as history_router
from contextlib import asynccontextmanager

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

from app.services.history import (
    initialize_history_db,
    save_assessment
)

from app.schemas.risk import AssessmentRequest

from app.engine.risk_engine import (
    assess_climate_health_risk
)

from app.engine.community_recommendation_engine import (
    generate_community_recommendations
)

from app.engine.vulnerability_engine import (
    calculate_community_risk,
    compare_communities
)

from app.schemas.vulnerability import (
    CommunityComparisonRequest,
    CommunityAssessmentRequest
)

from app.schemas.geographic import (
    GeographicAssessmentRequest
)

from app.engine.geographic_engine import (
    compare_geographic_locations
)

from app.engine.geographic_insights import (
    generate_geographic_insights
)


# ==================================================
# APPLICATION INITIALIZATION
# ==================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize the historical database on startup."""

    initialize_history_db()

    yield


app = FastAPI(
    title=APP_NAME,
    description="ClimateTwin Climate-Health Intelligence Backend",
    version=APP_VERSION,
    lifespan=lifespan
)
app.include_router(history_router)


# ==================================================
# FRONTEND CONNECTION
# ==================================================

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


# ==================================================
# ROOT
# ==================================================

@app.get("/")
async def root():

    return {
        "project": "ClimateTwin",
        "message": "Backend running successfully!",
        "version": APP_VERSION
    }


# ==================================================
# HEALTH CHECK
# ==================================================

@app.get("/api/health")
async def health_check():

    return {
        "status": "healthy",
        "service": "ClimateTwin Backend",
        "version": APP_VERSION
    }


# ==================================================
# ENVIRONMENTAL DATA
# ==================================================

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


# ==================================================
# MODULE 2: INTEGRATED CLIMATE-HEALTH ASSESSMENT
# ==================================================

@app.post("/api/assess")
async def assess(request: AssessmentRequest):

    try:

        # Step 1: Fetch environmental information.
        environmental_data = await get_environmental_data(
            request.latitude,
            request.longitude
        )

        # Step 2: Calculate available hazard risks.
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

        # Step 4: Save the complete assessment.
        save_assessment(assessment)

        # Step 5: Return the unified response.
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


# ==================================================
# MODULE 3.2: INDIVIDUAL COMMUNITY ASSESSMENT
# ==================================================

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
# MODULE 3.3: PERSONALIZED COMMUNITY RECOMMENDATIONS
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


# ==================================================
# MODULE 4: GEOGRAPHIC RISK INTELLIGENCE
# ==================================================

@app.post("/api/geographic/assess")
async def geographic_assessment(
    request: GeographicAssessmentRequest
):
    """
    Compare multiple geographic locations,
    generate insights, and save successful assessments.
    """

    try:

        # Step 1: Assess all requested locations.
        result = await compare_geographic_locations(
            locations=request.locations,
            community_profile=request.community_profile
        )

        # Step 2: Save successful location assessments.
        saved_count = 0

        for item in result["results"]:

            if (
                item.get("status") == "success"
                and item.get("assessment") is not None
            ):

                assessment = item["assessment"]

                # Attach the location to the full assessment.
                assessment["location"] = item["location"]

                save_assessment(assessment)

                saved_count += 1

        # Step 3: Generate geographic priority insights.
        priority_insights = generate_geographic_insights(
            result["results"]
        )

        result["priority_insights"] = priority_insights

        # Step 4: Include database storage information.
        result["historical_storage"] = {
            "saved_assessments": saved_count,
            "message": (
                "Successful location assessments were "
                "saved to historical storage."
            )
        }

        # Step 5: Return the complete geographic response.
        return {
            "success": True,
            "project": "ClimateTwin",
            "module": "Geographic Risk Intelligence",
            "comparison": result
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc
