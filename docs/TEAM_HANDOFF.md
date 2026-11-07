# ClimateTwin — Team Handoff & Architecture Guide

> **Project:** ClimateTwin — AI-Powered Climate & Public Health Intelligence Platform (Pune)  
> **Repository:** `https://github.com/AhteshamKhan7/Climate-Health-Intelligence`  
> **Active Frontend Branch:** `frontend`  
> **Active Backend Branch:** `backend/environment-service`  

---

## 1. Team Responsibilities

### Person 1: Frontend Lead
- **Scope**: User interface, geospatial mapping, data visualizations, client-side routing, and responsive design.
- **Key Modules Owned**:
  - `frontend/src/pages/OverviewDashboard.jsx` (Module 1)
  - `frontend/src/pages/ClimateHealthChallenges.jsx` (Module 2)
  - `frontend/src/pages/AIClimateIntelligence.jsx` (Module 3)
  - `frontend/src/pages/PuneCommunityRiskMap.jsx` (Module 4 — Protected)
  - `frontend/src/pages/WhatIfSimulator.jsx` (Module 5)
  - `frontend/src/pages/CommunityInsights.jsx` (Module 6)
  - `frontend/src/pages/AboutClimateTwin.jsx` (Module 7)
- **Technical Stack**: React 18, Vite 5, Tailwind CSS 3, Leaflet / React Leaflet, Recharts, Lucide React, Axios.
- **Client Resilience**: Maintained automatic fallback to Pune baseline demonstration data in `src/services/api.js` to guarantee zero-crash offline execution.

### Person 2: Backend Lead
- **Scope**: Python FastAPI service, weather telemetry ingestion, and mathematical risk model calculation.
- **Key Modules Owned**:
  - `backend/app/main.py` (FastAPI route controllers)
  - `backend/app/services/open_meteo.py` (Open-Meteo API ingestion)
  - `backend/app/engine/risk_engine.py` (Core climate-health calculation)
  - `backend/app/engine/vulnerability_engine.py` (Community vulnerability weighting)
  - `backend/app/engine/community_recommendation_engine.py` (Advisory generation)
  - `backend/app/engine/geographic_engine.py` & `geographic_insights.py` (Location comparison)
  - `backend/app/schemas/` (Pydantic models for risk, vulnerability, and geography)
  - `backend/tests/` (Pytest test suite)
- **Technical Stack**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2, Open-Meteo API.

---

## 2. Current Project Status

- **Frontend (`frontend/`)**: Complete, professionally redesigned, fully organized, and builds with zero errors (`npm run build` exits with code 0).
- **Backend (`backend/`)**: Person 2 has implemented endpoints for `/api/health`, `/api/environment`, `/api/assess`, `/api/communities/compare`, `/api/communities/assess`, `/api/communities/recommendations`, and `/api/geographic/assess` with full test coverage in `backend/tests/`.
- **Protected Assets**: `PuneCommunityRiskMap.jsx` has been cryptographically preserved (SHA-256: `362B47EA1D9D021D06C3075FB8CC837A31E384602C9FB7F21F5DA05A85EE5117`).

---

## 3. Important API Integration Mismatches

During the technical audit, three key integration mismatches were identified between the frontend client (`src/services/api.js`) and the FastAPI backend (`backend/app/main.py`). Resolving these is the primary integration task:

### Mismatch 1: Query Parameter Names in `/api/environment`
- **Frontend Current**: `GET /api/environment?lat=18.5204&lon=73.8567`
- **Backend Expected**: `GET /api/environment?latitude=18.5204&longitude=73.8567`
- **Impact**: FastAPI returns `422 Unprocessable Entity` because `latitude` and `longitude` are required query parameters.
- **Resolution**: Update `frontend/src/services/api.js` to pass `{ latitude: lat, longitude: lon }`.

### Mismatch 2: Request Payload Schema in `POST /api/assess`
- **Frontend Current**: Sends `{ wardId, temperature, humidity, rainfall, aqi }`.
- **Backend Expected**: `AssessmentRequest` Pydantic model:
  ```json
  {
    "latitude": 18.5204,
    "longitude": 73.8567,
    "location_name": "Shivajinagar",
    "community_profile": {
      "slum_density": 0.185,
      "elderly_ratio": 0.142,
      "hospital_beds_per_k": 4.8
    }
  }
  ```
- **Resolution**: Align the frontend payload in `assessRisk()` to pass `latitude`, `longitude`, `location_name`, and `community_profile`.

### Mismatch 3: Missing Backend `/api/simulate` Endpoint
- **Frontend Current**: Calls `POST /api/simulate` when sliders move in the What-If Simulator.
- **Backend Current**: Backend does not define `/api/simulate`. Instead, it provides `/api/communities/compare` and `/api/geographic/assess`.
- **Current Behavior**: Frontend catches the 404 response and seamlessly executes client-side simulation via `generateMockSimulation()` in `riskCalculator.js`.
- **Resolution**: Either implement `/api/simulate` in FastAPI, or formally designate the simulator as a client-side edge computation engine.

---

## 4. Shared Integration Responsibilities

To achieve a seamless end-to-end integration between frontend and backend:

1. **CORS Configuration**:
   - Ensure `backend/app/main.py` continues allowing `http://localhost:5173` in `allow_origins`.
2. **Environment Variables**:
   - Frontend points to backend via `frontend/.env`:
     ```env
     VITE_API_URL=http://localhost:8000
     ```
   - Keep real API keys and weather provider credentials server-side in `backend/.env`.
3. **Merging Strategy**:
   - Merge `backend/environment-service` into `main`.
   - Open a Pull Request from `frontend` into `main` after resolving parameter names.
   - Run both services simultaneously for validation:
     ```powershell
     # Terminal 1: Backend
     cd backend
     uvicorn app.main:app --reload --port 8000

     # Terminal 2: Frontend
     cd frontend
     npm run dev
     ```

