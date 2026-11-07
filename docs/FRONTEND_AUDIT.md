# ClimateTwin Frontend — Complete Technical Audit Report

> **Target Repository:** `https://github.com/AhteshamKhan7/Climate-Health-Intelligence`  
> **Branch:** `frontend`  
> **Frontend Directory:** `frontend/`  
> **Audit Date:** November 2026  
> **Audit Mode:** Read-only inspection and compilation verification  

---

## 1. Audit Context and Scope

This technical audit evaluates the complete frontend implementation of **ClimateTwin**—an AI-driven climate and public health intelligence platform designed for the **Pune Municipal Corporation (PMC)** urban ecosystem and surrounding agglomeration in Maharashtra, India.

### Scope of Inspection:
- `src/components/` (Common, Dashboard, Layout, Map)
- `src/context/` (`ClimateContext.jsx`)
- `src/data/` (`hazardsData.js`, `mockBackendData.js`, `puneWards.js`)
- `src/pages/` (All 7 active page components)
- `src/services/` (`api.js`)
- `src/utils/` (`riskCalculator.js`)
- `src/App.jsx`, `src/main.jsx`, `src/index.css`
- `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `.env.example`, `.gitignore`

---

## 2. Page-by-Page Functional Audit

| Route | Page File | Capabilities & Implementation | Functional Status |
| :--- | :--- | :--- | :---: |
| **`/`** | `src/pages/OverviewDashboard.jsx` | 5 core KPI status cards, semi-circular animated exposure gauge, automated AI screening rationale, 24h & 7d Recharts diurnal trend curves, active early warning feed (`AlertsList`), multi-tier action directives (`AIRecommendations`), and embedded Pune community risk map. | **Fully Functional** |
| **`/challenges`** | `src/pages/ClimateHealthChallenges.jsx` | Deep epidemiological analysis for 4 Pune hazards: Extreme Heat, Air Pollution, Heavy Rainfall, and Vector Suitability. Includes 3-tier severity badges, clinical manifestations (acute vs chronic), and cross-hazard comparison matrix. | **Functional** *(Protocol Export button is notification-only)* |
| **`/intelligence`** | `src/pages/AIClimateIntelligence.jsx` | Target ward dropdown selector synced with global context, 4 scenario presets, dynamic parameter audit inputs (Temp, Humidity, Rain, AQI), "Run Dynamic Risk Audit" engine trigger, composite score gauge, 4 hazard breakdown cards, demographic buffer profile, and clinical rationales. | **Fully Functional** |
| **`/map`** | `src/pages/PuneCommunityRiskMap.jsx` | Full React Leaflet GIS map with OpenStreetMap tiles, 15 PMC administrative ward markers, 1,200m catchment circles, 5 layer toggles (Overall, Heat, Air, Flood, Vulnerability), live ward search, camera fly-to, fullscreen toggle, and sliding ward detail dossier. | **Fully Functional** *(Protected SHA-256 Intact)* |
| **`/simulator`** | `src/pages/WhatIfSimulator.jsx` | 4 continuous parameter sliders with immediate value readouts, 4 extreme scenario presets, reset button, side-by-side Before/After risk gauges with delta indicator, hazard score delta bar chart, and demographic impact cards. | **Fully Functional** |
| **`/insights`** | `src/pages/CommunityInsights.jsx` | 5 vulnerable population KPI cards, ward composite risk distribution bar chart, vulnerability factor breakdown donut chart, searchable & sortable PMC Ward Priority Action Matrix table, and civic preparedness indicators. | **Fully Functional** |
| **`/about`** | `src/pages/AboutClimateTwin.jsx` | Public platform mission statement, Pune microclimate scope, vulnerable cohort protection criteria, and public health screening notice. | **Fully Functional** |
| **`/reports`** | `src/App.jsx` | Neutralized technical evidence route; safely redirects to `/`. | **Verified Redirect** |

---

## 3. Reusable Components

| Component | File Path | Description & Role | Status |
| :--- | :--- | :--- | :---: |
| **`RiskGauge`** | `src/components/common/RiskGauge.jsx` | SVG semi-circular gauge displaying risk scores (0–100) with color tiers (teal, amber, orange, red) and animated needle. Supports `sm`, `md`, `lg` sizes. | Active |
| **`StatCard`** | `src/components/common/StatCard.jsx` | Metric card with title, icon, value, unit, status badge, trend string, and direction arrow. | Active |
| **`StatusBadge`** | `src/components/common/StatusBadge.jsx` | Color-coded status pills (`StatusBadge` and `HazardBadge`) mapping severity levels (`Low`, `Moderate`, `High`, `Critical`, `Severe`). | Active |
| **`DisclaimerBanner`** | `src/components/common/DisclaimerBanner.jsx` | Public screening disclaimer with active telemetry status pill (`API LIVE` or `DEMO MODE`) and helpline references. | Active |
| **`TrendChart`** | `src/components/dashboard/TrendChart.jsx` | Recharts responsive visualization with 24h/7d timeline toggle and metric switcher (Composite Risk, Temp & Rain, AQI). | Active |
| **`AlertsList`** | `src/components/dashboard/AlertsList.jsx` | Live surveillance alert feed with category filter pills (`All`, `Air Quality`, `Vector`, `Heat`) and deep-link to map. | Active |
| **`AIRecommendations`** | `src/components/dashboard/AIRecommendations.jsx` | Multi-stakeholder tabbed directives (`Municipal`, `Citizens`, `Clinical`) with action checklists. | Active |
| **`HazardRiskCards`** | `src/components/dashboard/HazardRiskCards.jsx` | 4 summary cards for Heat, Air, Flood, and Vector with animated progress bars. | Active |
| **`WardDetailDrawer`** | `src/components/map/WardDetailDrawer.jsx` | Sliding dossier for selected ward with demographics, beds buffer, local flood pockets, and heat hotspots. | Active |
| **`MapLegend`** | `src/components/map/MapLegend.jsx` | Dynamic color-scale legend adjusting to the currently selected map layer. | Active |
| **`Sidebar`** | `src/components/layout/Sidebar.jsx` | Responsive navigation with branding, ward select dropdown, 6 module links, and backend ping button. | Active |
| **`Header`** | `src/components/layout/Header.jsx` | Sticky header with page breadcrumbs, ward indicator, date, telemetry status, and notifications popover. | Active |
| **`Footer`** | `src/components/layout/Footer.jsx` | Application footer with module links, emergency helpline numbers, and legal notices. | Active |
| **`Layout`** | `src/components/layout/Layout.jsx` | Master wrapper handling responsive layout padding, sidebar open state, and toast container. | Active |
| **`Navbar`** | `src/components/layout/Navbar.jsx` | Older single-bar navigation component. | **Orphaned (Unused)** |
| **`MiniMapPreview`** | `src/components/dashboard/MiniMapPreview.jsx` | Compact preview map component. | **Orphaned (Unused)** |

---

## 4. Application Routing and Navigation

- **Router Framework**: `react-router-dom` v6.26.2.
- **Root Configuration**: Defined in `src/App.jsx`. All routes render inside `<Layout />`.
- **Navigation Links**: `<NavLink>` in `Sidebar.jsx` with active class highlighting using the `#368F83` primary teal token.
- **Header Synchronization**: `Header.jsx` inspects `useLocation().pathname` to dynamically resolve breadcrumb titles.
- **Defensive Redirects**: `/reports` and all wildcard routes (`*`) redirect to `/` via `<Navigate to="/" replace />`.

---

## 5. State Management

- **Context Provider**: `src/context/ClimateContext.jsx` (`ClimateProvider`), consumed via `useClimate()`.
- **Shared Application State**:
  - `isBackendOnline` (`boolean`): Backend connectivity indicator.
  - `checkingHealth` (`boolean`): Ping request in progress.
  - `selectedWard` (`object`): Currently selected PMC administrative ward (defaults to Shivajinagar).
  - `environmentData` (`object`): Real-time or modeled environmental readings (temperature, humidity, rain, AQI, PM2.5, PM10, NO2).
  - `isLiveFeed` (`boolean`): Data origin flag (true for live API, false for baseline demo).
  - `dataSourceLabel` (`string`): Explanatory source tag.
  - `lastUpdated` (`Date`): Timestamp of the most recent sync.
  - `wardsList` (`array`): Reference array of 15 PMC wards.
- **Methods**:
  - `verifyBackendHealth(silent)`: Tests `/api/health`.
  - `refreshEnvironment()`: Retrieves readings for active ward coordinates.
  - `selectWardById(wardId)`: Updates selected ward and triggers tailored baseline adjustments.
- **Component State**: `useState` is used locally for filter pills, active tabs, sliders, search queries, and modal visibility.

---

## 6. Mock and Hardcoded Data

To ensure zero crashes when running offline or during backend maintenance, the frontend contains baseline datasets:

1. **`src/data/puneWards.js`**: 15 administrative wards with coordinates, populations, slum percentages, elderly ratios, pediatric ratios, hospital beds per thousand, UPHC counts, baseline readings, and risk scores.
2. **`src/data/mockBackendData.js`**:
   - `MOCK_HEALTH`: Modeled status response.
   - `MOCK_ENVIRONMENT`: Pune baseline weather and derived metrics.
   - `MOCK_TRENDS_24H` & `MOCK_TRENDS_7D`: Time-series datasets for Recharts.
   - `MOCK_ALERTS`: 3 active early warning alerts with affected ward mappings.
   - `generateMockAssessment(params)`: Client-side assessment engine.
   - `generateMockSimulation(inputs)`: Client-side scenario delta and cohort impact engine.
3. **`src/data/hazardsData.js`**: Epidemiological and clinical dossiers for 4 major climate hazards.
4. **Component-Level Static Data**:
   - `CommunityInsights.jsx`: Vulnerability factor percentages and preparedness readiness scores.
   - `AboutClimateTwin.jsx`: Platform scope and focus area cards.

---

## 7. API Service and Backend Alignment

Client requests are routed through `src/services/api.js` (Axios client with `timeout: 5000` and `baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'`).

### Endpoint Comparison with Person 2's FastAPI Backend (`backend/app/main.py`):

| Frontend Method | Frontend Request | Backend Route in `main.py` | Compatibility Status |
| :--- | :--- | :--- | :--- |
| **`checkHealth()`** | `GET /api/health` | `@app.get("/api/health")` | **Compatible**: Both exchange `{ status, service, version }`. |
| **`getEnvironment()`** | `GET /api/environment?lat=...&lon=...` | `@app.get("/api/environment")` | ⚠️ **Parameter Name Mismatch**: Backend expects `latitude` and `longitude` (`Query(...)`), while frontend sends `lat` and `lon`. Live calls return HTTP 422 Unprocessable Entity; frontend safely falls back to modeled baseline. |
| **`assessRisk()`** | `POST /api/assess` with `{ wardId, temperature, humidity, rainfall, aqi }` | `@app.post("/api/assess")` | ⚠️ **Payload Schema Mismatch**: Backend expects `AssessmentRequest` with `community_profile` dict, `latitude`, `longitude`, and `location_name`. Client sends flattened meteorological numbers. |
| **`simulateScenario()`** | `POST /api/simulate` | *None* | ⚠️ **Endpoint Missing in Backend**: Backend has `/api/communities/compare` and `/api/geographic/assess`, but no `/api/simulate`. Handled via client-side calculation fallback. |

---

## 8. Button and Interaction Audit

- **Header Controls**: Mobile hamburger drawer toggle and notification popover bell are fully active.
- **Sidebar Controls**: Ward selector dropdown and backend health ping button are fully wired with toast notifications.
- **Dashboard Controls**: Telemetry sync, trend timeline buttons (`24h` / `7d`), metric dropdown (`Risk`, `Temp/Rain`, `AQI`), alert filter pills, and AI directive tabs are fully functional.
- **Map Controls**: 5 layer switcher buttons, live ward search bar, reset map button, fullscreen toggle, marker click popups, and ward dossier close handler are fully active.
- **Simulator Controls**: 4 continuous sliders, 4 extreme event presets, and reset to baseline button recalculate in real time.
- **Intelligence Controls**: 4 quick presets, ward select, 4 numeric inputs, and "Run Dynamic Risk Audit" trigger assessment calculations.
- **Insights Controls**: 3 sort buttons (`Overall Risk`, `Slum %`, `Seniors %`), search filter, and "Inspect on Map" links are fully operational.
- **Incomplete Interaction**:
  - `ClimateHealthChallenges.jsx` line 112: "Export Protocol" button fires a toast notification (`toast.success(...)`), but does not generate or download an actual PDF/CSV file.

---

## 9. What-if Simulator

- **File**: `src/pages/WhatIfSimulator.jsx`
- **Calculation Engine**: `src/utils/riskCalculator.js`
- **Simulation Variables**:
  - Temperature: $15^\circ\text{C}$ to $48^\circ\text{C}$ (Step 0.5)
  - Relative Humidity: $15\%$ to $98\%$ (Step 1)
  - Rainfall (24h): $0\text{ mm}$ to $220\text{ mm}$ (Step 1)
  - AQI: $20$ to $450$ (Step 5)
- **Mathematical Formulations**:
  1. *NOAA Rothfusz Heat Index*:
     $$\text{HI} = -42.379 + 2.049T + 10.143\text{RH} - 0.224T\cdot\text{RH} - 0.0068T^2 - 0.054\text{RH}^2 + \dots$$
  2. *Piecewise Hazard Scores*: Heat (apparent temp mapping), Air (CPCB AQI breakpoints), Flood (rainfall piecewise), Vector (Gaussian temperature curve around $28^\circ\text{C}$ + humidity saturation + rainfall pooling factor).
  3. *Composite Risk Score*:
     $$\text{Composite} = 0.30 \times \text{Heat} + 0.30 \times \text{Air} + 0.20 \times \text{Flood} + 0.20 \times \text{Vector}$$
  4. *Delta Formulation*: $\Delta = \text{Score}_{\text{simulated}} - \text{Score}_{\text{baseline}}$
- **Outputs**: Side-by-side Before/After gauges, delta indicator, Recharts comparison bar chart, and demographic sensitivity impact cards.

---

## 10. Pune Community Risk Map

- **File**: `src/pages/PuneCommunityRiskMap.jsx`
- **Integrity**: SHA-256 hash verified as `362B47EA1D9D021D06C3075FB8CC837A31E384602C9FB7F21F5DA05A85EE5117`.
- **Mapping Libraries**: `react-leaflet` 4.2.1 + `leaflet` 1.9.4.
- **Coordinates & Zoom**: Center `[18.5204, 73.8567]`, default zoom 12.
- **Layers**: 5 selectable layers (Overall Priority, Heat Risk, Air Quality, Rainfall & Flooding, Vulnerability).
- **Features**: Custom `DivIcon` badge pins, 1,200m circular catchment buffers (`<Circle radius={1200} />`), smooth camera transitions (`MapViewController` with `map.flyTo`), interactive popups, live search directory, and ward detail drawer modal.

---

## 11. Responsive Design

- **Grid Layout**: Responsive grid tiers (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 / lg:grid-cols-5 / lg:grid-cols-12`).
- **Sidebar**: Hidden off-canvas on mobile (`-translate-x-full lg:translate-x-0`), toggled via mobile menu button and backdrop overlay.
- **Header**: Responsive breadcrumbs and status indicators that collapse cleanly on smaller viewports.
- **Table Handling**: Tabular matrices wrapped in `overflow-x-auto` to prevent layout breaking.
- **Chart Scaling**: All Recharts visualizations wrapped in `<ResponsiveContainer width="100%" height="...">`.

---

## 12. Security Audit

- **Credential Scan**: Automated regex scan across all source files yielded **0 hardcoded credentials, API keys, passwords, or private tokens**.
- **Environment Security**: `.env` is ignored by `.gitignore`. Safe placeholder `.env.example` is committed with `VITE_API_URL=http://localhost:8000`.
- **Direct Third-Party Calls**: None. The frontend does not make unproxied requests to third-party weather or mapping APIs.
- **Technical Evidence**: Internal architecture tiers and version disclosures have been completely removed from public navigation and routes.

---

## 13. Production Build

- **Build Tool**: Vite 5.4.21 with `@vitejs/plugin-react` 4.3.1.
- **Command**: `npm run build`
- **Result**:
  - Modules transformed: 2,295
  - Build duration: 11.06s
  - Exit code: 0 (Zero errors)
  - Chunks generated:
    - `dist/index.html`: 1.31 kB (gzip: 0.74 kB)
    - `dist/assets/index-2gt0CCc6.css`: 42.65 kB (gzip: 7.72 kB)
    - `dist/assets/index-CRWKQ9qt.js`: 1,023.35 kB (gzip: 292.28 kB)
- **Advisory**: Minified JS bundle chunk exceeds 500 kB due to Leaflet and Recharts bundled in a single vendor chunk. Can be optimized via dynamic code-splitting.

---

## 14. Completed Features

1. Complete 6-module intelligence platform + public About page.
2. Cohesive nature-healthcare design system (#EAF3ED, #E4F1F3, #245B4B, #368F83, #4B91C5, #E8E4F5, #203C37, #66847D, #D2E4DA).
3. 5 KPI telemetry cards with trend metrics.
4. Interactive Pune Community Risk Map with 15 wards, layer toggles, and drawer dossiers (Protected).
5. What-If Simulator with continuous parameter sliders and before/after comparisons.
6. AI Climate-Health Intelligence Workspace with audit presets and clinical rationales.
7. Diurnal Recharts environmental trend analytics (24h/7d).
8. Active early warnings alert feed with category filtering.
9. Multi-stakeholder action directives (Municipal, Citizens, Clinical).
10. Community Vulnerability & Impact insights with sortable/searchable priority matrix.
11. Resilient offline fallback engine ensuring zero unhandled crashes when backend is offline.
12. Zero hardcoded secrets and clean production build.

---

## 15. Partially Completed Features

1. **Backend Telemetry Parameter Alignment**:
   - `api.js` passes `lat` and `lon` to `GET /api/environment`.
   - FastAPI backend expects `latitude` and `longitude`.
2. **Backend Assessment Request Schema**:
   - `api.js` passes `{ wardId, temperature, humidity, rainfall, aqi }` to `POST /api/assess`.
   - FastAPI backend expects `AssessmentRequest` with `community_profile` dict, `latitude`, `longitude`, and `location_name`.
3. **Protocol Export**:
   - "Export Protocol" button in `ClimateHealthChallenges.jsx` triggers a success toast, but does not download an actual document.
4. **Bundle Code-Splitting**:
   - Application is bundled into a single 1,023 kB JS chunk; routes can be lazy-loaded with `React.lazy()`.

---

## 16. Missing Features

1. **FastAPI Simulation Endpoint**:
   - `POST /api/simulate` does not exist in Person 2's backend. The simulator currently runs entirely on client-side math.
2. **GeoJSON Boundary Polygons**:
   - Wards are rendered using centroid coordinates and 1,200m circular catchment buffers rather than actual administrative GeoJSON boundary shapes.
3. **Authentication & User Roles**:
   - No login, JWT handling, or administrative permission system for municipal coordinators.
4. **Historical Database Storage**:
   - No IndexedDB or historical database queries for trends older than 7 days.
5. **Orphaned File Cleanup**:
   - `Navbar.jsx` and `MiniMapPreview.jsx` remain in the codebase as legacy files.

---

## 17. Recommended Next Steps

1. **Update `api.js` Parameter Names**:
   Change `{ lat, lon }` to `{ latitude: lat, longitude: lon }` in `getEnvironment()`.
2. **Align Assessment Schema with Person 2**:
   Update `assessRisk()` in `api.js` to match the backend `AssessmentRequest` schema.
3. **Remove Orphaned Components**:
   Delete unused `src/components/layout/Navbar.jsx` and `src/components/dashboard/MiniMapPreview.jsx`.
4. **Implement Real Protocol Download**:
   Add client-side PDF or CSV generation for the Export button.
5. **Implement Route Lazy-Loading**:
   Use `React.lazy()` and `<Suspense>` in `App.jsx` to reduce main bundle size below 500 kB.

