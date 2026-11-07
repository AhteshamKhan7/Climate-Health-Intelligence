import React from 'react';

export const RiskGauge = ({
  score = 50,
  size = 'md',
  showLabel = true,
  subtitle = 'Composite Risk Score',
  className = ''
}) => {
  const clampedScore = Math.min(100, Math.max(0, Number(score) || 0));

  let color = '#368F83'; // Primary Teal (Low)
  let tier = 'Low Risk';
  let tierBg = 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]';
  let advice = 'Minimal environmental hazard expected; standard preventive vigilance.';

  if (clampedScore >= 75) {
    color = '#ef4444'; // Red
    tier = 'Critical Risk';
    tierBg = 'bg-red-50 text-red-800 border-red-200';
    advice = 'Severe multi-hazard compound danger. Immediate targeted intervention recommended.';
  } else if (clampedScore >= 55) {
    color = '#f97316'; // Orange
    tier = 'High Risk';
    tierBg = 'bg-orange-50 text-orange-800 border-orange-200';
    advice = 'Elevated hazard exposure for vulnerable citizens. Municipal alert triggered.';
  } else if (clampedScore >= 35) {
    color = '#eab308'; // Amber
    tier = 'Moderate Risk';
    tierBg = 'bg-amber-50 text-amber-800 border-amber-200';
    advice = 'Noticeable micro-climate strain. Precautions advised for outdoor workers.';
  }

  const isLarge = size === 'lg';
  const radius = isLarge ? 68 : 46;
  const stroke = isLarge ? 11 : 7;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Track */}
          <circle
            stroke="#E8F1EC"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-extrabold tracking-tight font-sans text-[#203C37] ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] font-bold text-[#66847D] uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-3 text-center space-y-1">
          <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${tierBg}`}>
            {tier}
          </span>
          <p className="text-xs font-semibold text-[#203C37]">{subtitle}</p>
          <p className="text-[11px] text-[#66847D] max-w-xs">{advice}</p>
        </div>
      )}
    </div>
  );
};

export default RiskGauge;
