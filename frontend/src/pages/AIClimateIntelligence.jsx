import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Brain,
  Sparkles,
  Thermometer,
  Wind,
  CloudRain,
  Activity,
  Building,
  UserCheck,
  Hospital,
  Compass,
  Sliders
} from 'lucide-react';
import { useClimate } from '../context/ClimateContext';
import apiService from '../services/api';
import RiskGauge from '../components/common/RiskGauge';
import { HazardBadge } from '../components/common/StatusBadge';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import toast from 'react-hot-toast';

export const AIClimateIntelligence = () => {
  const [searchParams] = useSearchParams();
  const { selectedWard, selectWardById, wardsList, isBackendOnline } = useClimate();

  const [wardId, setWardId] = useState(searchParams.get('ward') || selectedWard?.id || 'shivajinagar');
  const [temperature, setTemperature] = useState(selectedWard?.baseline?.temperature || 32.8);
  const [humidity, setHumidity] = useState(selectedWard?.baseline?.humidity || 58);
  const [rainfall, setRainfall] = useState(selectedWard?.baseline?.rainfall || 4.2);
  const [aqi, setAqi] = useState(selectedWard?.baseline?.aqi || 145);

  const [loading, setLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // Quick Presets
  const aiPresets = [
    { label: 'Baseline Shivajinagar', temp: 32.8, hum: 58, rain: 4.2, aqiVal: 145 },
    { label: 'May Heatwave Peak', temp: 42.5, hum: 35, rain: 0.0, aqiVal: 165 },
    { label: 'Winter Smog Inversion', temp: 22.0, hum: 75, rain: 0.0, aqiVal: 310 },
    { label: 'Monsoon Downpour', temp: 27.0, hum: 92, rain: 85.0, aqiVal: 65 }
  ];

  const applyPreset = (preset) => {
    setTemperature(preset.temp);
    setHumidity(preset.hum);
    setRainfall(preset.rain);
    setAqi(preset.aqiVal);
    toast.success(`Loaded Preset: ${preset.label}`);
  };

  useEffect(() => {
    const qWard = searchParams.get('ward');
    if (qWard && qWard !== wardId) {
      setWardId(qWard);
      const found = wardsList.find(w => w.id === qWard);
      if (found) {
        setTemperature(found.baseline.temperature);
        setHumidity(found.baseline.humidity);
        setRainfall(found.baseline.rainfall);
        setAqi(found.baseline.aqi);
      }
    }
  }, [searchParams, wardsList, wardId]);

  const handleWardChange = (newWardId) => {
    setWardId(newWardId);
    selectWardById(newWardId);
    const found = wardsList.find(w => w.id === newWardId);
    if (found) {
      setTemperature(found.baseline.temperature);
      setHumidity(found.baseline.humidity);
      setRainfall(found.baseline.rainfall);
      setAqi(found.baseline.aqi);
    }
  };

  const runAssessment = async () => {
    setLoading(true);
    try {
      const payload = {
        wardId,
        temperature: Number(temperature),
        humidity: Number(humidity),
        rainfall: Number(rainfall),
        aqi: Number(aqi)
      };

      const res = await apiService.assessRisk(payload);
      setAssessmentResult(res.data);
      toast.success(
        res.isLive
          ? 'Live AI Risk Assessment Generated'
          : 'Assessment Synthesized via Calibrated Local Model'
      );
    } catch {
      toast.error('Failed to run assessment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wardId]);

  const scores = assessmentResult?.scores;

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Workspace Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#E8E4F5] text-[#4c3b7a]">
                <Brain className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#203C37] tracking-tight">
                AI Climate-Health Intelligence Workspace
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#66847D] mt-1.5 font-medium leading-relaxed">
              Synthesizing environmental telemetry, thermal stress formulas, and vector replication velocity for Pune wards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isBackendOnline ? 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]' : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {isBackendOnline ? 'Live AI Telemetry Engine' : 'Calibrated Baseline Engine'}
            </span>
          </div>
        </div>

        {/* Quick Presets Strip */}
        <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D]">Quick Presets:</span>
          {aiPresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 rounded-lg bg-[#EAF3ED] hover:bg-[#368F83] text-[#203C37] hover:text-white font-semibold transition-all border border-[#D2E4DA] text-[11px]"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Parameters Control Bar */}
        <div className="pt-3 border-t border-[#E8F1EC] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Ward Select */}
          <div className="space-y-1">
            <label className="font-bold text-[#203C37] block">Target Ward</label>
            <select
              value={wardId}
              onChange={(e) => handleWardChange(e.target.value)}
              className="w-full bg-[#EAF3ED] border border-[#D2E4DA] rounded-xl px-3 py-2 font-semibold text-[#203C37] focus:outline-none cursor-pointer"
            >
              {wardsList.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div className="space-y-1">
            <label className="font-bold text-[#203C37] block">Temp (°C)</label>
            <input
              type="number"
              step="0.5"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full bg-[#EAF3ED] border border-[#D2E4DA] rounded-xl px-3 py-2 font-semibold text-[#203C37] focus:outline-none"
            />
          </div>

          {/* Humidity */}
          <div className="space-y-1">
            <label className="font-bold text-[#203C37] block">Humidity (%)</label>
            <input
              type="number"
              step="1"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full bg-[#EAF3ED] border border-[#D2E4DA] rounded-xl px-3 py-2 font-semibold text-[#203C37] focus:outline-none"
            />
          </div>

          {/* Rainfall */}
          <div className="space-y-1">
            <label className="font-bold text-[#203C37] block">Rainfall (mm)</label>
            <input
              type="number"
              step="0.5"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              className="w-full bg-[#EAF3ED] border border-[#D2E4DA] rounded-xl px-3 py-2 font-semibold text-[#203C37] focus:outline-none"
            />
          </div>

          {/* AQI */}
          <div className="space-y-1">
            <label className="font-bold text-[#203C37] block">AQI (Index)</label>
            <input
              type="number"
              step="5"
              value={aqi}
              onChange={(e) => setAqi(e.target.value)}
              className="w-full bg-[#EAF3ED] border border-[#D2E4DA] rounded-xl px-3 py-2 font-semibold text-[#203C37] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={runAssessment}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#245B4B] hover:bg-[#1d4b3e] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Evaluating Exposure...' : 'Run Dynamic Risk Audit'}</span>
          </button>
        </div>
      </div>

      {scores && (
        <div className="space-y-6">
          {/* Main Visual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Overall Risk Score Gauge (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#66847D] mb-1">
                Composite Risk Index
              </span>
              <RiskGauge score={scores.compositeScore} size="lg" showLabel={true} />

              <div className="mt-4 pt-4 border-t border-[#E8F1EC] w-full space-y-1.5 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-[#66847D]">Target Ward:</span>
                  <span className="font-bold text-[#203C37]">{selectedWard?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66847D]">Assessment ID:</span>
                  <span className="font-mono text-[#203C37] font-semibold">{assessmentResult?.assessmentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#66847D]">Data Confidence:</span>
                  <span className="font-bold text-[#368F83]">{assessmentResult?.confidenceMetrics?.dataQualityScore}%</span>
                </div>
              </div>
            </div>

            {/* Right: 4 Hazard Breakdown Indicators (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Heat */}
              <div className="p-4.5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <span>Extreme Heat Stress</span>
                  </div>
                  <HazardBadge level={scores.heat.level} score={scores.heat.score} />
                </div>
                <div className="text-xl font-extrabold text-[#203C37] font-mono">
                  {scores.heat.apparentTemp}°C <span className="text-xs font-semibold text-[#66847D]">Heat Index</span>
                </div>
                <p className="text-[11px] text-[#66847D] leading-relaxed">
                  Evaluates acute diaphoresis, hypovolemia, and geriatric cardiovascular strain.
                </p>
              </div>

              {/* Air */}
              <div className="p-4.5 rounded-2xl bg-white border border-purple-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-800 font-bold text-xs">
                    <Wind className="w-4 h-4 text-purple-600" />
                    <span>Air Quality (PM2.5)</span>
                  </div>
                  <HazardBadge level={scores.air.level} score={scores.air.score} />
                </div>
                <div className="text-xl font-extrabold text-[#203C37] font-mono">
                  AQI {aqi} <span className="text-xs font-semibold text-[#66847D]">CPCB Scale</span>
                </div>
                <p className="text-[11px] text-[#66847D] leading-relaxed">
                  Evaluates deep alveolar particulate penetration and acute bronchospasm risks.
                </p>
              </div>

              {/* Flood */}
              <div className="p-4.5 rounded-2xl bg-white border border-blue-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#2c658f] font-bold text-xs">
                    <CloudRain className="w-4 h-4 text-[#4B91C5]" />
                    <span>Rainfall & Flood Risk</span>
                  </div>
                  <HazardBadge level={scores.flood.level} score={scores.flood.score} />
                </div>
                <div className="text-xl font-extrabold text-[#203C37] font-mono">
                  {rainfall} mm <span className="text-xs font-semibold text-[#66847D]">24h Cumulative</span>
                </div>
                <p className="text-[11px] text-[#66847D] leading-relaxed">
                  Stormwater canal surcharge and low-lying nalla overflow along Mula-Mutha basin.
                </p>
              </div>

              {/* Vector */}
              <div className="p-4.5 rounded-2xl bg-white border border-[#D2E4DA] shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#245B4B] font-bold text-xs">
                    <Activity className="w-4 h-4 text-[#368F83]" />
                    <span>Vector Suitability</span>
                  </div>
                  <HazardBadge level={scores.vector.level} score={scores.vector.score} />
                </div>
                <div className="text-xl font-extrabold text-[#203C37] font-mono">
                  {scores.vector.score}% <span className="text-xs font-semibold text-[#66847D]">Multiplication Index</span>
                </div>
                <p className="text-[11px] text-[#66847D] leading-relaxed">
                  Aedes mosquito replication window; dengue incubation compression to 7-9 days.
                </p>
              </div>
            </div>
          </div>

          {/* Demographic Profile Strip */}
          <div className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#203C37]">
              Demographic & Healthcare Resilience Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#EAF3ED] border border-[#D2E4DA]">
                <span className="text-[10px] text-[#66847D] block font-semibold">Slum Settlements</span>
                <span className="text-base font-extrabold text-[#203C37] font-mono">{selectedWard?.slumPopulationPercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EAF3ED] border border-[#D2E4DA]">
                <span className="text-[10px] text-[#66847D] block font-semibold">Seniors (&gt;65 yrs)</span>
                <span className="text-base font-extrabold text-[#203C37] font-mono">{selectedWard?.seniorCitizenPercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EAF3ED] border border-[#D2E4DA]">
                <span className="text-[10px] text-[#66847D] block font-semibold">Children (&lt;5 yrs)</span>
                <span className="text-base font-extrabold text-[#203C37] font-mono">{selectedWard?.underFivePercent}%</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EAF3ED] border border-[#D2E4DA]">
                <span className="text-[10px] text-[#66847D] block font-semibold">Hospital Bed Buffer</span>
                <span className="text-base font-extrabold text-[#203C37] font-mono">{selectedWard?.hospitalBedsPerThousand}/k</span>
              </div>
            </div>
          </div>

          {/* Short AI Clinical Rationales */}
          <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#368F83]" />
              <h3 className="text-sm font-bold text-[#203C37]">
                AI Clinical Rationales (Concise Diagnostics)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessmentResult?.explanations?.map((exp, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#203C37]">{exp.category}</span>
                    <HazardBadge level={exp.severity} />
                  </div>
                  <p className="text-[#66847D] text-[11px] leading-relaxed font-medium">
                    {exp.summary}
                  </p>
                  <div className="pt-1.5 border-t border-[#D2E4DA]/60 text-[11px] text-[#203C37]">
                    <strong>Pathology:</strong> {exp.clinicalRationale}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Targeted Action Protocols */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-[#D2E4DA] shadow-xs text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#203C37] pb-2 border-b border-[#E8F1EC]">
                <Building className="w-4 h-4 text-[#368F83]" />
                <span>Public Health Authorities</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#66847D]">
                {assessmentResult?.recommendations?.municipalHealthDept?.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#368F83] font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#D2E4DA] shadow-xs text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#203C37] pb-2 border-b border-[#E8F1EC]">
                <UserCheck className="w-4 h-4 text-[#368F83]" />
                <span>Citizens & High-Risk</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#66847D]">
                {assessmentResult?.recommendations?.citizens?.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#368F83] font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-[#D2E4DA] shadow-xs text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#203C37] pb-2 border-b border-[#E8F1EC]">
                <Hospital className="w-4 h-4 text-[#368F83]" />
                <span>Clinical Centers</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-[#66847D]">
                {assessmentResult?.recommendations?.healthcareClinics?.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#368F83] font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIClimateIntelligence;
