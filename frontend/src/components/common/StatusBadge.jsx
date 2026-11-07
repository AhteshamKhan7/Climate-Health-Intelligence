import React from 'react';
import { RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const BackendStatusPill = ({ isOnline, isChecking, onRetry }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-xs transition-colors ${
          isOnline
            ? 'bg-[#183f34] text-emerald-300 border-emerald-600/50'
            : 'bg-amber-950/80 text-amber-300 border-amber-600/50'
        }`}
        title={isOnline ? 'Live Sensor Mesh Connected' : 'Simulated Baseline Mode Active'}
      >
        <span className="relative flex h-2 w-2">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          )}
        </span>
        <span className="font-mono text-[10px]">
          {isOnline ? 'API LIVE' : 'DEMO MODE'}
        </span>
      </div>

      <button
        onClick={onRetry}
        disabled={isChecking}
        title="Check Backend Connection"
        className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#1d4b3e] transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export const HazardBadge = ({ level, score }) => {
  const styles = {
    Low: 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]',
    Moderate: 'bg-amber-50 text-amber-800 border-amber-200',
    High: 'bg-orange-50 text-orange-800 border-orange-200',
    Critical: 'bg-red-50 text-red-800 border-red-200'
  };

  const currentStyle = styles[level] || styles.Moderate;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${currentStyle}`}>
      {level === 'Critical' && <AlertTriangle className="w-3 h-3 text-red-600" />}
      {level === 'Low' && <ShieldCheck className="w-3 h-3 text-[#368F83]" />}
      {level}
      {score !== undefined && <span className="opacity-75 font-mono ml-0.5">({score})</span>}
    </span>
  );
};

export default BackendStatusPill;
