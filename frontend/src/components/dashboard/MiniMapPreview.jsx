import React from 'react';
import { MapPin, Navigation, ExternalLink, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useClimate } from '../../context/ClimateContext';

export const MiniMapPreview = () => {
  const { selectedWard } = useClimate();

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Pune Geospatial Risk View</h3>
              <p className="text-[11px] text-slate-500">PMC Ward Micro-climate Screening</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            OpenStreetMap
          </span>
        </div>

        {/* Visual Map Mock/Preview Banner */}
        <div className="mt-4 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-44 flex items-center justify-center group">
          {/* Stylized geometric background representing map topography */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 opacity-90" />
          
          {/* Subtle grid lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

          {/* Center Pin & Pulse */}
          <div className="relative z-10 flex flex-col items-center text-center p-4">
            <div className="relative">
              <div className="absolute -inset-2 bg-emerald-500 rounded-full animate-ping opacity-40" />
              <div className="relative p-2.5 bg-emerald-500 text-slate-950 rounded-full shadow-lg">
                <Navigation className="w-5 h-5 transform rotate-45" />
              </div>
            </div>
            <h4 className="text-white font-bold text-sm mt-2">{selectedWard?.name || 'Shivajinagar'}</h4>
            <p className="text-emerald-300 text-xs">{selectedWard?.zone || 'Central Pune'} • {selectedWard?.wardNumber || 'Ward 08'}</p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-300">
              <span>Risk: <strong>{selectedWard?.riskProfile?.overallScore || 58}/100</strong></span>
              <span>•</span>
              <span>Slum: <strong>{selectedWard?.slumPopulationPercent || 18.5}%</strong></span>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 z-10">
            <span className="px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 font-mono backdrop-blur-xs">
              Lat: {selectedWard?.coordinates?.[0] || 18.5204}° N
            </span>
          </div>
        </div>

        {/* Ward Key Hazards Strip */}
        <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Major Inundation Zones:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[180px]">
              {selectedWard?.floodZones?.[0] || 'Mutha River Shore'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Heat Island Hotspot:</span>
            <span className="font-semibold text-slate-700 truncate max-w-[180px]">
              {selectedWard?.heatHotspots?.[0] || 'Dense Market Core'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Primary Health Facilities:</span>
            <span className="font-semibold text-slate-700">
              {selectedWard?.primaryHealthCentres || 3} UPHCs / {selectedWard?.majorHospitals?.length || 2} Major
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100">
        <Link
          to="/map"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
        >
          <span>Explore Interactive Pune Community Map</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default MiniMapPreview;

