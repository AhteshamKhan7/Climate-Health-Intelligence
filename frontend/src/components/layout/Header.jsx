import React, { useState } from 'react';
import {
  Menu,
  MapPin,
  Calendar,
  Bell,
  X,
  AlertTriangle,
  ChevronRight,
  Database
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';
import { MOCK_ALERTS } from '../../data/mockBackendData';
import { Link, useLocation } from 'react-router-dom';

export const Header = ({ onOpenSidebar }) => {
  const {
    isBackendOnline,
    selectedWard,
  } = useClimate();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const location = useLocation();

  // Page titles mapping
  const routeTitles = {
    '/': 'Overview Dashboard',
    '/challenges': 'Health Challenges',
    '/intelligence': 'AI Intelligence Workspace',
    '/map': 'Pune Community Risk Map',
    '/simulator': 'What-If Risk Simulator',
    '/insights': 'Community Vulnerability & Impact',
    '/about': 'About ClimateTwin'
  };

  const currentTitle = routeTitles[location.pathname] || 'Intelligence Platform';

  // Current formatted date
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#D2E4DA] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Page Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="p-2 rounded-xl text-[#203C37] hover:bg-[#EAF3ED] lg:hidden focus:outline-none transition-colors"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Hierarchy */}
            <nav className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-[#66847D] hidden sm:inline">ClimateTwin</span>
              <ChevronRight className="w-3 h-3 text-[#66847D]/60 hidden sm:inline" />
              <h1 className="font-bold text-[#203C37] tracking-tight text-sm sm:text-base">
                {currentTitle}
              </h1>
            </nav>
          </div>

          {/* Right: Ward Location, Date, Status, Notification Bell */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Pune Location Indicator */}
            <div className="flex items-center gap-1.5 bg-[#EAF3ED] px-2.5 py-1.5 rounded-xl border border-[#D2E4DA] text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#368F83] flex-shrink-0" />
              <span className="font-medium text-[#203C37] hidden md:inline">
                Pune PMC •
              </span>
              <span className="font-bold text-[#203C37] truncate max-w-[110px] sm:max-w-[160px]">
                {selectedWard?.name || 'Shivajinagar'}
              </span>
            </div>

            {/* Current Date */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#66847D] font-medium bg-[#E4F1F3]/60 px-2.5 py-1.5 rounded-xl border border-[#D2E4DA]/60">
              <Calendar className="w-3.5 h-3.5 text-[#4B91C5]" />
              <span>{todayDate}</span>
            </div>

            {/* Live Data Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-[#D2E4DA] text-xs">
              <span className="relative flex h-2 w-2">
                {isBackendOnline ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                )}
              </span>
              <span className="text-[11px] font-semibold text-[#203C37]">
                {isBackendOnline ? 'Telemetry Live' : 'Modeled Baseline'}
              </span>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative p-2 rounded-xl text-[#203C37] hover:bg-[#EAF3ED] transition-colors border border-[#D2E4DA]/60 hover:border-[#D2E4DA]"
                title="Early Warning Notifications"
              >
                <Bell className="w-4 h-4 text-[#368F83]" />
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              </button>

              {/* Alert Dropdown Popover */}
              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#D2E4DA] z-50 overflow-hidden">
                  <div className="p-3.5 bg-[#EAF3ED] border-b border-[#D2E4DA] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-[#203C37]">
                        Active Early Warning Alerts ({MOCK_ALERTS.length})
                      </span>
                    </div>
                    <button
                      onClick={() => setShowAlertsDropdown(false)}
                      className="text-[#66847D] hover:text-[#203C37] p-1 rounded-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-2 space-y-2 max-h-80 overflow-y-auto">
                    {MOCK_ALERTS.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-3 rounded-xl bg-[#EAF3ED]/30 hover:bg-[#EAF3ED]/60 border border-[#D2E4DA] text-xs space-y-1.5 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#203C37] text-xs">
                            {alert.title}
                          </span>
                          <span className="text-[10px] text-[#66847D] font-mono">
                            {alert.issuedAt}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#66847D] leading-relaxed">
                          {alert.description}
                        </p>
                        <div className="pt-1.5 border-t border-[#D2E4DA]/60 flex items-center justify-between text-[10px] text-[#66847D]">
                          <span>Wards: <strong className="text-[#203C37]">{alert.affectedWards.join(', ')}</strong></span>
                          <span className="font-semibold text-amber-700">{alert.validUntil}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#EAF3ED]/50 border-t border-[#D2E4DA] text-center">
                    <Link
                      to="/"
                      onClick={() => setShowAlertsDropdown(false)}
                      className="text-xs font-bold text-[#368F83] hover:text-[#245B4B] transition-colors"
                    >
                      View All Alerts on Dashboard →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
