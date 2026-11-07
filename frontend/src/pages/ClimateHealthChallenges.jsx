import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SunMedium,
  Wind,
  CloudRain,
  Activity,
  AlertTriangle,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Download,
  Table
} from 'lucide-react';
import { CLIMATE_HAZARDS } from '../data/hazardsData';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import toast from 'react-hot-toast';

export const ClimateHealthChallenges = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialHazard = searchParams.get('hazard') || 'extreme-heat';
  const [selectedHazardId, setSelectedHazardId] = useState(initialHazard);

  useEffect(() => {
    const q = searchParams.get('hazard');
    if (q && CLIMATE_HAZARDS.some(h => h.id === q)) {
      setSelectedHazardId(q);
    }
  }, [searchParams]);

  const currentHazard = CLIMATE_HAZARDS.find(h => h.id === selectedHazardId) || CLIMATE_HAZARDS[0];

  const handleSelectHazard = (id) => {
    setSelectedHazardId(id);
    setSearchParams({ hazard: id });
  };

  const getHazardIcon = (id) => {
    switch (id) {
      case 'extreme-heat': return SunMedium;
      case 'air-pollution': return Wind;
      case 'heavy-rainfall': return CloudRain;
      default: return Activity;
    }
  };

  const CurrentIcon = getHazardIcon(currentHazard.id);

  // Cross-Hazard Comparison Matrix Data
  const matrixData = [
    {
      id: 'extreme-heat',
      name: 'Extreme Heat',
      threshold: 'Temp ≥ 39.5°C or Heat Index > 42°C',
      season: 'April – June',
      primaryImpact: 'Diaphoresis, heat stroke & renal hypoperfusion',
      vulnerableCohort: 'Outdoor laborers & seniors (>65y)',
      pmcProtocol: 'Cool-shelter deployment & construction halt'
    },
    {
      id: 'air-pollution',
      name: 'Air Pollution (PM2.5)',
      threshold: 'AQI > 180 or PM2.5 > 60 µg/m³',
      season: 'Nov – Feb (Inversion)',
      primaryImpact: 'Alveolar inflammation & asthma/COPD attacks',
      vulnerableCohort: 'Children (<5y) & chronic respiratory',
      pmcProtocol: 'Road misting & school morning sports pause'
    },
    {
      id: 'heavy-rainfall',
      name: 'Heavy Rainfall / Flood',
      threshold: 'Rainfall > 64.5 mm/24h or Dam > 25k cusecs',
      season: 'July – Sept (Monsoon)',
      primaryImpact: 'Waterborne gastroenteritis & leptospirosis',
      vulnerableCohort: 'Riverbank wadas & low-lying settlements',
      pmcProtocol: 'Dewatering pumps & drinking water chlorination'
    },
    {
      id: 'climate-sensitive-diseases',
      name: 'Disease Suitability',
      threshold: 'Temp 26-32°C + Humidity > 65%',
      season: 'August – Oct',
      primaryImpact: 'Dengue shock syndrome & Chikungunya arthralgia',
      vulnerableCohort: 'Dense residential & school children',
      pmcProtocol: 'Anti-larval bio-spraying & Sunday dry days'
    }
  ];

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#EAF3ED] text-[#368F83]">
                <CurrentIcon className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#203C37] tracking-tight">
                Climate Health Challenges
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#52756d] mt-1.5 font-medium leading-relaxed">
              Epidemiological profiles and clinical impact thresholds for Pune's four primary environmental hazards.
            </p>
          </div>

          <button
            onClick={() => toast.success(`Exporting ${currentHazard.shortName} PMC Health Action Protocol`)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#D2E4DA] hover:bg-[#EAF3ED] text-[#203C37] text-xs font-bold transition-all shadow-xs self-start sm:self-center"
          >
            <Download className="w-3.5 h-3.5 text-[#368F83]" />
            <span>Export Protocol</span>
          </button>
        </div>

        {/* 4 Interactive Hazard Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {CLIMATE_HAZARDS.map((hazard) => {
            const Icon = getHazardIcon(hazard.id);
            const isSelected = hazard.id === selectedHazardId;
            return (
              <button
                key={hazard.id}
                onClick={() => handleSelectHazard(hazard.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#EAF3ED] border-[#368F83] ring-2 ring-[#368F83]/40 shadow-xs'
                    : 'bg-white border-[#D2E4DA] hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#368F83] text-white' : 'bg-[#EAF3ED] text-[#368F83]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isSelected ? 'text-[#203C37]' : 'text-slate-700'}`}>
                    {hazard.shortName}
                  </h4>
                  <p className="text-[10px] text-[#52756d] line-clamp-1 mt-0.5">
                    {hazard.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Hazard Visual Showcase */}
      <div className="bg-white rounded-2xl border border-[#D2E4DA] shadow-xs overflow-hidden">
        {/* Top Feature Strip */}
        <div className="p-6 bg-[#EAF3ED]/60 border-b border-[#D2E4DA]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#368F83] bg-white px-2.5 py-0.5 rounded-md border border-[#D2E4DA]">
                Hazard Analysis
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#203C37] mt-1.5">
                {currentHazard.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#52756d]">Peak Season:</span>
              <span className="font-bold text-[#203C37] bg-white px-2.5 py-1 rounded-lg border border-[#D2E4DA]">
                {currentHazard.environmentalConditions.seasonalWindow.split(';')[0]}
              </span>
            </div>
          </div>

          {/* Pune Localized Context Banner */}
          <div className="mt-4 p-3.5 rounded-xl bg-white border border-[#D2E4DA] text-xs text-[#203C37] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#EAF3ED] text-[#368F83]">📍</span>
              <div>
                <strong className="text-[#203C37] font-bold">Pune Local Microclimate Impact: </strong>
                <span className="text-[#52756d]">High-density urban cores face amplified micro-climatic exposure compared to outer hills.</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-[#EAF3ED] text-[#245B4B] font-bold text-[11px] border border-[#D2E4DA]">
                PMC Priority Mesh
              </span>
            </div>
          </div>
        </div>

        {/* Visual Analytics Grid (4 Quadrants) */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Critical Thresholds & Surveillance */}
          <div className="p-5 rounded-2xl bg-[#EAF3ED]/30 border border-[#D2E4DA] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-[#203C37]">
                  Critical Meteorological Triggers
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#368F83] bg-white px-2 py-0.5 rounded border border-[#D2E4DA]">
                Surveillance
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {currentHazard.climateHazard.keyMetrics.map((km, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#D2E4DA] space-y-0.5 shadow-2xs">
                  <span className="text-[10px] font-bold text-[#52756d] block truncate">{km.label}</span>
                  <span className="text-sm font-extrabold text-[#203C37] font-mono">{km.value}</span>
                </div>
              ))}
            </div>

            {/* Severity Tiers */}
            <div className="space-y-1.5 pt-2 border-t border-[#D2E4DA]/60">
              {currentHazard.climateHazard.severityLevels.map((sev, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#D2E4DA] text-xs flex items-center justify-between">
                  <span className="font-bold text-[#203C37] text-[11px]">{sev.level}</span>
                  <span className="text-[11px] font-mono font-medium text-[#52756d]">{sev.condition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Potential Health Impacts */}
          <div className="p-5 rounded-2xl bg-[#E8E4F5]/30 border border-[#d4cbec] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4c3b7a]" />
                  <h3 className="font-bold text-sm text-[#4c3b7a]">
                    Clinical & Epidemiological Impacts
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4c3b7a] bg-white px-2 py-0.5 rounded border border-[#d4cbec]">
                  Clinical Triage
                </span>
              </div>

              {/* Acute & Chronic Indicator Cards */}
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#d4cbec] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#4c3b7a] text-[11px]">Acute Pathological Strain:</strong>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">Direct Alert</span>
                  </div>
                  <p className="text-[#52756d] text-[11px] leading-relaxed">
                    {currentHazard.potentialHealthImpact.acuteEffects[0].split(',')[0]} and acute physiological decompensation.
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#d4cbec] space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-[#4c3b7a] text-[11px]">Chronic Co-Morbidity Aggravation:</strong>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">High Risk</span>
                  </div>
                  <p className="text-[#52756d] text-[11px] leading-relaxed">
                    {currentHazard.potentialHealthImpact.chronicExacerbations[0].split(',')[0]} under sustained exposure.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#d4cbec] flex items-center justify-between text-xs">
              <span className="text-[#52756d] font-semibold text-[11px]">Emergency Admission Impact:</span>
              <span className="font-bold text-[#4c3b7a] bg-[#E8E4F5] px-2.5 py-1 rounded-lg">
                {currentHazard.potentialHealthImpact.estimatedHospitalizationImpact.split('surge')[0]} surge
              </span>
            </div>
          </div>

          {/* Card 3: Vulnerable Demographic Cohorts */}
          <div className="p-5 rounded-2xl bg-[#E4F1F3]/40 border border-[#b8dae6] space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4B91C5]" />
              <h3 className="font-bold text-sm text-[#203C37]">
                Disproportionate Vulnerability
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {currentHazard.affectedPopulation.primaryGroups.map((grp, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#b8dae6] space-y-1">
                  <span className="font-bold text-[#203C37] block text-[11px]">{grp.group}</span>
                  <p className="text-[10px] text-[#66847D] line-clamp-2 leading-relaxed">{grp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Action Protocols (Concise Checklist) */}
          <div className="p-5 rounded-2xl bg-[#EAF3ED]/40 border border-[#D2E4DA] space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#368F83]" />
              <h3 className="font-bold text-sm text-[#203C37]">
                Actionable Preventive Protocols
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-[#D2E4DA] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#368F83] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#203C37] block text-[11px]">Municipal Response:</strong>
                  <p className="text-[10px] text-[#66847D]">{currentHazard.preventiveRecommendations.publicHealthAuthorities[0]}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#D2E4DA] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#368F83] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#203C37] block text-[11px]">Citizen Guidance:</strong>
                  <p className="text-[10px] text-[#66847D]">{currentHazard.preventiveRecommendations.citizensAndCommunities[0]}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#D2E4DA] flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#368F83] mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-[#203C37] block text-[11px]">Clinical Preparedness:</strong>
                  <p className="text-[10px] text-[#66847D]">{currentHazard.preventiveRecommendations.hospitalsAndClinics[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Pune Hazard Matrix */}
        <div className="p-6 pt-2 border-t border-[#D2E4DA]">
          <div className="flex items-center gap-2 mb-3">
            <Table className="w-4 h-4 text-[#368F83]" />
            <h3 className="font-bold text-sm text-[#203C37]">
              Pune Climate-Health Cross-Hazard Matrix
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#EAF3ED]/60 text-[#66847D] font-bold border-y border-[#D2E4DA] text-[10px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Hazard</th>
                  <th className="py-2.5 px-3">Trigger Threshold</th>
                  <th className="py-2.5 px-3">Peak Season</th>
                  <th className="py-2.5 px-3">Primary Clinical Impact</th>
                  <th className="py-2.5 px-3">High-Risk Cohort</th>
                  <th className="py-2.5 px-3">PMC Action Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8F1EC]">
                {matrixData.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleSelectHazard(row.id)}
                    className={`cursor-pointer transition-colors ${
                      row.id === selectedHazardId ? 'bg-[#EAF3ED] font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-[#203C37]">{row.name}</td>
                    <td className="py-2.5 px-3 text-[#66847D] font-mono text-[11px]">{row.threshold}</td>
                    <td className="py-2.5 px-3 text-[#203C37]">{row.season}</td>
                    <td className="py-2.5 px-3 text-[#66847D]">{row.primaryImpact}</td>
                    <td className="py-2.5 px-3 text-[#203C37]">{row.vulnerableCohort}</td>
                    <td className="py-2.5 px-3 text-[#368F83] font-semibold">{row.pmcProtocol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Navigation Strip */}
        <div className="bg-[#EAF3ED]/40 p-4 border-t border-[#D2E4DA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#66847D]">
            Evaluate this hazard across Pune wards on the interactive map:
          </span>
          <div className="flex items-center gap-2">
            <Link
              to="/map"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#368F83] hover:bg-[#2b756b] text-white font-bold transition-all shadow-xs"
            >
              <span>View Pune Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/simulator"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#D2E4DA] hover:bg-[#EAF3ED] text-[#203C37] font-semibold transition-all"
            >
              <span>Simulate Scenario</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateHealthChallenges;
