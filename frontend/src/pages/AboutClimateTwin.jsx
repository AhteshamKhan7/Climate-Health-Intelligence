import React from 'react';
import {
  Activity,
  HeartPulse,
  Compass,
  Shield,
  Users,
  Eye,
  Sliders,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DisclaimerBanner from '../components/common/DisclaimerBanner';

export const AboutClimateTwin = () => {
  const capabilities = [
    {
      title: 'Real-Time Health Screening',
      desc: 'Translates ambient temperature, relative humidity, air quality, and rainfall into actionable health risk indices for Pune wards.',
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: 'Geospatial Community Mapping',
      desc: 'Visualizes Pune Municipal Corporation (PMC) administrative boundaries, vulnerable population clusters, and primary healthcare buffers.',
      icon: MapPin,
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    },
    {
      title: 'Automated Risk Synthesis',
      desc: 'Combines environmental indicators with demographic susceptibility to produce clear screening rationales for municipal coordinators.',
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      title: 'What-If Preparedness Stress-Testing',
      desc: 'Enables planners to simulate extreme heat waves, winter smog inversions, and cloudburst events to gauge community resilience.',
      icon: Sliders,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  const focusAreas = [
    {
      name: 'Extreme Heat & Thermal Stress',
      detail: 'Monitoring apparent heat index spikes across tin-roof settlements and high-density central wards like Bhavani Peth and Kasba Peth.'
    },
    {
      name: 'Particulate Air Quality (PM2.5 / PM10)',
      detail: 'Tracking winter thermal inversions and vehicular congestion corridors across industrial and transit-heavy wards.'
    },
    {
      name: 'Monsoon Flooding & Waterlogging',
      detail: 'Evaluating micro-basin surface runoff along the Mutha and Mula riverbanks and low-lying nullah corridors.'
    },
    {
      name: 'Vector-Borne Disease Suitability',
      detail: 'Assessing humidity and temperature suitability windows for Aedes mosquito reproduction cycles.'
    }
  ];

  return (
    <div className="space-y-7">
      <DisclaimerBanner />

      {/* Hero Mission Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D2E4DA] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#EAF3ED] text-[#368F83]">
                <Activity className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#203C37] tracking-tight">
                About ClimateTwin
              </h1>
            </div>
            <p className="text-sm sm:text-base text-[#66847D] font-medium leading-relaxed max-w-3xl">
              An AI-powered climate and public health intelligence platform engineered specifically for Pune City and the PMC administrative jurisdiction.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center bg-[#EAF3ED] px-4 py-2 rounded-xl border border-[#D2E4DA] text-xs font-semibold text-[#203C37]">
            <Compass className="w-4 h-4 text-[#368F83]" />
            <span>PMC Pune Community Focus</span>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#EAF3ED]/60 border border-[#D2E4DA] text-xs sm:text-sm text-[#203C37] leading-relaxed">
          <strong className="text-[#245B4B]">Our Mission:</strong> ClimateTwin bridges the gap between environmental monitoring and public health action. By translating complex meteorological indicators into intuitive ward-level risk assessments, the platform enables municipal authorities, community health workers, and citizens to prepare for and mitigate the health consequences of climate extremes.
        </div>
      </div>

      {/* Core Platform Capabilities (4 Cards) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[#203C37]">
          Core Capabilities & Public Health Scope
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cap.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#203C37] text-sm">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-[#66847D] leading-relaxed">
                    {cap.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pune Microclimate & Health Context */}
      <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E8F1EC]">
          <HeartPulse className="w-5 h-5 text-[#368F83]" />
          <h2 className="text-base font-bold text-[#203C37]">
            Pune Microclimate & Health Vulnerabilities
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-[#66847D] leading-relaxed">
          Pune presents unique topographical and climatic diversity—ranging from the high-elevation ridges of Kothrud and Sinhagad Road to the dense urban valley cores of Kasba Peth and the industrial plains of Hadapsar. ClimateTwin actively models four critical environmental exposure dimensions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {focusAreas.map((area, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA] space-y-1.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#368F83] flex-shrink-0" />
                <span className="font-bold text-[#203C37] text-xs">
                  {area.name}
                </span>
              </div>
              <p className="text-[#66847D] pl-6 leading-relaxed text-[11px]">
                {area.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Community Protection & Screening Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#368F83]" />
            <h3 className="font-bold text-[#203C37] text-sm sm:text-base">
              Vulnerable Population Protection
            </h3>
          </div>
          <p className="text-xs text-[#66847D] leading-relaxed">
            Climate extremes do not affect everyone equally. ClimateTwin prioritizes vulnerable groups across each PMC administrative ward:
          </p>
          <ul className="space-y-2 text-xs text-[#203C37] pt-1">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#368F83] mt-1.5 flex-shrink-0" />
              <span><strong>Senior Citizens (&gt;65 years):</strong> Sensitive to dehydration, cardiovascular strain, and particulate triggers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#368F83] mt-1.5 flex-shrink-0" />
              <span><strong>Informal Settlement Residents:</strong> Communities residing under corrugated tin roofs experience elevated indoor radiant heat.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#368F83] mt-1.5 flex-shrink-0" />
              <span><strong>Outdoor Daily Wage Workers:</strong> Traffic police, street vendors, and delivery personnel requiring scheduled cooling breaks.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D2E4DA] shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800">
              <Shield className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-[#203C37] text-sm sm:text-base">
                Public Screening Notice
              </h3>
            </div>
            <p className="text-xs text-[#66847D] mt-2 leading-relaxed">
              ClimateTwin is designed for population-level environmental exposure screening, municipal situational awareness, and early warning advisory purposes. It does not replace individual clinical diagnoses, medical examinations, or hospital triage protocols.
            </p>
            <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
              In any medical emergency, citizens should immediately dial <strong>108 (Ambulance)</strong> or visit the nearest PMC Urban Primary Health Centre (UPHC).
            </div>
          </div>

          <div className="pt-4 border-t border-[#E8F1EC] flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#368F83] hover:text-[#245B4B] transition-colors"
            >
              <span>Explore Overview Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4B91C5] hover:underline"
            >
              <span>View Pune Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutClimateTwin;

