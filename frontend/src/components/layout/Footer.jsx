import React from 'react';
import { Shield, PhoneCall, HeartPulse, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-auto bg-[#1e4e40] text-emerald-100 border-t border-[#1d4b3e] text-xs">
      {/* Emergency Helpline Strip */}
      <div className="bg-[#173d32] border-b border-[#2b6555]/60 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-emerald-200">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#368F83]" />
            <span className="font-semibold text-white">Pune Helplines:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Ambulance: <strong className="text-white">108</strong></span>
            <span>•</span>
            <span>PMC Disaster Cell: <strong className="text-white">1077</strong> / 020-25501269</span>
            <span>•</span>
            <span>PMC Citizen Toll-Free: <strong className="text-white">1800 1030 222</strong></span>
            <span>•</span>
            <span>Sassoon Hospital: 020-26128000</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-2.5 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#368F83] flex items-center justify-center text-white font-bold">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-white">ClimateTwin</span>
            </div>
            <p className="text-emerald-200/80 text-xs leading-relaxed">
              AI-Powered Climate & Public Health Intelligence Platform engineered for the Pune Municipal Corporation (PMC).
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-emerald-200/80">
              <li><Link to="/" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/challenges" className="hover:text-white transition-colors">Health Challenges</Link></li>
              <li><Link to="/intelligence" className="hover:text-white transition-colors">AI Intelligence</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Pune Community Map</Link></li>
              <li><Link to="/simulator" className="hover:text-white transition-colors">What-If Simulator</Link></li>
              <li><Link to="/insights" className="hover:text-white transition-colors">Community Impact</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About ClimateTwin</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Data Provenance</h4>
            <ul className="space-y-1.5 text-emerald-200/70 text-[11px]">
              <li>• IMD Pune Shivajinagar AWS Telemetry</li>
              <li>• SAFAR Air Quality Monitoring Mesh</li>
              <li>• Central Pollution Control Board (CPCB)</li>
              <li>• OpenStreetMap Cartography</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Screening Notice</span>
            </div>
            <p className="text-emerald-200/70 text-[11px] leading-relaxed">
              Population-level environmental exposure screening tool. Not an individual medical diagnostic or clinical forecast.
            </p>
            <div className="pt-2 text-[10px] text-emerald-300/60 font-mono">
              © {new Date().getFullYear()} ClimateTwin • Pune, India
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
