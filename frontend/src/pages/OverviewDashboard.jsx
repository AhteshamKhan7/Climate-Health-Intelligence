
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
  ArrowRight
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

const getDisplayLevel = (classification) => {
  if (!classification || classification === 'Unavailable') {
    return 'Unavailable';
  }

  return classification;
};

export const OverviewDashboard = () => {
  const {
    environmentData,
    selectedWard,
    refreshDashboardData,
    refreshEnvironment,
    lastUpdated,
    assessmentData,
    isLiveFeed,
    isLiveAssessment,
    dataSourceLabel,
    assessmentSourceLabel,
    assessmentLoading
  } = useClimate();

  const readings = environmentData?.readings || {};

  // Offline/demo fallback calculation.
  const fallbackScores = computeHazardScores({
    temperature: readings.temperature,
    humidity: readings.humidity,
    rainfall: readings.rainfall,
    aqi: readings.aqi
  });

  // Actual backend assessment.
  const backendHazards = assessmentData?.hazards;
  const overallRisk = assessmentData?.overall_risk;

  // Use backend results only when a live backend assessment exists.
  const scores = isLiveAssessment && backendHazards
    ? {
      heat: {
        score: backendHazards.heat?.risk_score ?? null,
        level: getDisplayLevel(
          backendHazards.heat?.classification
        ),
        metric: backendHazards.heat?.hazard_score != null
          ? `Hazard intensity: ${backendHazards.heat.hazard_score}`
          : 'Heat data unavailable'
      },

      air: {
        score: backendHazards.air?.risk_score ?? null,
        level: getDisplayLevel(
          backendHazards.air?.classification
        ),
        metric: backendHazards.air?.hazard_score != null
          ? `Hazard intensity: ${backendHazards.air.hazard_score}`
          : 'Air data unavailable'
      },

      flood: {
        score: backendHazards.rain?.risk_score ?? null,
        level: getDisplayLevel(
          backendHazards.rain?.classification
        ),
        metric: backendHazards.rain?.hazard_score != null
          ? `Hazard intensity: ${backendHazards.rain.hazard_score}`
          : 'Rainfall data unavailable'
      },

      vector: {
        score: null,
        level: 'Not assessed',
        metric: 'Not assessed by backend'
      },

      compositeScore: overallRisk?.score ?? null,
      compositeTier: overallRisk?.classification ?? 'Unavailable'
    }
    : fallbackScores;

  const compositeScore = isLiveAssessment
    ? overallRisk?.score
    : fallbackScores.compositeScore;

  const hazardScoresList = isLiveAssessment
    ? [
      {
        name: 'Air Pollution',
        score: scores.air.score
      },
      {
        name: 'Extreme Heat',
        score: scores.heat.score
      },
      {
        name: 'Rainfall',
        score: scores.flood.score
      }
    ].filter(item => Number.isFinite(item.score))
    : [
      { name: 'Air Pollution (PM2.5)', score: scores.air.score },
      { name: 'Extreme Heat', score: scores.heat.score },
      { name: 'Vector Breeding Window', score: scores.vector.score },
      { name: 'Rainfall / Flooding', score: scores.flood.score }
    ];

  const dominantHazard = hazardScoresList.length
    ? [...hazardScoresList].sort((a, b) => b.score - a.score)[0]
    : null;

  const backendExplanation = assessmentData?.explanation;

  const explanationSummary = isLiveAssessment
    ? backendExplanation?.summary
    : 'The displayed risk indicators are generated using the local demonstration calculator because the live backend assessment is unavailable.';

  const contributingFactors = isLiveAssessment
    ? backendExplanation?.contributing_factors || []
    : [];

  const rainfallValue = readings.rainfall;

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Introduction */}
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
              Environmental hazard monitoring and demographic vulnerability screening across Pune Municipal Corporation wards.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase font-bold text-[#66847D]">
                Telemetry Sync
              </p>

              <p className="text-xs font-mono font-bold text-[#203C37]">
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                  : 'Waiting for data'}
              </p>
            </div>

            <button
              onClick={() => {
                if (refreshDashboardData) {
                  refreshDashboardData();
                } else {
                  refreshEnvironment();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#368F83] hover:bg-[#2b756b] text-white text-xs font-bold transition-all shadow-xs"
              title="Refresh environmental data and assessment"
              disabled={assessmentLoading}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>
                {assessmentLoading ? 'Syncing...' : 'Sync Telemetry'}
              </span>
            </button>
          </div>
        </div>

        {/* Ward context */}
        <div className="pt-3 border-t border-[#E8F1EC] grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">
              Active Ward
            </span>
            <p className="font-extrabold text-[#203C37] truncate">
              {selectedWard?.name}
              <span className="font-mono text-[10px] font-normal text-[#66847D]">
                {' '}({selectedWard?.wardNumber})
              </span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">
              Ward Population
            </span>
            <p className="font-extrabold text-[#203C37] font-mono">
              {selectedWard?.population?.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">
              Senior Cohort
            </span>
            <p className="font-extrabold text-[#203C37] font-mono">
              {selectedWard?.seniorCitizenPercent}%
              <span className="text-[10px] font-normal text-[#66847D]">
                {' '}&gt;65y
              </span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">
              Informal Settlement
            </span>
            <p className="font-extrabold text-[#203C37] font-mono">
              {selectedWard?.slumPopulationPercent}%
              <span className="text-[10px] font-normal text-[#66847D]">
                {' '}tin-roof
              </span>
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">
              Clinical Buffer
            </span>
            <p className="font-extrabold text-[#203C37]">
              {selectedWard?.primaryHealthCentres} UPHCs / {selectedWard?.hospitalBedsPerThousand} beds/k
            </p>
          </div>
        </div>
      </div>

      {/* Data source indicators */}
      <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
        <span className={`px-3 py-1 rounded-full border ${isLiveFeed
            ? 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]'
            : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
          Environment: {dataSourceLabel}
        </span>

        <span className={`px-3 py-1 rounded-full border ${isLiveAssessment
            ? 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]'
            : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
          Risk: {assessmentSourceLabel}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Ambient Temp"
          value={readings.temperature ?? '—'}
          unit="°C"
          icon={Thermometer}
          status={scores.heat.level}
          statusColor="orange"
          trend={
            readings.apparentTemperature != null
              ? `Feels like ${readings.apparentTemperature}°C`
              : 'Live temperature'
          }
          trendDirection="neutral"
        />

        <StatCard
          title="Air Quality (AQI)"
          value={readings.aqi ?? '—'}
          unit="AQI"
          icon={Wind}
          status={scores.air.level}
          statusColor="purple"
          trend={
            readings.pm25 != null
              ? `PM2.5: ${readings.pm25} µg/m³`
              : 'Particulate data'
          }
          trendDirection="neutral"
        />

        <StatCard
          title="Relative Humidity"
          value={readings.humidity ?? '—'}
          unit="%"
          icon={Droplets}
          status={
            readings.humidity == null
              ? 'Unavailable'
              : readings.humidity > 70
                ? 'High'
                : 'Normal'
          }
          statusColor="blue"
          trend="Current reading"
          trendDirection="neutral"
        />

        <StatCard
          title="Current Precipitation"
          value={rainfallValue ?? '—'}
          unit="mm"
          icon={CloudRain}
          status={scores.flood.level}
          statusColor="blue"
          trend="Current weather reading"
          trendDirection="neutral"
        />

        <StatCard
          title="Composite Risk"
          value={compositeScore ?? '—'}
          unit="/100"
          icon={ShieldAlert}
          status={
            isLiveAssessment
              ? overallRisk?.classification || 'Unavailable'
              : fallbackScores.compositeTier
          }
          statusColor="red"
          trend={
            isLiveAssessment
              ? 'Backend screening'
              : 'Demo screening'
          }
          trendDirection="neutral"
        />
      </div>

      {/* Risk Gauge and Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#66847D] mb-1">
            Population Exposure Screening
          </span>

          <RiskGauge
            score={compositeScore ?? 0}
            size="lg"
            showLabel={true}
          />

          <div className="mt-4 pt-4 border-t border-[#E8F1EC] w-full flex items-center justify-between text-xs">
            <span className="text-[#66847D] font-medium">
              Primary Hazard Driver:
            </span>

            <span className="font-bold text-[#203C37] bg-[#EAF3ED] px-2.5 py-1 rounded-md border border-[#D2E4DA]">
              {dominantHazard
                ? `${dominantHazard.name} (${dominantHazard.score}/100)`
                : 'Unavailable'}
            </span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#E8E4F5]/60 rounded-2xl p-6 border border-[#d4cbec] shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-[#4c3b7a] shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>

                <h3 className="text-sm font-bold text-[#4c3b7a]">
                  Backend Climate-Health Screening Rationale
                </h3>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-full text-[#4c3b7a] border border-[#d4cbec]">
                {isLiveAssessment ? 'Backend Assessment' : 'Demo Mode'}
              </span>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#d4cbec] text-xs text-[#203C37] space-y-3">
              <p className="leading-relaxed font-medium">
                {explanationSummary}
              </p>

              {contributingFactors.length > 0 && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <p className="font-bold text-[#4c3b7a]">
                    Assessment evidence
                  </p>

                  {contributingFactors.slice(0, 4).map((factor, index) => (
                    <p
                      key={index}
                      className="text-[11px] text-[#66847D]"
                    >
                      • {factor}
                    </p>
                  ))}
                </div>
              )}

              {!isLiveAssessment && (
                <p className="text-[11px] text-amber-700 border-t border-slate-100 pt-2">
                  This is a local demonstration calculation, not a live backend assessment.
                </p>
              )}

              {assessmentData?.disease_suitability?.status === 'not_assessed' && (
                <p className="text-[11px] text-[#66847D] border-t border-slate-100 pt-2">
                  Disease-specific suitability has not been assessed because verified surveillance indicators are not integrated.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#d4cbec]">
            <span className="text-[11px] text-[#66847D]">
              Method: {backendExplanation?.method || 'Local demonstration calculator'}
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

      {/* Hazard Breakdown */}
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

      {/* Trends */}
      <TrendChart />

      {/* Alerts and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsList />
        <AIRecommendations />
      </div>

      {/* Pune Map */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#203C37]">
              Pune Community Risk Map (Interactive Geospatial Mesh)
            </h2>

            <p className="text-xs text-[#66847D]">
              Geographic screening of PMC administrative wards and environmental vulnerability indicators.
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#EAF3ED] text-[#245B4B] border border-[#D2E4DA] hidden sm:inline">
            Full Interactive Controls
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D2E4DA] shadow-xs">
          <PuneCommunityRiskMap />
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
