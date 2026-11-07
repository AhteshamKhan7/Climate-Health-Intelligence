import React, { useState } from 'react';
import {
  Users,
  Shield,
  Building,
  HeartPulse,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
  Award,
  Compass,
  ArrowRight,
  Search
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { PUNE_WARDS, getRiskTier } from '../data/puneWards';
import DisclaimerBanner from '../components/common/DisclaimerBanner';
import { Link } from 'react-router-dom';

export const CommunityInsights = () => {
  const [selectedSort, setSelectedSort] = useState('overall'); // 'overall' | 'slum' | 'seniors'
  const [searchQuery, setSearchQuery] = useState('');

  const sortedWards = [...PUNE_WARDS]
    .filter(w =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.zone.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (selectedSort === 'slum') return b.slumPopulationPercent - a.slumPopulationPercent;
      if (selectedSort === 'seniors') return b.seniorCitizenPercent - a.seniorCitizenPercent;
      return b.riskProfile.overallScore - a.riskProfile.overallScore;
    });

  const wardBarData = sortedWards.map(w => ({
    name: w.name.split(' ')[0],
    fullName: w.name,
    overallScore: w.riskProfile.overallScore,
    heat: w.riskProfile.heatScore,
    air: w.riskProfile.airQualityScore,
    flood: w.riskProfile.floodScore
  }));

  const vulnerabilityDonutData = [
    { name: 'Slum Settlements', value: 34, color: '#f97316' },
    { name: 'Seniors (>65 yrs)', value: 26, color: '#eab308' },
    { name: 'Pediatric (<5 yrs)', value: 18, color: '#4B91C5' },
    { name: 'Outdoor Workers', value: 22, color: '#368F83' }
  ];

  const preparednessMetrics = [
    { label: 'Cooling Kiosk Operational Readiness', value: '78%', note: '120+ PMC shelters equipped' },
    { label: 'Stormwater Dewatering Pump Stock', value: '88%', note: 'Deployed at Ambil Odha / Mula' },
    { label: 'Emergency Hospital Bed Buffer', value: '14.2%', note: 'Sassoon & PMC secondary surge reserve' },
    { label: 'Primary UPHC ORS Supply Index', value: '94%', note: 'Adequate stock across 15 zones' }
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
                <Users className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#203C37] tracking-tight">
                Community Vulnerability & Impact Insights
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#66847D] mt-1.5 font-medium leading-relaxed">
              Evaluating disproportionate climate hazard burdens and municipal resilience indicators across Pune.
            </p>
          </div>

          <div className="bg-[#EAF3ED] border border-[#D2E4DA] px-3.5 py-1.5 rounded-xl text-[#203C37] text-xs font-semibold self-start sm:self-center">
            Distinguishing Measured Baseline from Modeled Projections
          </div>
        </div>
      </div>

      {/* 5 Vulnerable Cohorts KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4.5 border border-[#D2E4DA] shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-[#203C37]">Senior Citizens (&gt;65)</span>
          <div className="text-2xl font-extrabold text-[#203C37] font-mono">14.2% <span className="text-xs font-medium text-[#66847D]">PMC</span></div>
          <p className="text-[11px] text-[#66847D]">Blunted thirst response & cardiovascular strain.</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-[#D2E4DA] shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-[#203C37]">Informal Laborers</span>
          <div className="text-2xl font-extrabold text-[#203C37] font-mono">~140k <span className="text-xs font-medium text-[#66847D]">Cohort</span></div>
          <p className="text-[11px] text-[#66847D]">Continuous outdoor solar exposure without shaded rest.</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-[#D2E4DA] shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-[#203C37]">Slum Settlements</span>
          <div className="text-2xl font-extrabold text-[#203C37] font-mono">22.4% <span className="text-xs font-medium text-[#66847D]">Mean</span></div>
          <p className="text-[11px] text-[#66847D]">Tin-roof heat traps and low-lying nalla runoff.</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-[#D2E4DA] shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-[#203C37]">Children (&lt;5 yrs)</span>
          <div className="text-2xl font-extrabold text-[#203C37] font-mono">7.8% <span className="text-xs font-medium text-[#66847D]">PMC</span></div>
          <p className="text-[11px] text-[#66847D]">High respiratory rate & rapid dehydration susceptibility.</p>
        </div>

        <div className="bg-white rounded-2xl p-4.5 border border-[#D2E4DA] shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-[#203C37]">Chronic Respiratory</span>
          <div className="text-2xl font-extrabold text-[#203C37] font-mono">~280k <span className="text-xs font-medium text-[#66847D]">Patients</span></div>
          <p className="text-[11px] text-[#66847D]">Asthma/COPD exacerbations during winter inversion.</p>
        </div>
      </div>

      {/* Two-Column Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ward Distribution Bar Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8F1EC]">
            <div>
              <h3 className="text-sm font-bold text-[#203C37]">
                Ward Composite Risk Distribution
              </h3>
              <p className="text-xs text-[#66847D]">Relative screening rank across PMC administrative zones</p>
            </div>
            <span className="text-[11px] font-semibold text-[#66847D]">Scale: 0-100</span>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wardBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F1EC" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#66847D' }} interval={0} angle={-25} textAnchor="end" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#66847D' }} />
                <Tooltip />
                <Bar dataKey="overallScore" name="Composite Risk" fill="#368F83" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vulnerability Exposure Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#E8F1EC]">
              <h3 className="text-sm font-bold text-[#203C37]">
                Vulnerability Factor Breakdown
              </h3>
              <p className="text-xs text-[#66847D]">Weighting of sensitivity indicators</p>
            </div>

            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vulnerabilityDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {vulnerabilityDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {vulnerabilityDonutData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-[#66847D] truncate">{item.name}: <strong>{item.value}%</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ward Priority Action Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#203C37]">
              PMC Ward Priority Action Matrix
            </h3>
            <p className="text-xs text-[#66847D]">
              Ranked by composite exposure, demographic sensitivity, and hospital bed capacity
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search filter input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#66847D] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter ward..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#EAF3ED] border border-[#D2E4DA] rounded-xl text-xs font-medium text-[#203C37] focus:outline-none"
              />
            </div>

            {/* Sort toggles */}
            <div className="flex items-center gap-1 bg-[#EAF3ED] p-1 rounded-xl text-xs border border-[#D2E4DA]/60">
              <button
                onClick={() => setSelectedSort('overall')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedSort === 'overall' ? 'bg-white text-[#203C37] shadow-xs' : 'text-[#66847D]'
                }`}
              >
                Overall Risk
              </button>
              <button
                onClick={() => setSelectedSort('slum')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedSort === 'slum' ? 'bg-white text-[#203C37] shadow-xs' : 'text-[#66847D]'
                }`}
              >
                Slum %
              </button>
              <button
                onClick={() => setSelectedSort('seniors')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  selectedSort === 'seniors' ? 'bg-white text-[#203C37] shadow-xs' : 'text-[#66847D]'
                }`}
              >
                Seniors %
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#EAF3ED]/60 text-[#66847D] font-bold border-y border-[#D2E4DA] text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Ward</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Risk Score</th>
                <th className="py-2.5 px-3">Slum Pop</th>
                <th className="py-2.5 px-3">Seniors</th>
                <th className="py-2.5 px-3">Beds</th>
                <th className="py-2.5 px-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F1EC]">
              {sortedWards.map((ward) => {
                const tier = getRiskTier(ward.riskProfile.overallScore);
                return (
                  <tr key={ward.id} className="hover:bg-[#EAF3ED]/30 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[#203C37]">
                      {ward.name} <span className="font-mono text-[10px] text-[#66847D]">({ward.wardNumber})</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#66847D]">{ward.zone}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tier.color}`}>
                        {ward.riskProfile.overallScore}/100
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-[#203C37]">{ward.slumPopulationPercent}%</td>
                    <td className="py-2.5 px-3 font-semibold text-[#203C37]">{ward.seniorCitizenPercent}%</td>
                    <td className="py-2.5 px-3 text-[#66847D]">{ward.hospitalBedsPerThousand} /k</td>
                    <td className="py-2.5 px-3 text-right">
                      <Link
                        to="/map"
                        className="text-[#368F83] hover:underline font-bold inline-flex items-center gap-1 text-[11px]"
                      >
                        <span>Map</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preparedness & Planning Directives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#368F83]" />
            <h3 className="text-sm font-bold text-[#203C37]">
              Community Preparedness Indicators
            </h3>
          </div>
          <div className="space-y-2.5 text-xs">
            {preparednessMetrics.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#203C37] block text-xs">{m.label}</span>
                  <p className="text-[10px] text-[#66847D]">{m.note}</p>
                </div>
                <span className="font-mono font-bold text-sm text-[#245B4B]">{m.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-[#368F83]" />
            <h3 className="text-sm font-bold text-[#203C37]">
              PMC Institutional Planning Directives
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-[#203C37] font-bold text-xs">Cool-Roof Retrofits (Yerwada & Hadapsar)</strong>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#368F83] text-white">Target: 15,000 Roofs</span>
              </div>
              <p className="text-[11px] text-[#66847D]">High-albedo reflective coatings to attenuate indoor ambient heat by up to 4°C.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-[#203C37] font-bold text-xs">Ambil Odha & Mula-Mutha Dredging</strong>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#4B91C5] text-white">42 Sensor Nodes</span>
              </div>
              <p className="text-[11px] text-[#66847D]">Pre-monsoon canal desilting and automated real-time water-level early warning sensors.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] space-y-1">
              <div className="flex items-center justify-between">
                <strong className="text-[#203C37] font-bold text-xs">UPHC Vector Sentinel Mesh</strong>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#245B4B] text-white">15 Civic Zones</span>
              </div>
              <p className="text-[11px] text-[#66847D]">Equip peripheral dispensaries with daily digital syndromic fever surveillance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityInsights;
