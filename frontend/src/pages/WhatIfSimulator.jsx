import React, { useState, useEffect } from 'react';
import {
  Sliders,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Wind,
  CloudRain,
  Droplets,
  Users,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import apiService from '../services/api';
import RiskGauge from '../components/common/RiskGauge';
import { HazardBadge } from '../components/common/StatusBadge';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import toast from 'react-hot-toast';

export const WhatIfSimulator = () => {
  const baselineValues = {
    temperature: 32.8,
    humidity: 58,
    rainfall: 4.2,
    aqi: 145
  };

  const [temperature, setTemperature] = useState(38.5);
  const [humidity, setHumidity] = useState(65);
  const [rainfall, setRainfall] = useState(25.0);
  const [aqi, setAqi] = useState(210);

  const [loading, setLoading] = useState(false);
  const [simulationData, setSimulationData] = useState(null);

  const presets = [
    {
      name: 'Summer Heatwave (May)',
      desc: 'Intense thermal load across urban core',
      values: { temperature: 42.5, humidity: 35, rainfall: 0.0, aqi: 165 }
    },
    {
      name: 'Monsoon Cloudburst (July)',
      desc: 'Extreme precipitation surcharge & runoff',
      values: { temperature: 27.0, humidity: 92, rainfall: 140.0, aqi: 65 }
    },
    {
      name: 'Winter Smog Inversion (Jan)',
      desc: 'Severe particulate matter valley trap',
      values: { temperature: 22.0, humidity: 75, rainfall: 0.0, aqi: 310 }
    },
    {
      name: 'Compound Extreme (Heat + Humidity)',
      desc: 'Critical wet-bulb physiological threshold',
      values: { temperature: 39.0, humidity: 78, rainfall: 15.0, aqi: 190 }
    }
  ];

  const applyPreset = (preset) => {
    setTemperature(preset.values.temperature);
    setHumidity(preset.values.humidity);
    setRainfall(preset.values.rainfall);
    setAqi(preset.values.aqi);
    toast.success(`Loaded Scenario: ${preset.name}`);
  };

  const handleReset = () => {
    setTemperature(baselineValues.temperature);
    setHumidity(baselineValues.humidity);
    setRainfall(baselineValues.rainfall);
    setAqi(baselineValues.aqi);
    toast('Reset sliders to Pune historical baseline');
  };

  const executeSimulation = async () => {
    setLoading(true);
    try {
      const payload = {
        temperature: Number(temperature),
        humidity: Number(humidity),
        rainfall: Number(rainfall),
        aqi: Number(aqi)
      };
      const res = await apiService.simulateScenario(payload);
      setSimulationData(res.data);
    } catch {
      toast.error('Simulation calculation failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temperature, humidity, rainfall, aqi]);

  const bScores = simulationData?.baselineScores;
  const sScores = simulationData?.simulatedScores;
  const delta = simulationData?.delta;

  const chartData = bScores && sScores ? [
    { hazard: 'Heat', Baseline: bScores.heat.score, Simulated: sScores.heat.score },
    { hazard: 'Air Quality', Baseline: bScores.air.score, Simulated: sScores.air.score },
    { hazard: 'Flooding', Baseline: bScores.flood.score, Simulated: sScores.flood.score },
    { hazard: 'Vector', Baseline: bScores.vector.score, Simulated: sScores.vector.score },
    { hazard: 'Overall', Baseline: bScores.compositeScore, Simulated: sScores.compositeScore }
  ] : [];

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Simulator Workspace Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#EAF3ED] text-[#368F83]">
                <Sliders className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#203C37] tracking-tight">
                What-If Climate Risk Stress-Testing
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#66847D] mt-1.5 font-medium leading-relaxed">
              Stress-test climate scenarios and evaluate cascading demographic vulnerabilities across Pune.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#EAF3ED] border border-[#D2E4DA] px-3 py-1.5 rounded-xl text-xs text-[#203C37]">
            <Info className="w-4 h-4 text-[#368F83] flex-shrink-0" />
            <span className="font-semibold">Illustrative Stress-Test Modeling</span>
          </div>
        </div>

        {/* Pune Historical Presets */}
        <div className="mt-5 pt-4 border-t border-[#E8F1EC]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#66847D] block mb-2">
            Load Pune Extreme Presets:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(preset)}
                className="p-3 rounded-xl bg-[#EAF3ED]/40 hover:bg-[#EAF3ED] border border-[#D2E4DA] text-left transition-all text-xs space-y-0.5 group cursor-pointer"
              >
                <div className="font-bold text-[#203C37] group-hover:text-[#368F83] transition-colors">
                  {preset.name}
                </div>
                <p className="text-[11px] text-[#66847D] line-clamp-1">{preset.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Sliders on Left, Comparison on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8F1EC]">
            <div>
              <h3 className="text-sm font-bold text-[#203C37]">Simulation Variables</h3>
              <p className="text-[11px] text-[#66847D]">Adjust parameters to test resilience</p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-semibold text-[#66847D] hover:text-[#203C37] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Slider 1: Temperature */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#203C37] flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-600" />
                <span>Ambient Temp</span>
              </span>
              <span className="font-mono font-bold text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                {temperature}°C
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="48"
              step="0.5"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#368F83] cursor-pointer h-2 bg-[#E8F1EC] rounded-lg"
            />
          </div>

          {/* Slider 2: Relative Humidity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#203C37] flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <span>Relative Humidity</span>
              </span>
              <span className="font-mono font-bold text-sm text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-lg border border-cyan-200">
                {humidity}%
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="98"
              step="1"
              value={humidity}
              onChange={(e) => setHumidity(parseInt(e.target.value))}
              className="w-full accent-[#368F83] cursor-pointer h-2 bg-[#E8F1EC] rounded-lg"
            />
          </div>

          {/* Slider 3: Rainfall */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#203C37] flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-[#4B91C5]" />
                <span>Rainfall (24h)</span>
              </span>
              <span className="font-mono font-bold text-sm text-[#2c658f] bg-[#E4F1F3] px-2 py-0.5 rounded-lg border border-[#b8dae6]">
                {rainfall} mm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="220"
              step="1"
              value={rainfall}
              onChange={(e) => setRainfall(parseFloat(e.target.value))}
              className="w-full accent-[#368F83] cursor-pointer h-2 bg-[#E8F1EC] rounded-lg"
            />
          </div>

          {/* Slider 4: PM2.5 / AQI */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#203C37] flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-purple-600" />
                <span>PM2.5 / AQI</span>
              </span>
              <span className="font-mono font-bold text-sm text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                {aqi} AQI
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="450"
              step="5"
              value={aqi}
              onChange={(e) => setAqi(parseInt(e.target.value))}
              className="w-full accent-[#368F83] cursor-pointer h-2 bg-[#E8F1EC] rounded-lg"
            />
          </div>
        </div>

        {/* Comparison Panel (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Side-by-Side Gauges */}
          <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8F1EC] mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#203C37]">
                  Before & After Risk Index Comparison
                </h3>
                <p className="text-xs text-[#66847D]">Evaluating scenario divergence from present day</p>
              </div>
              {delta && delta.compositeDelta !== 0 && (
                <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md border ${
                  delta.compositeDelta > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {delta.compositeDelta > 0 ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                  {delta.compositeDelta > 0 ? `+${delta.compositeDelta}` : delta.compositeDelta} Delta
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Baseline */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#66847D] mb-2">
                  Baseline (Pune Present)
                </span>
                <RiskGauge score={bScores?.compositeScore || 50} size="sm" showLabel={true} />
              </div>

              {/* Simulated */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-[#EAF3ED] border border-[#368F83]/60">
                <span className="text-xs font-bold uppercase tracking-wider text-[#203C37] mb-2">
                  Simulated Scenario
                </span>
                <RiskGauge score={sScores?.compositeScore || 65} size="sm" showLabel={true} />
              </div>
            </div>
          </div>

          {/* Bar Chart: Hazard Shift */}
          <div className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#203C37] uppercase tracking-wider">
                Individual Hazard Score Deltas
              </h3>
              <span className="text-[11px] text-[#66847D]">Scale: 0 - 100</span>
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F1EC" />
                  <XAxis dataKey="hazard" tick={{ fontSize: 11, fill: '#66847D' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#66847D' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                  <Bar dataKey="Baseline" fill="#b5d1c5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#368F83" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerable Demographic Impacts */}
      <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#368F83]" />
          <div>
            <h3 className="text-base font-bold text-[#203C37]">
              Vulnerable Population Impacts Under Simulated Stress
            </h3>
            <p className="text-xs text-[#66847D]">Predicted demographic sensitivities under selected environmental thresholds</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {simulationData?.vulnerablePopulationImpacts?.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#203C37]">{item.group}</span>
                <HazardBadge level={item.impactLevel} />
              </div>
              <p className="text-[#66847D] text-[11px] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;
