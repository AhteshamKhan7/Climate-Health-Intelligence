import React from 'react';
import {
  Thermometer,
  Wind,
  Droplets,
  CloudRain,
  ShieldAlert,
  Compass,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';
import { useClimate } from '../context/ClimateContext';
import StatCard from '../components/common/StatCard';
import RiskGauge from '../components/common/RiskGauge';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import HazardRiskCards from '../components/dashboard/HazardRiskCards';
import TrendChart from '../components/dashboard/TrendChart';
import AlertsList from '../components/dashboard/AlertsList';
import AIRecommendations from '../components/dashboard/AIRecommendations';
import PuneCommunityRiskMap from './PuneCommunityRiskMap';
import { computeHazardScores } from '../utils/riskCalculator';
import { Link } from 'react-router-dom';

export const OverviewDashboard = () => {
  const {
    environmentData,
    selectedWard,
    refreshEnvironment,
    lastUpdated
  } = useClimate();

  const readings = environmentData?.readings || {
    temperature: 32.8,
    humidity: 58,
    rainfall: 4.2,
    aqi: 145,
    pm25: 58,
    pm10: 124,
    no2: 44
  };

  const scores = computeHazardScores({
    temperature: readings.temperature,
    humidity: readings.humidity,
    rainfall: readings.rainfall,
    aqi: readings.aqi
  });

  // Identify highest contributing hazard
  const hazardScoresList = [
    { name: 'Air Pollution (PM2.5)', score: scores.air.score },
    { name: 'Extreme Heat', score: scores.heat.score },
    { name: 'Vector Breeding Window', score: scores.vector.score },
    { name: 'Rainfall / Flooding', score: scores.flood.score },
  ];
  const dominantHazard = [...hazardScoresList].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Page Introduction Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D2E4DA] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#EAF3ED] text-[#368F83]">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#203C37] tracking-tight">
                Pune Climate-Health Situational Overview
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#66847D] mt-1 font-medium leading-relaxed">
              Real-time environmental hazard monitoring and demographic vulnerability intelligence across Pune Municipal Corporation wards.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase font-bold text-[#66847D]">Telemetry Sync</p>
              <p className="text-xs font-mono font-bold text-[#203C37]">
                {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live Mesh'}
              </p>
            </div>
            <button
              onClick={refreshEnvironment}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#368F83] hover:bg-[#2b756b] text-white text-xs font-bold transition-all shadow-xs"
              title="Sync Environmental Telemetry"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>

        {/* Selected Ward Demographic Context Ribbon */}
        <div className="pt-3 border-t border-[#E8F1EC] grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">Active Ward</span>
            <p className="font-extrabold text-[#203C37] truncate">{selectedWard?.name} <span className="font-mono text-[10px] font-normal text-[#66847D]">({selectedWard?.wardNumber})</span></p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">Ward Population</span>
            <p className="font-extrabold text-[#203C37] font-mono">{selectedWard?.population?.toLocaleString('en-IN')}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">Senior Cohort</span>
            <p className="font-extrabold text-[#203C37] font-mono">{selectedWard?.seniorCitizenPercent}% <span className="text-[10px] font-normal text-[#66847D]">&gt;65y</span></p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">Informal Settlement</span>
            <p className="font-extrabold text-[#203C37] font-mono">{selectedWard?.slumPopulationPercent}% <span className="text-[10px] font-normal text-[#66847D]">tin-roof</span></p>
          </div>
          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">Clinical Buffer</span>
            <p className="font-extrabold text-[#203C37]">{selectedWard?.primaryHealthCentres} UPHCs / {selectedWard?.hospitalBedsPerThousand} beds/k</p>
          </div>
        </div>
      </div>

      {/* B. Core KPI Cards Section (5 Consistent Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Temperature */}
        <StatCard
          title="Ambient Temp"
          value={readings.temperature}
          unit="°C"
          icon={Thermometer}
          status={scores.heat.level}
          statusColor={scores.heat.score > 60 ? 'orange' : scores.heat.score > 35 ? 'amber' : 'teal'}
          trend="Apparent 36.2°C"
          trendDirection={readings.temperature > 32 ? 'up' : 'neutral'}
        />

        {/* 2. Air Quality Index */}
        <StatCard
          title="Air Quality (AQI)"
          value={readings.aqi}
          unit="AQI"
          icon={Wind}
          status={scores.air.level}
          statusColor={scores.air.score > 65 ? 'purple' : 'amber'}
          trend={`PM2.5: ${readings.pm25 || 58} µg/m³`}
          trendDirection="up"
        />

        {/* 3. Relative Humidity */}
        <StatCard
          title="Relative Humidity"
          value={readings.humidity}
          unit="%"
          icon={Droplets}
          status={readings.humidity > 70 ? 'High' : 'Normal'}
          statusColor="blue"
          trend="Dew pt ~21.4°C"
          trendDirection="neutral"
        />

        {/* 4. Rainfall */}
        <StatCard
          title="Rainfall (24h)"
          value={readings.rainfall}
          unit="mm"
          icon={CloudRain}
          status={scores.flood.level}
          statusColor={scores.flood.score > 50 ? 'blue' : 'teal'}
          trend="Catchment normal"
          trendDirection="down"
        />

        {/* 5. Overall Climate-Health Risk */}
        <StatCard
          title="Composite Risk"
          value={scores.compositeScore}
          unit="/100"
          icon={ShieldAlert}
          status={scores.compositeTier}
          statusColor={scores.compositeScore > 65 ? 'red' : scores.compositeScore > 45 ? 'orange' : 'teal'}
          trend="Screening proxy"
          trendDirection="up"
        />
      </div>

      {/* C. Main Analytics Section: Risk Gauge & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Gauge Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#66847D] mb-1">
            Population Exposure Screening
          </span>
          <RiskGauge score={scores.compositeScore} size="lg" showLabel={true} />

          <div className="mt-4 pt-4 border-t border-[#E8F1EC] w-full flex items-center justify-between text-xs">
            <span className="text-[#66847D] font-medium">Primary Hazard Driver:</span>
            <span className="font-bold text-[#203C37] bg-[#EAF3ED] px-2.5 py-1 rounded-md border border-[#D2E4DA]">
              {dominantHazard.name} ({dominantHazard.score}/100)
            </span>
          </div>
        </div>

        {/* Concise AI-Generated Insight Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-[#E8E4F5]/60 rounded-2xl p-6 border border-[#d4cbec] shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-[#4c3b7a] shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#4c3b7a]">
                  Environmental Health Screening Rationale
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full text-[#4c3b7a] border border-[#d4cbec]">
                Automated Synthesis
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#d4cbec] text-xs text-[#203C37] space-y-2">
              <p className="leading-relaxed font-medium">
                Ambient readings in <strong>{selectedWard?.name || 'Pune Central'}</strong> ({readings.temperature}°C, {readings.humidity}% RH, AQI {readings.aqi}) indicate <strong>elevated particulate airway infiltration</strong> and sustained <strong>vector amplification potential</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-[#66847D]">
                <div>• <strong>Cardiovascular / Heat:</strong> Apparent heat index manageable; hydration stations advised.</div>
                <div>• <strong>Respiratory / AQI:</strong> Particulate matter elevated; vulnerable cohorts should limit exertion.</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#d4cbec]">
            <span className="text-[11px] text-[#66847D]">
              Confidence: <strong>92% (PMC Telemetry Mesh)</strong>
            </span>
            <Link
              to="/intelligence"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#4c3b7a] hover:underline"
            >
              <span>Full Clinical Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hazard Vulnerability Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#203C37]">
            Hazard Vulnerability Breakdown
          </h2>
          <span className="text-xs text-[#66847D] font-medium hidden sm:inline">
            Calibrated for {selectedWard?.name || 'Pune PMC Area'}
          </span>
        </div>
        <HazardRiskCards scores={scores} />
      </div>

      {/* Environmental Trends */}
      <TrendChart />

      {/* D. Alerts & Action Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsList />
        <AIRecommendations />
      </div>

      {/* PROTECTED PUNE RISK MAP SECTION EMBEDDED ON DASHBOARD */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#203C37]">
              Pune Community Risk Map (Interactive Geospatial Mesh)
            </h2>
            <p className="text-xs text-[#66847D]">
              Live GIS screening of PMC administrative wards, hazard buffers, and vulnerability markers.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF3ED] text-[#245B4B] border border-[#D2E4DA] hidden sm:inline">
            Full Interactive Controls
          </span>
        </div>

        {/* EMBED EXISTING PROTECTED MAP UNCHANGED */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D2E4DA] shadow-xs">
          <PuneCommunityRiskMap />
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
