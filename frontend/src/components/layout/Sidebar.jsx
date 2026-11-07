import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  Brain,
  MapPin,
  Sliders,
  Users,
  Activity,
  Compass,
  X,
  RefreshCw,
  Info
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const {
    isBackendOnline,
    checkingHealth,
    verifyBackendHealth,
    selectedWard,
    selectWardById,
    wardsList
  } = useClimate();

  const navItems = [
    { to: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
    { to: '/challenges', label: 'Health Challenges', icon: Flame },
    { to: '/intelligence', label: 'AI Intelligence', icon: Brain },
    { to: '/map', label: 'Pune Risk Map', icon: MapPin },
    { to: '/simulator', label: 'What-If Simulator', icon: Sliders },
    { to: '/insights', label: 'Community Impact', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#203C37]/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#245B4B] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-[#1d4b3e] shadow-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header, Ward Selector & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#1d4b3e]/80">
            <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#368F83] to-[#2b756b] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                    ClimateTwin
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8dc7be] -mt-1 block">
                  Pune Health Intelligence
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#1d4b3e] lg:hidden transition-colors"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Ward Selector in Sidebar */}
          <div className="px-4 py-3.5 border-b border-[#1d4b3e]/60 bg-[#1e4e40]/70">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-[#9ecfc7]">
                Active PMC Ward
              </label>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#173d32] text-[#8dc7be] border border-[#2b6555]/60">
                {wardsList.length} Wards
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#173d32] px-2.5 py-1.5 rounded-xl border border-[#2b6555] text-xs">
              <Compass className="w-3.5 h-3.5 text-[#368F83] flex-shrink-0" />
              <select
                aria-label="Select Pune Administrative Ward"
                value={selectedWard?.id || 'shivajinagar'}
                onChange={(e) => selectWardById(e.target.value)}
                className="bg-transparent text-emerald-100 font-semibold focus:outline-none cursor-pointer text-xs w-full"
              >
                {wardsList.map((ward) => (
                  <option key={ward.id} value={ward.id} className="bg-[#183f34] text-white">
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7ebbb0] px-3 py-1.5 block">
              Intelligence Modules
            </span>

            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#368F83] text-white shadow-sm font-bold ring-1 ring-white/10'
                        : 'text-emerald-100/80 hover:text-white hover:bg-[#1d4b3e]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-[#8dc7be]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <div className="pt-2 mt-2 border-t border-[#1d4b3e]/80">
              <NavLink
                to="/about"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#368F83] text-white shadow-sm font-bold ring-1 ring-white/10'
                      : 'text-emerald-100/70 hover:text-white hover:bg-[#1d4b3e]'
                  }`
                }
              >
                <Info className="w-4 h-4 text-[#8dc7be]" />
                <span>About ClimateTwin</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Bottom Status & System Health */}
        <div className="p-4 border-t border-[#1d4b3e] bg-[#1e4e40]/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {isBackendOnline ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                )}
              </span>
              <span className="text-[11px] font-mono font-medium text-emerald-100">
                {isBackendOnline ? 'TELEMETRY LIVE' : 'DEMO MODE'}
              </span>
            </div>

            <button
              onClick={() => verifyBackendHealth(false)}
              disabled={checkingHealth}
              title="Refresh Sensor Health Status"
              className="p-1 rounded text-emerald-300 hover:text-white hover:bg-[#173d32] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="text-[10px] text-[#93c7be] flex items-center justify-between pt-1 border-t border-[#2b6555]/50">
            <span>Jurisdiction: Pune PMC</span>
            <span>Sensor Mesh Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
