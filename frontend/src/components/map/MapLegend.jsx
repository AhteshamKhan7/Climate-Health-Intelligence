import React from 'react';
import { Layers, Info } from 'lucide-react';

export const MapLegend = ({ activeLayer }) => {
  const getLayerDescription = () => {
    switch (activeLayer) {
      case 'heat':
        return 'Heat Risk Layer: Based on ambient temperature, impervious surface density, and urban heat island retention.';
      case 'air':
        return 'Air Quality Layer: Based on CPCB PM2.5/PM10 monitoring and heavy traffic vehicular density.';
      case 'flood':
        return 'Rainfall & Flooding Layer: Inundation zones along Mula-Mutha river basin, low-lying nallas (Ambil Odha), and drainage bottlenecks.';
      case 'vulnerability':
        return 'Community Vulnerability Layer: Proportions of senior citizens (>65), children (<5), and informal tin-roof settlements.';
      default:
        return 'Overall Priority Layer: Multi-hazard composite screening index for municipal health resource prioritization.';
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl border border-slate-200/90 shadow-md text-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <Layers className="w-4 h-4 text-teal-700" />
          <span>Active Layer Legend</span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
          {activeLayer}
        </span>
      </div>

      <p className="text-[11px] text-slate-600 leading-relaxed">
        {getLayerDescription()}
      </p>

      {/* Tiers Legend */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white shadow-xs" />
          <span className="text-[11px] text-slate-700 font-medium">Low (0 - 34)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-white shadow-xs" />
          <span className="text-[11px] text-slate-700 font-medium">Moderate (35 - 54)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border border-white shadow-xs" />
          <span className="text-[11px] text-slate-700 font-medium">High (55 - 74)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white shadow-xs" />
          <span className="text-[11px] text-slate-700 font-medium">Critical (75 - 100)</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-start gap-1 text-[10px] text-slate-500">
        <Info className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
        <span>Circles represent PMC administrative ward catchment zones. Click any marker for micro-telemetry.</span>
      </div>
    </div>
  );
};

export default MapLegend;

