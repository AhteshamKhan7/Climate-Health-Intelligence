import React from 'react';
import { Info, Database } from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';

export const DisclaimerBanner = () => {
  const { isBackendOnline, dataSourceLabel, selectedWard } = useClimate();

  return (
    <div className="bg-white border border-[#D2E4DA] rounded-xl p-3 sm:p-3.5 text-xs shadow-xs mb-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#EAF3ED] text-[#368F83] flex-shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#203C37]">
            <span className="font-semibold">
              Public Health Screening Platform:
            </span>
            <span className="text-[#66847D]">
              Population-level environmental exposure screening proxies for Pune PMC area.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 text-[11px]">
          <span className="text-[#66847D] hidden md:inline">
            Source: <strong className="text-[#203C37]">{dataSourceLabel}</strong>
          </span>
          <span className={`px-2 py-0.5 rounded-md font-semibold border ${
            isBackendOnline
              ? 'bg-[#EAF3ED] text-[#245B4B] border-[#368F83]/40'
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isBackendOnline ? 'Live Sensor Mesh' : 'Modeled Baseline'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
