import React, { useState, useEffect, useRef } from 'react';
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
  Compass,
  MapPin,
  Info,
  ShieldAlert,
  Flame,
  Wind,
  CloudRain,
  Users,
  Crosshair
} from 'lucide-react';
import { PUNE_WARDS, PUNE_COORDINATES, getRiskColor, getRiskTier } from '../data/puneWards';
import MapLegend from '../components/map/MapLegend';
import WardDetailDrawer from '../components/map/WardDetailDrawer';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { useClimate } from '../context/ClimateContext';
import toast from 'react-hot-toast';

// Helper component to control map panning and zooming
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

// Create custom colored pin markers using Leaflet DivIcon
const createCustomMarker = (score, isSelected) => {
  const color = getRiskColor(score);
  const size = isSelected ? 36 : 28;
  const pulseClass = isSelected ? 'ring-4 ring-white ring-offset-2 scale-115' : 'hover:scale-110';

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
        transition: transform 0.2s ease;
      " class="${pulseClass}">
        ${score}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

export const PuneCommunityRiskMap = () => {
  const { selectedWard, setSelectedWard } = useClimate();
  const [activeLayer, setActiveLayer] = useState('overall'); // 'overall' | 'heat' | 'air' | 'flood' | 'vulnerability'
  const [searchQuery, setSearchQuery] = useState('');
  const [clickedWard, setClickedWard] = useState(selectedWard || PUNE_WARDS[0]);
  const [mapTarget, setMapTarget] = useState([PUNE_COORDINATES.lat, PUNE_COORDINATES.lng]);
  const [mapZoom, setMapZoom] = useState(12);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapWrapperRef = useRef(null);

  // Filter wards by search input
  const filteredWards = PUNE_WARDS.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.wardNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectWardFromList = (ward) => {
    setClickedWard(ward);
    setSelectedWard(ward);
    setMapTarget(ward.coordinates);
    setMapZoom(14);
    toast.success(`Centered on ${ward.name}`);
  };

  const handleResetView = () => {
    setMapTarget([PUNE_COORDINATES.lat, PUNE_COORDINATES.lng]);
    setMapZoom(12);
    setSearchQuery('');
    toast('Reset map view to Pune Central');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapWrapperRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Helper to get score based on active layer
  const getScoreForLayer = (ward) => {
    switch (activeLayer) {
      case 'heat': return ward.riskProfile.heatScore;
      case 'air': return ward.riskProfile.airQualityScore;
      case 'flood': return ward.riskProfile.floodScore;
      case 'vulnerability': return ward.riskProfile.socialVulnerability;
      default: return ward.riskProfile.overallScore;
    }
  };

  const layerButtons = [
    { id: 'overall', label: 'Overall Priority', icon: ShieldAlert },
    { id: 'heat', label: 'Heat Risk', icon: Flame },
    { id: 'air', label: 'Air Quality', icon: Wind },
    { id: 'flood', label: 'Rainfall & Flooding', icon: CloudRain },
    { id: 'vulnerability', label: 'Vulnerability', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Page Title & Controls Strip */}
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
            Interactive GIS geospatial screening of administrative wards, hazard buffers, and healthcare access points across Pune.
          </p>
        </div>

        {/* Layer Switcher Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap bg-slate-100 p-1 rounded-xl">
          {layerButtons.map((btn) => {
            const Icon = btn.icon;
            const isActive = activeLayer === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setActiveLayer(btn.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
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

      {/* Main Interactive Map & Sidebar Layout */}
      <div
        ref={mapWrapperRef}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative"
      >
        {/* Left Side: Ward Search & Selector Directory (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Pune ward, zone, or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Wards Found: <strong>{filteredWards.length}</strong></span>
              <button
                onClick={handleResetView}
                className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Map</span>
              </button>
            </div>

            {/* Wards Scrollable List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredWards.map((ward) => {
                const score = getScoreForLayer(ward);
                const isSelected = clickedWard?.id === ward.id;
                const tier = getRiskTier(score);

                return (
                  <div
                    key={ward.id}
                    onClick={() => handleSelectWardFromList(ward)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-400 shadow-xs ring-1 ring-teal-400'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-xs">{ward.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">({ward.wardNumber})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{ward.zone}</p>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tier.color}`}>
                          {tier.label.split(' ')[0]}
                        </span>
                        <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                          {score}/100
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Slum: {ward.slumPopulationPercent}%</span>
                      <span>Seniors: {ward.seniorCitizenPercent}%</span>
                      <span>Beds: {ward.hospitalBedsPerThousand}/k</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Layer Legend Box */}
          <MapLegend activeLayer={activeLayer} />
        </div>

        {/* Right Side: Leaflet Map Container (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm bg-slate-100 h-[560px] lg:h-[640px] w-full">
            {/* Map Action Overlay Buttons */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <button
                onClick={handleResetView}
                title="Reset View to Pune Center"
                className="p-2.5 rounded-xl bg-white/95 text-slate-700 hover:text-slate-900 hover:bg-white shadow-md border border-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="p-2.5 rounded-xl bg-white/95 text-slate-700 hover:text-slate-900 hover:bg-white shadow-md border border-slate-200 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Top Indicator Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-xs font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Pune Municipal Corporation (PMC) Mesh</span>
            </div>

            {/* React Leaflet Map */}
            <MapContainer
              center={[PUNE_COORDINATES.lat, PUNE_COORDINATES.lng]}
              zoom={12}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              {/* Fly to controller */}
              <MapViewController targetCoordinates={mapTarget} zoomLevel={mapZoom} />

              {/* Standard OpenStreetMap Tiles */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Render Ward Circles and Markers */}
              {PUNE_WARDS.map((ward) => {
                const score = getScoreForLayer(ward);
                const color = getRiskColor(score);
                const isSelected = clickedWard?.id === ward.id;

                return (
                  <React.Fragment key={ward.id}>
                    {/* Catchment Radius Buffer Circle */}
                    <Circle
                      center={ward.coordinates}
                      radius={1200}
                      pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: isSelected ? 0.35 : 0.20,
                        weight: isSelected ? 3 : 1.5,
                        dashArray: isSelected ? '4, 4' : null
                      }}
                      eventHandlers={{
                        click: () => {
                          setClickedWard(ward);
                          setSelectedWard(ward);
                        }
                      }}
                    />

                    {/* Ward Center Marker */}
                    <Marker
                      position={ward.coordinates}
                      icon={createCustomMarker(score, isSelected)}
                      eventHandlers={{
                        click: () => {
                          setClickedWard(ward);
                          setSelectedWard(ward);
                        }
                      }}
                    >
                      <Popup>
                        <div className="p-3 text-xs space-y-1.5 min-w-[200px]">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{ward.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{ward.wardNumber}</span>
                          </div>
                          <p className="text-slate-500 text-[11px]">{ward.zone}</p>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-slate-600 font-medium">Layer Score:</span>
                            <span className="font-bold font-mono text-slate-900">{score}/100</span>
                          </div>
                          <button
                            onClick={() => {
                              setClickedWard(ward);
                              setSelectedWard(ward);
                            }}
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

      {/* Selected Ward Detail Drawer Modal */}
      {clickedWard && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Inspecting Ward Dossier: <span className="text-teal-700">{clickedWard.name}</span>
            </h3>
            <span className="text-xs text-slate-500">
              Click any other marker on the map to inspect its data
            </span>
          </div>
          <WardDetailDrawer
            ward={clickedWard}
            onClose={() => setClickedWard(null)}
          />
        </div>
      )}
    </div>
  );
};

export default PuneCommunityRiskMap;

