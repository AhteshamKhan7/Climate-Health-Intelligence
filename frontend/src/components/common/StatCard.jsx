import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  status,
  statusColor = 'teal',
  trend,
  trendDirection, // 'up' | 'down' | 'neutral'
  className = ''
}) => {
  const statusStyles = {
    teal: 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]',
    blue: 'bg-[#E4F1F3] text-[#2c658f] border-[#b8dae6]',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    orange: 'bg-orange-50 text-orange-800 border-orange-200',
    red: 'bg-red-50 text-red-800 border-red-200',
    purple: 'bg-[#E8E4F5] text-[#4c3b7a] border-[#d4cbec]',
  };

  return (
    <div className={`bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between ${className}`}>
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold tracking-wider text-[#66847D] uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl font-extrabold tracking-tight text-[#203C37] font-sans">
              {value}
            </span>
            {unit && <span className="text-sm font-semibold text-[#66847D]">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-xl bg-[#EAF3ED] text-[#368F83] border border-[#D2E4DA] flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Bottom Footer: Short Status & Optional Trend */}
      <div className="mt-4 pt-3 border-t border-[#E8F1EC] flex items-center justify-between text-xs">
        {status && (
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusStyles[statusColor] || statusStyles.teal}`}>
            {status}
          </span>
        )}

        {trend && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#66847D]">
            {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5 text-amber-600" />}
            {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />}
            {trendDirection === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
