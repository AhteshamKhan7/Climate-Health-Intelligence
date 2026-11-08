
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  Layers,
  Search,
  Maximize2,
  RotateCcw,
  MapPin,
  ShieldAlert,
  Flame,
  Wind,
  CloudRain,
  Users,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';

import {
  PUNE_WARDS,
  PUNE_COORDINATES,
  getRiskColor,
  getRiskTier
} from '../data/puneWards';

import MapLegend from '../components/map/MapLegend';
import WardDetailDrawer from '../components/map/WardDetailDrawer';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useClimate } from '../context/ClimateContext';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

// --------------------------------------------------
// MAP VIEW CONTROLLER
// --------------------------------------------------

const MapViewController = ({ targetCoordinates, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (targetCoordinates) {
      map.flyTo(targetCoordinates, zoomLevel || 13, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [targetCoordinates, zoomLevel, map]);

  return null;
};

// --------------------------------------------------
// CUSTOM MAP MARKER
// --------------------------------------------------

const createCustomMarker = (score, isSelected) => {
  const color = getRiskColor(score);
  const size = isSelected ? 36 : 28;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.35);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: ${isSelected ? '12px' : '10px'};
        font-family: sans-serif;
      ">
        ${score === null || score === undefined ? '--' : Math.round(score)}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const normalizeWardName = (name = '') =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '');

const getValidScore = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.min(100, number))
    : null;
};

// Average available community-adjusted hazard scores.
// This is a screening indicator, not a clinical prediction.
const calculateCommunityAdjustedScore = (hazardAssessments = {}) => {
  const scores = Object.values(hazardAssessments)
    .map((item) => getValidScore(item?.risk_score))
    .filter((score) => score !== null);

  if (scores.length === 0) return null;

  return Number(
    (scores.reduce((total, score) => total + score, 0) / scores.length)
      .toFixed(2)
  );
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export const PuneCommunityRiskMap = () => {
  const { selectedWard, setSelectedWard } = useClimate();

  const [activeLayer, setActiveLayer] = useState('overall');
  const [searchQuery, setSearchQuery] = useState('');

  const [clickedWardId, setClickedWardId] = useState(
    selectedWard?.id || PUNE_WARDS[0].id
  );

  const [mapTarget, setMapTarget] = useState([
    PUNE_COORDINATES.lat,
    PUNE_COORDINATES.lng
  ]);

  const [mapZoom, setMapZoom] = useState(12);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [backendResults, setBackendResults] = useState({});
  const [assessmentStatus, setAssessmentStatus] = useState('loading');
  const [assessmentError, setAssessmentError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [successfulCount, setSuccessfulCount] = useState(0);

  const [priorityInsights, setPriorityInsights] = useState([]);

  const mapWrapperRef = useRef(null);
  const requestIdRef = useRef(0);

  // --------------------------------------------------
  // GEOGRAPHIC + COMMUNITY ASSESSMENTS
  // --------------------------------------------------

  const loadGeographicAssessments = async () => {
    const currentRequestId = ++requestIdRef.current;

    setAssessmentStatus('loading');
    setAssessmentError(null);

    try {
      // Step 1: Assess all ten geographic locations.
      const geographicPayload = {
        locations: PUNE_WARDS.map((ward) => ({
          name: ward.name,
          latitude: ward.coordinates[0],
          longitude: ward.coordinates[1]
        })),
        community_profile: 'general'
      };

      const geographicResponse =
        await apiService.assessGeographicLocations(geographicPayload);

      if (currentRequestId !== requestIdRef.current) return;

      if (
        !geographicResponse?.success ||
        !Array.isArray(geographicResponse?.comparison?.results)
      ) {
        throw new Error('Unexpected geographic assessment response.');
      }

      const resultsByWard = {};

      // Step 2: Store geographic assessment results.
      geographicResponse.comparison.results.forEach((item) => {
        const returnedName = item?.location?.name;
        if (!returnedName) return;

        const matchingWard = PUNE_WARDS.find(
          (ward) =>
            normalizeWardName(ward.name) ===
            normalizeWardName(returnedName)
        );

        if (!matchingWard) return;

        if (item.status !== 'success' || !item.assessment) {
          resultsByWard[matchingWard.id] = {
            success: false,
            error: item.error || 'Geographic assessment unavailable'
          };
          return;
        }

        const assessment = item.assessment;
        const hazards = assessment.hazards || {};
        const overall = assessment.overall_risk || {};

        resultsByWard[matchingWard.id] = {
          success: true,

          overallScore: getValidScore(
            overall.score ?? item.overall_risk_score
          ),

          classification:
            overall.classification ||
            item.classification ||
            'Unavailable',

          dominantHazard:
            overall.dominant_hazard ||
            item.dominant_hazard ||
            null,

          heatScore: getValidScore(
            hazards.heat?.risk_score ?? item.hazard_scores?.heat
          ),

          airScore: getValidScore(
            hazards.air?.risk_score ?? item.hazard_scores?.air
          ),

          rainScore: getValidScore(
            hazards.rain?.risk_score ?? item.hazard_scores?.rain
          ),

          assessment,
          generatedAt: assessment.generated_at || null
        };
      });

      const geographicSuccessCount = Object.values(resultsByWard)
        .filter((item) => item.success).length;

      // Step 3: Run the community assessment for every successful ward.
      // Each request uses the hazard scores returned by the geographic engine.
      const communityTasks = PUNE_WARDS.map(async (ward) => {
        const geographic = resultsByWard[ward.id];

        if (!geographic?.success) {
          return {
            wardId: ward.id,
            success: false,
            error: 'Geographic assessment unavailable'
          };
        }

        const payload = {
          profile: 'general',
          hazard_scores: {
            heat_score: geographic.heatScore,
            air_score: geographic.airScore,
            rain_score: geographic.rainScore
          }
        };

        try {
          const response = await apiService.assessCommunity(payload);

          if (!response?.success || !response?.assessment) {
            throw new Error('Unexpected community assessment response.');
          }

          const community = response.assessment.community || {};
          const hazardAssessments =
            response.assessment.hazard_assessments || {};

          return {
            wardId: ward.id,
            success: true,

            vulnerabilityScore: getValidScore(
              community.vulnerability_score
            ),

            profile: community.profile || 'general',
            profileLabel: community.label || 'General population',

            dataType:
              community.data_type ||
              'Illustrative prototype profile',

            demographicDataVerified:
              community.demographic_data_verified === true,

            hazardAssessments,

            communityAdjustedScore:
              calculateCommunityAdjustedScore(hazardAssessments),

            responseNotice: response.notice || null
          };
        } catch (error) {
          console.error(
            `Community assessment failed for ${ward.name}:`,
            error
          );

          return {
            wardId: ward.id,
            success: false,
            error:
              error.response?.data?.detail ||
              error.message ||
              'Community assessment failed'
          };
        }
      });

      const communityResults = await Promise.all(communityTasks);

      if (currentRequestId !== requestIdRef.current) return;

      // Step 4: Merge geographic and community assessment results.
      communityResults.forEach((community) => {
        if (resultsByWard[community.wardId]) {
          resultsByWard[community.wardId] = {
            ...resultsByWard[community.wardId],
            communityAssessment: community
          };
        }
      });

      setBackendResults(resultsByWard);
      setSuccessfulCount(geographicSuccessCount);

      setPriorityInsights(
        geographicResponse.comparison.priority_insights || []
      );

      setLastUpdated(new Date());

      const communitySuccessCount = communityResults.filter(
        (item) => item.success
      ).length;

      if (geographicSuccessCount > 0) {
        setAssessmentStatus('live');

        if (communitySuccessCount === geographicSuccessCount) {
          toast.success(
            `Geographic and community assessments completed for ${geographicSuccessCount} wards`
          );
        } else {
          toast.success(
            `Geographic assessments completed for ${geographicSuccessCount} wards`
          );

          setAssessmentError(
            `Community assessment succeeded for ${communitySuccessCount} of ${geographicSuccessCount} assessed wards. Some community-adjusted scores may be unavailable.`
          );
        }
      } else {
        setAssessmentStatus('fallback');

        setAssessmentError(
          'The backend did not return any successful geographic assessments.'
        );

        toast.error('No successful geographic assessments received.');
      }
    } catch (error) {
      if (currentRequestId !== requestIdRef.current) return;

      console.error('Geographic assessment error:', error);

      setAssessmentStatus('fallback');

      setAssessmentError(
        error.response?.data?.detail ||
        error.message ||
        'Unable to connect to the geographic assessment service.'
      );

      setSuccessfulCount(0);

      toast.error(
        'Geographic backend unavailable. Showing local demonstration data.'
      );
    }
  };

  // Automatically assess all wards when the map opens.
  useEffect(() => {
    loadGeographicAssessments();

    return () => {
      requestIdRef.current += 1;
    };
  }, []);

  // --------------------------------------------------
  // MERGE BACKEND SCORES WITH LOCAL WARD INFORMATION
  // --------------------------------------------------

  const displayedWards = useMemo(() => {
    return PUNE_WARDS.map((ward) => {
      const backend = backendResults[ward.id];

      if (!backend?.success) {
        return {
          ...ward,
          scoreSource: 'local',
          backendAssessment: null,
          communityAssessment: null
        };
      }

      return {
        ...ward,

        riskProfile: {
          ...ward.riskProfile,

          overallScore:
            backend.overallScore ?? ward.riskProfile.overallScore,

          heatScore:
            backend.heatScore ?? ward.riskProfile.heatScore,

          airQualityScore:
            backend.airScore ?? ward.riskProfile.airQualityScore,

          floodScore:
            backend.rainScore ?? ward.riskProfile.floodScore
        },

        backendAssessment: backend,
        communityAssessment: backend.communityAssessment,
        scoreSource: 'backend'
      };
    });
  }, [backendResults]);

  // --------------------------------------------------
  // SELECTED WARD
  // --------------------------------------------------

  const clickedWard = displayedWards.find(
    (ward) => ward.id === clickedWardId
  ) || null;

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredWards = displayedWards.filter((ward) =>
    ward.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ward.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ward.wardNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --------------------------------------------------
  // ACTIVE LAYER SCORE
  // --------------------------------------------------

  const getScoreForLayer = (ward) => {
    switch (activeLayer) {
      case 'heat':
        return ward.riskProfile.heatScore;

      case 'air':
        return ward.riskProfile.airQualityScore;

      case 'flood':
        return ward.riskProfile.floodScore;

      case 'vulnerability':
        return ward.communityAssessment?.success
          ? ward.communityAssessment.communityAdjustedScore
          : null;

      default:
        return ward.riskProfile.overallScore;
    }
  };

  // --------------------------------------------------
  // WARD SELECTION
  // --------------------------------------------------

  const handleSelectWardFromList = (ward) => {
    setClickedWardId(ward.id);
    setSelectedWard(ward);
    setMapTarget(ward.coordinates);
    setMapZoom(14);

    toast.success(`Centered on ${ward.name}`);
  };

  const handleSelectWardFromMap = (ward) => {
    setClickedWardId(ward.id);
    setSelectedWard(ward);
  };

  // --------------------------------------------------
  // RESET MAP
  // --------------------------------------------------

  const handleResetView = () => {
    setMapTarget([
      PUNE_COORDINATES.lat,
      PUNE_COORDINATES.lng
    ]);

    setMapZoom(12);
    setSearchQuery('');

    toast('Reset map view to Pune Central');
  };

  // --------------------------------------------------
  // FULLSCREEN
  // --------------------------------------------------

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await mapWrapperRef.current?.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast.error('Unable to change fullscreen mode.');
    }
  };

  // --------------------------------------------------
  // LAYER BUTTONS
  // --------------------------------------------------

  const layerButtons = [
    { id: 'overall', label: 'Overall Priority', icon: ShieldAlert },
    { id: 'heat', label: 'Heat Risk', icon: Flame },
    { id: 'air', label: 'Air Quality', icon: Wind },
    { id: 'flood', label: 'Rainfall & Flooding', icon: CloudRain },
    { id: 'vulnerability', label: 'Vulnerability', icon: Users }
  ];

  // --------------------------------------------------
  // DATA SOURCE LABELS
  // --------------------------------------------------

  const isLive = assessmentStatus === 'live';

  const getLayerSourceLabel = () => {
    if (activeLayer === 'vulnerability') {
      return 'Backend community-adjusted screening (illustrative profile)';
    }

    if (isLive) {
      return 'Live geographic backend assessment';
    }

    return 'Local demonstration data';
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* PAGE HEADER */}

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800">
              <MapPin className="w-5 h-5" />
            </span>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Pune Community Risk Map (PMC Area)
            </h1>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Interactive geographic environmental health-risk screening
            across Pune wards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border ${isLive
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : assessmentStatus === 'loading'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
            {isLive ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : assessmentStatus === 'loading' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <WifiOff className="w-3.5 h-3.5" />
            )}

            <span>
              {isLive
                ? `Backend Live (${successfulCount}/10)`
                : assessmentStatus === 'loading'
                  ? 'Assessing 10 wards...'
                  : 'Demo Data'}
            </span>
          </div>

          <button
            onClick={loadGeographicAssessments}
            disabled={assessmentStatus === 'loading'}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-900 text-white text-xs font-semibold hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${assessmentStatus === 'loading' ? 'animate-spin' : ''
              }`} />

            {assessmentStatus === 'loading'
              ? 'Assessing...'
              : 'Refresh Assessments'}
          </button>
        </div>
      </div>

      {/* ASSESSMENT INFORMATION */}

      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span className="font-semibold">Data source:</span>
          <span>{getLayerSourceLabel()}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {lastUpdated
              ? `Last assessed: ${lastUpdated.toLocaleTimeString()}`
              : 'Waiting for first assessment'}
          </span>
        </div>
      </div>

      {assessmentError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
          <strong>Assessment information:</strong> {assessmentError}
          <p className="mt-1">
            Some results may use local demonstration data or may be unavailable.
          </p>
        </div>
      )}

      {/* VULNERABILITY LAYER EXPLANATION */}

      {activeLayer === 'vulnerability' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Users className="w-4 h-4 text-amber-800 mt-0.5" />

            <div>
              <h3 className="text-xs font-bold text-amber-900">
                Community-adjusted vulnerability screening
              </h3>

              <p className="text-xs text-amber-800 mt-1">
                Scores are calculated by the backend using hazard scores,
                exposure assumptions and the selected community profile.
                The general profile currently uses a vulnerability assumption
                of 50/100. These are illustrative prototype estimates, not
                verified ward-level demographic measurements.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LAYER SWITCHER */}

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap bg-slate-100 p-1 rounded-xl w-fit max-w-full">
          {layerButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activeLayer === btn.id;

            return (
              <button
                key={btn.id}
                onClick={() => setActiveLayer(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN MAP AND WARD DIRECTORY */}

      <div
        ref={mapWrapperRef}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative"
      >
        {/* LEFT: WARD DIRECTORY */}

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

              <input
                type="text"
                placeholder="Search Pune ward, zone, or number..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Wards Found: <strong>{filteredWards.length}</strong>
              </span>

              <button
                onClick={handleResetView}
                className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Map</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredWards.map((ward) => {
                const score = getScoreForLayer(ward);
                const isSelected = clickedWardId === ward.id;
                const tier = score === null ? null : getRiskTier(score);

                return (
                  <div
                    key={ward.id}
                    onClick={() => handleSelectWardFromList(ward)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${isSelected
                        ? 'bg-teal-50/80 border-teal-400 shadow-xs ring-1 ring-teal-400'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-xs">
                            {ward.name}
                          </h4>

                          <span className="text-[10px] text-slate-400 font-mono">
                            ({ward.wardNumber})
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ward.zone}
                        </p>
                      </div>

                      <div className="text-right">
                        {tier ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tier.color}`}>
                            {tier.label.split(' ')[0]}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            Unavailable
                          </span>
                        )}

                        <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                          {score === null ? '--' : `${score}/100`}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Slum: {ward.slumPopulationPercent}%</span>
                      <span>Seniors: {ward.seniorCitizenPercent}%</span>
                      <span>Beds: {ward.hospitalBedsPerThousand}/k</span>
                    </div>

                    <div className="mt-2 text-[10px] font-semibold">
                      {activeLayer === 'vulnerability' ? (
                        ward.communityAssessment?.success ? (
                          <span className="text-emerald-700">
                            Backend community screening
                          </span>
                        ) : (
                          <span className="text-amber-700">
                            Community score unavailable
                          </span>
                        )
                      ) : backendResults[ward.id]?.success ? (
                        <span className="text-emerald-700">
                          Live backend assessment
                        </span>
                      ) : (
                        <span className="text-amber-700">
                          Local demonstration score
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredWards.length === 0 && (
                <div className="text-center text-xs text-slate-500 py-6">
                  No wards match your search.
                </div>
              )}
            </div>
          </div>

          <MapLegend activeLayer={activeLayer} />
        </div>

        {/* RIGHT: LEAFLET MAP */}

        <div className="lg:col-span-8 flex flex-col">
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100 h-[560px] lg:h-[640px] w-full">
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <button
                onClick={handleResetView}
                title="Reset View to Pune Center"
                className="p-2.5 rounded-xl bg-white/95 text-slate-700 hover:text-slate-900 hover:bg-white shadow-md border border-slate-200"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}
                className="p-2.5 rounded-xl bg-white/95 text-slate-700 hover:text-slate-900 hover:bg-white shadow-md border border-slate-200"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-semibold text-slate-800 flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-amber-500'
                } animate-pulse`} />

              <span>
                {isLive
                  ? 'Live Geographic Assessment'
                  : 'Pune Ward Demonstration Mesh'}
              </span>
            </div>

            <MapContainer
              center={[PUNE_COORDINATES.lat, PUNE_COORDINATES.lng]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <MapViewController
                targetCoordinates={mapTarget}
                zoomLevel={mapZoom}
              />

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {displayedWards.map((ward) => {
                const score = getScoreForLayer(ward);
                const color = getRiskColor(score);
                const isSelected = clickedWardId === ward.id;

                return (
                  <React.Fragment key={ward.id}>
                    <Circle
                      center={ward.coordinates}
                      radius={1200}
                      pathOptions={{
                        color,
                        fillColor: color,
                        fillOpacity: isSelected ? 0.35 : 0.20,
                        weight: isSelected ? 3 : 1.5,
                        dashArray: isSelected ? '4, 4' : null
                      }}
                      eventHandlers={{
                        click: () => handleSelectWardFromMap(ward)
                      }}
                    />

                    <Marker
                      position={ward.coordinates}
                      icon={createCustomMarker(score, isSelected)}
                      eventHandlers={{
                        click: () => handleSelectWardFromMap(ward)
                      }}
                    >
                      <Popup>
                        <div className="p-3 text-xs space-y-1.5 min-w-[200px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">
                              {ward.name}
                            </span>

                            <span className="font-mono text-[10px] text-slate-400">
                              {ward.wardNumber}
                            </span>
                          </div>

                          <p className="text-slate-500 text-[11px]">
                            {ward.zone}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-slate-600 font-medium">
                              {activeLayer === 'vulnerability'
                                ? 'Community-adjusted score:'
                                : 'Layer score:'}
                            </span>

                            <span className="font-bold font-mono text-slate-900">
                              {score === null ? '--' : `${score}/100`}
                            </span>
                          </div>

                          {activeLayer === 'vulnerability' && (
                            <>
                              <div className="flex justify-between text-[10px] text-slate-600">
                                <span>Profile vulnerability assumption</span>
                                <strong>
                                  {ward.communityAssessment?.vulnerabilityScore ?? '--'}/100
                                </strong>
                              </div>

                              <p className="text-[10px] text-amber-700">
                                Illustrative profile-based screening; not measured demographics.
                              </p>
                            </>
                          )}

                          <p className="text-[10px] text-slate-500">
                            {activeLayer === 'vulnerability'
                              ? ward.communityAssessment?.success
                                ? 'Backend community assessment'
                                : 'Community assessment unavailable'
                              : backendResults[ward.id]?.success
                                ? 'Backend geographic assessment'
                                : 'Local demonstration data'}
                          </p>

                          <button
                            onClick={() => handleSelectWardFromMap(ward)}
                            className="w-full mt-2 py-1 px-2 rounded bg-emerald-800 text-white font-semibold text-[11px] hover:bg-emerald-700"
                          >
                            Inspect Full Vulnerability Data
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </div>

      {/* PRIORITY INSIGHTS */}

      {isLive && priorityInsights.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h3 className="font-bold text-sm text-slate-900 mb-3">
            Geographic Priority Insights
          </h3>

          <div className="space-y-2">
            {priorityInsights.map((insight, index) => (
              <div
                key={index}
                className="text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3"
              >
                {typeof insight === 'string'
                  ? insight
                  : insight.message ||
                  insight.description ||
                  JSON.stringify(insight)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SELECTED WARD DETAIL DRAWER */}

      {clickedWard && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Inspecting Ward Dossier:{' '}
              <span className="text-teal-700">
                {clickedWard.name}
              </span>
            </h3>

            <span className="text-xs text-slate-500">
              Click another marker to inspect its data
            </span>
          </div>

          <WardDetailDrawer
            ward={clickedWard}
            onClose={() => setClickedWardId(null)}
          />
        </div>
      )}
    </div>
  );
};

export default PuneCommunityRiskMap;
