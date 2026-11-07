import React, { useState } from 'react';
import { BellRing, Clock, MapPin, ChevronRight, AlertTriangle, ShieldAlert, Sparkles } from 'lucide-react';
import { MOCK_ALERTS } from '../../data/mockBackendData';
import { Link } from 'react-router-dom';

export const AlertsList = () => {
  const [filter, setFilter] = useState('all');

  const filteredAlerts = filter === 'all'
    ? MOCK_ALERTS
    : MOCK_ALERTS.filter(a => a.hazard.toLowerCase().includes(filter.toLowerCase()));

  const getSeverityBadge = (hazard) => {
    if (hazard.toLowerCase().includes('air')) {
      return { label: 'High Priority', style: 'bg-purple-50 text-purple-800 border-purple-200' };
    }
    if (hazard.toLowerCase().includes('heat')) {
      return { label: 'Severe Alert', style: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    if (hazard.toLowerCase().includes('vector')) {
      return { label: 'Elevated Risk', style: 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]' };
    }
    return { label: 'Advisory', style: 'bg-slate-50 text-slate-700 border-slate-200' };
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E8F1EC]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#203C37]">Early Warning Notices</h3>
              <p className="text-[11px] text-[#66847D]">Active PMC surveillance alerts</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {MOCK_ALERTS.length} Active
          </span>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto text-[11px]">
          {['all', 'Air Quality', 'Vector', 'Heat'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${
                filter === item
                  ? 'bg-[#245B4B] text-white shadow-xs'
                  : 'bg-[#EAF3ED] text-[#66847D] hover:text-[#203C37]'
              }`}
            >
              {item === 'all' ? 'All Alerts' : item}
            </button>
          ))}
        </div>

        {/* Compact Alerts list */}
        <div className="space-y-2.5 mt-1 max-h-72 overflow-y-auto pr-1">
          {filteredAlerts.map((alert) => {
            const badge = getSeverityBadge(alert.hazard);
            return (
              <div
                key={alert.id}
                className="p-3 rounded-xl border border-[#D2E4DA] bg-[#EAF3ED]/30 hover:bg-[#EAF3ED]/60 transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border flex-shrink-0 ${badge.style}`}>
                      {badge.label}
                    </span>
                    <span className="font-bold text-[#203C37] text-xs truncate">
                      {alert.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#66847D] font-mono flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {alert.issuedAt}
                  </span>
                </div>

                <p className="text-[#66847D] text-[11px] leading-relaxed">
                  {alert.description}
                </p>

                <div className="pt-1.5 border-t border-[#D2E4DA]/60 flex items-center justify-between text-[10px] text-[#66847D]">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-[#368F83]" />
                    {alert.affectedWards.join(', ')}
                  </span>
                  <span className="font-semibold text-amber-800">{alert.validUntil}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-[#E8F1EC] text-right">
        <Link
          to="/map"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#368F83] hover:text-[#245B4B] transition-colors"
        >
          <span>View Affected Wards on Map</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default AlertsList;
