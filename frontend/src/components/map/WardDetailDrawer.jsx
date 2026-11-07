import React from 'react';
import {
  X,
  MapPin,
  Building,
  Thermometer,
  Wind,
  CloudRain,
  Activity,
  HeartPulse,
  Trees,
  CheckCircle2,
  Sliders,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HazardBadge } from '../common/StatusBadge';
import { useClimate } from '../../context/ClimateContext';
import toast from 'react-hot-toast';

export const WardDetailDrawer = ({ ward, onClose }) => {
  const { setSelectedWard } = useClimate();

  if (!ward) return null;

  const handleSetActive = () => {
    setSelectedWard(ward);
    toast.success(`Active ward set to ${ward.name}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
      {/* Drawer Header */}
      <div className="bg-emerald-950 text-white p-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-800 text-emerald-200 border border-emerald-700">
              {ward.wardNumber}
            </span>
            <span className="text-xs text-emerald-300 font-medium">{ward.zone}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight mt-1">{ward.name}</h3>
          <p className="text-xs text-emerald-300/80 font-mono mt-0.5">
            Coord: {ward.coordinates[0].toFixed(4)}°N, {ward.coordinates[1].toFixed(4)}°E
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs">
        {/* Risk Summary Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-slate-500 font-medium">Composite Risk Screening</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-900 font-sans">
                {ward.riskProfile.overallScore}
              </span>
              <span className="text-slate-400 font-semibold">/ 100</span>
            </div>
          </div>
          <HazardBadge
            level={
              ward.riskProfile.overallScore >= 75 ? 'Critical' :
              ward.riskProfile.overallScore >= 55 ? 'High' :
              ward.riskProfile.overallScore >= 35 ? 'Moderate' : 'Low'
            }
          />
        </div>

        {/* Hazard Breakdown Grid */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Hazard Vulnerability Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                <Thermometer className="w-3.5 h-3.5" />
                <span>Heat Risk</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">{ward.riskProfile.heatRisk}</span>
                <span className="font-bold text-slate-900">{ward.riskProfile.heatScore}/100</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-purple-50/70 border border-purple-200 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-800 font-semibold">
                <Wind className="w-3.5 h-3.5" />
                <span>Air Pollution</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">{ward.riskProfile.airQualityRisk}</span>
                <span className="font-bold text-slate-900">{ward.riskProfile.airQualityScore}/100</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 space-y-1">
              <div className="flex items-center gap-1.5 text-blue-800 font-semibold">
                <CloudRain className="w-3.5 h-3.5" />
                <span>Flood Risk</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">{ward.riskProfile.floodRisk}</span>
                <span className="font-bold text-slate-900">{ward.riskProfile.floodScore}/100</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200 space-y-1">
              <div className="flex items-center gap-1.5 text-teal-800 font-semibold">
                <Activity className="w-3.5 h-3.5" />
                <span>Vector Risk</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">{ward.riskProfile.vectorSuitability}</span>
                <span className="font-bold text-slate-900">{ward.riskProfile.vectorScore}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics & Physical Topography */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Community Demographics & Physical Factors
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500">Population:</span>
              <p className="font-semibold text-slate-800">{ward.population.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-slate-500">Slum Population:</span>
              <p className="font-semibold text-slate-800">{ward.slumPopulationPercent}%</p>
            </div>
            <div>
              <span className="text-slate-500">Seniors (&gt;65 yrs):</span>
              <p className="font-semibold text-slate-800">{ward.seniorCitizenPercent}%</p>
            </div>
            <div>
              <span className="text-slate-500">Children (&lt;5 yrs):</span>
              <p className="font-semibold text-slate-800">{ward.underFivePercent}%</p>
            </div>
            <div>
              <span className="text-slate-500">Green Canopy Cover:</span>
              <p className="font-semibold text-slate-800">{ward.greenCoverPercent}%</p>
            </div>
            <div>
              <span className="text-slate-500">Impervious Surface:</span>
              <p className="font-semibold text-slate-800">{ward.imperviousSurfacePercent}%</p>
            </div>
          </div>
        </div>

        {/* Localized Hotspots */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Identified Local Vulnerability Hotspots
          </h4>
          <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-[11px] space-y-1.5">
            <div>
              <strong className="text-amber-900">🌊 Inundation & Drainage Choke:</strong>
              <p className="text-slate-600">{ward.floodZones.join(', ')}</p>
            </div>
            <div>
              <strong className="text-amber-900">☀️ Urban Heat Island Focus:</strong>
              <p className="text-slate-600">{ward.heatHotspots.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Healthcare Infrastructure */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Healthcare Access
          </h4>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] space-y-1">
            <p className="text-slate-700">
              <strong>Primary Health Centres:</strong> {ward.primaryHealthCentres} UPHCs
            </p>
            <p className="text-slate-700">
              <strong>Hospital Bed Density:</strong> {ward.hospitalBedsPerThousand} beds / 1,000 residents
            </p>
            <p className="text-slate-700">
              <strong>Key Facilities:</strong> {ward.majorHospitals.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Drawer Action Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
        <button
          onClick={handleSetActive}
          className="w-full py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Set as Active Ward Across Platform</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/intelligence?ward=${ward.id}`}
            className="py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Brain className="w-3.5 h-3.5 text-teal-700" />
            <span>AI Risk Audit</span>
          </Link>
          <Link
            to={`/simulator?ward=${ward.id}`}
            className="py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-teal-700" />
            <span>Simulate</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WardDetailDrawer;

