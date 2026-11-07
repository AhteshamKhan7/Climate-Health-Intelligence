import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  Flame,
  Brain,
  MapPin,
  Sliders,
  Users,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { BackendStatusPill } from '../common/StatusBadge';
import { useClimate } from '../../context/ClimateContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    isBackendOnline,
    checkingHealth,
    verifyBackendHealth,
    selectedWard,
    selectWardById,
    wardsList
  } = useClimate();

  const navLinks = [
    { to: '/', label: 'Overview', icon: BarChart3 },
    { to: '/challenges', label: 'Challenges', icon: Flame },
    { to: '/intelligence', label: 'AI Intelligence', icon: Brain },
    { to: '/map', label: 'Pune Map', icon: MapPin },
    { to: '/simulator', label: 'Simulator', icon: Sliders },
    { to: '/insights', label: 'Community', icon: Users },
    { to: '/about', label: 'About', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 bg-emerald-950 text-white shadow-md border-b border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 text-emerald-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-teal-200 bg-clip-text text-transparent font-sans">
                  ClimateTwin
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-emerald-900 text-emerald-300 border border-emerald-700/50">
                  PMC Pune
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 -mt-0.5 tracking-wide hidden sm:block">
                Climate & Public Health Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                        : 'text-emerald-100/80 hover:text-white hover:bg-emerald-900/70'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Controls: Ward Selector & Backend Pill */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Ward Selector */}
            <div className="flex items-center gap-1.5 bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-800/80 text-xs">
              <Compass className="w-3.5 h-3.5 text-teal-300" />
              <select
                aria-label="Select Pune Administrative Ward"
                value={selectedWard?.id || 'shivajinagar'}
                onChange={(e) => selectWardById(e.target.value)}
                className="bg-transparent text-emerald-100 font-medium focus:outline-none cursor-pointer text-xs"
              >
                {wardsList.map((ward) => (
                  <option key={ward.id} value={ward.id} className="bg-slate-900 text-white">
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Backend status indicator */}
            <BackendStatusPill
              isOnline={isBackendOnline}
              isChecking={checkingHealth}
              onRetry={() => verifyBackendHealth(false)}
            />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 xl:hidden">
            <BackendStatusPill
              isOnline={isBackendOnline}
              isChecking={checkingHealth}
              onRetry={() => verifyBackendHealth(false)}
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-emerald-950/95 border-b border-emerald-900 px-4 pt-3 pb-5 space-y-3">
          {/* Mobile Ward Selector */}
          <div className="flex items-center justify-between bg-emerald-900/90 px-3 py-2 rounded-lg border border-emerald-800 text-xs">
            <span className="text-emerald-300 font-medium">Selected Ward:</span>
            <select
              aria-label="Select Pune Administrative Ward"
              value={selectedWard?.id || 'shivajinagar'}
              onChange={(e) => {
                selectWardById(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="bg-transparent text-emerald-100 font-semibold focus:outline-none cursor-pointer text-xs"
            >
              {wardsList.map((ward) => (
                <option key={ward.id} value={ward.id} className="bg-slate-900 text-white">
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-800 text-white font-semibold'
                        : 'text-emerald-100/80 hover:bg-emerald-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

