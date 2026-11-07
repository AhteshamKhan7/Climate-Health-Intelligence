import React, { useState } from 'react';
import { Brain, Building2, UserCheck, Hospital, CheckCircle2 } from 'lucide-react';

export const AIRecommendations = () => {
  const [activeTab, setActiveTab] = useState('officials'); // 'officials' | 'citizens' | 'healthcare'

  const content = {
    officials: {
      title: 'PMC Health Authority',
      icon: Building2,
      badge: 'Civic Priority',
      badgeStyle: 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]',
      items: [
        'Deploy mobile ORS and shaded cooling kiosks to heavy transit junctions (Swargate, Pune Station).',
        'Issue morning advisories to PMC primary schools to postpone open-ground sports during peak AQI hours.',
        'Activate mechanical mist-cannons along Hadapsar and Karve Road corridors for road dust suppression.',
        'Conduct targeted anti-larval bio-larvicide spraying across Mula-Mutha drainage canals.'
      ]
    },
    citizens: {
      title: 'Citizens & Families',
      icon: UserCheck,
      badge: 'Personal Protection',
      badgeStyle: 'bg-[#E4F1F3] text-[#2c658f] border-[#b8dae6]',
      items: [
        'Maintain daily fluid intake of 2.5 to 3.5 liters; carry hydration supplies during midday commute.',
        'Informal & construction workers should take 15-minute shaded breaks every 2 hours during heat spikes.',
        'Individuals with asthma or chronic bronchitis should use prescribed inhalers before morning commutes.',
        'Inspect residential balconies and flower pots every Sunday; discard stagnant water to eliminate Aedes breeding.'
      ]
    },
    healthcare: {
      title: 'Hospitals & Clinics',
      icon: Hospital,
      badge: 'Clinical Surge',
      badgeStyle: 'bg-[#E8E4F5] text-[#4c3b7a] border-[#d4cbec]',
      items: [
        'Ensure Sassoon General Hospital casualty and UPHC wards have iced IV saline packs and core thermometers ready.',
        'Stock adequate Dengue NS1 antigen and IgM ELISA test kits in peripheral dispensaries (Yerwada, Dhankawadi).',
        'Keep nebulizer stations operational for expected morning pediatric wheezing presentations.',
        'Promptly log confirmed vector-borne case clusters to the Integrated Health Information Platform (IHIP).'
      ]
    }
  };

  const current = content[activeTab];
  const Icon = current.icon;

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E8F1EC]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#E8E4F5] text-[#4c3b7a] border border-[#d4cbec]/60">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#203C37]">AI Action Directives</h3>
              <p className="text-[11px] text-[#66847D]">Multi-stakeholder response protocols</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${current.badgeStyle}`}>
            {current.badge}
          </span>
        </div>

        {/* Stakeholder tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#EAF3ED] p-1 rounded-xl mt-3 text-xs border border-[#D2E4DA]/60">
          <button
            onClick={() => setActiveTab('officials')}
            className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center ${
              activeTab === 'officials'
                ? 'bg-white text-[#203C37] shadow-xs font-bold'
                : 'text-[#66847D] hover:text-[#203C37]'
            }`}
          >
            Municipal
          </button>
          <button
            onClick={() => setActiveTab('citizens')}
            className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center ${
              activeTab === 'citizens'
                ? 'bg-white text-[#203C37] shadow-xs font-bold'
                : 'text-[#66847D] hover:text-[#203C37]'
            }`}
          >
            Citizens
          </button>
          <button
            onClick={() => setActiveTab('healthcare')}
            className={`py-1.5 px-2 rounded-lg font-semibold transition-all text-center ${
              activeTab === 'healthcare'
                ? 'bg-white text-[#203C37] shadow-xs font-bold'
                : 'text-[#66847D] hover:text-[#203C37]'
            }`}
          >
            Clinical
          </button>
        </div>

        {/* Action list */}
        <div className="mt-3.5 space-y-2">
          {current.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#EAF3ED]/30 border border-[#D2E4DA] text-xs text-[#203C37]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#368F83] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] text-[#203C37] font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-[#E8F1EC] text-[10px] text-[#66847D] flex items-center justify-between">
        <span>Calibrated to Pune Heat Action Plan (HAP)</span>
        <span className="font-semibold text-[#368F83]">Protocol Ready</span>
      </div>
    </div>
  );
};

export default AIRecommendations;
