import React from 'react';
import { SunMedium, Wind, CloudRain, Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HazardRiskCards = ({ scores }) => {
  const cards = [
    {
      id: 'heat',
      title: 'Extreme Heat',
      score: scores.heat.score,
      level: scores.heat.level,
      metric: scores.heat.metric,
      icon: SunMedium,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      barColor: 'bg-amber-500',
      tag: 'Thermal exhaustion & dehydration',
      challengeTab: 'extreme-heat'
    },
    {
      id: 'air',
      title: 'Air Pollution',
      score: scores.air.score,
      level: scores.air.level,
      metric: scores.air.metric,
      icon: Wind,
      color: 'text-purple-600',
      bgColor: 'bg-[#E8E4F5]',
      borderColor: 'border-purple-200',
      barColor: 'bg-purple-500',
      tag: 'Airway reactivity & PM2.5 deposition',
      challengeTab: 'air-pollution'
    },
    {
      id: 'flood',
      title: 'Rainfall & Flooding',
      score: scores.flood.score,
      level: scores.flood.level,
      metric: scores.flood.metric,
      icon: CloudRain,
      color: 'text-[#4B91C5]',
      bgColor: 'bg-[#E4F1F3]',
      borderColor: 'border-blue-200',
      barColor: 'bg-[#4B91C5]',
      tag: 'Drainage surcharge & waterlogging',
      challengeTab: 'heavy-rainfall'
    },
    {
      id: 'vector',
      title: 'Disease Suitability',
      score: scores.vector.score,
      level: scores.vector.level,
      metric: scores.vector.metric,
      icon: Activity,
      color: 'text-[#368F83]',
      bgColor: 'bg-[#EAF3ED]',
      borderColor: 'border-[#D2E4DA]',
      barColor: 'bg-[#368F83]',
      tag: 'Aedes mosquito replication window',
      challengeTab: 'climate-sensitive-diseases'
    }
  ];

  const getTierBadge = (level) => {
    switch (level) {
      case 'Critical': return 'bg-red-50 text-red-800 border-red-200';
      case 'High': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Moderate': return 'bg-amber-50 text-amber-800 border-amber-200';
      default: return 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-4.5 border border-[#D2E4DA] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getTierBadge(card.level)}`}>
                  {card.level}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-bold text-[#203C37]">{card.title}</h3>
              <p className="text-[11px] text-[#52756d] mt-0.5 font-medium">{card.tag}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8F1EC]">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-bold text-[#203C37]">{card.metric}</span>
                <span className="font-mono font-extrabold text-[#203C37]">{card.score}/100</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#E8F1EC] rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${card.barColor} transition-all duration-700`}
                  style={{ width: `${Math.min(100, card.score)}%` }}
                />
              </div>

              <div className="mt-3 flex justify-end">
                <Link
                  to={`/challenges?hazard=${card.challengeTab}`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#368F83] hover:text-[#245B4B]"
                >
                  <span>Protocol Details</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HazardRiskCards;
