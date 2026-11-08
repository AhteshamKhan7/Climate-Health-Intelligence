
import React, { useCallback, useEffect, useState } from 'react';

import {
  BellRing,
  Clock,
  MapPin,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { useClimate } from '../../context/ClimateContext';
import apiService from '../../services/api';

export const AlertsList = () => {
  const { selectedWard } = useClimate();

  const [filter, setFilter] = useState('all');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadAlerts = useCallback(async () => {
    if (!selectedWard?.name) return;

    setLoading(true);
    setError('');

    try {
      const response = await apiService.getAlerts({
        location: selectedWard.name,
        status: 'active',
        limit: 50
      });

      const records = Array.isArray(response?.alerts)
        ? response.alerts
        : [];

      // Exclude known synthetic test records.
      const genuineRecords = records.filter((record) => {
        const alert = record.alert || {};

        const assessmentId =
          record.assessment_id || alert.assessment_id || '';

        const locationName =
          record.location_name || alert.location_name || '';

        const isTestRecord =
          assessmentId.toUpperCase().startsWith('TEST-') ||
          locationName.toLowerCase().includes('test location');

        return !isTestRecord;
      });

      setAlerts(genuineRecords);
    } catch (err) {
      console.error('Backend alerts error:', err);

      setAlerts([]);

      setError(
        err.response?.data?.detail ||
        'Unable to load backend alerts.'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedWard?.name]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const handleStatusUpdate = async (alertId, status) => {
    setUpdatingId(alertId);

    try {
      await apiService.updateAlertStatus(alertId, status);

      await loadAlerts();
    } catch (err) {
      console.error('Alert status update failed:', err);

      setError(
        err.response?.data?.detail ||
        'Unable to update alert status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getHazardName = (hazard) => {
    const names = {
      heat: 'Extreme Heat',
      air: 'Air Pollution',
      rain: 'Rainfall',
      overall: 'Overall Climate-Health Risk'
    };

    return names[String(hazard).toLowerCase()] || hazard || 'Environmental Risk';
  };

  const getSeverityBadge = (severity) => {
    switch (String(severity).toLowerCase()) {
      case 'critical':
        return {
          label: 'Critical',
          style: 'bg-red-50 text-red-800 border-red-200'
        };

      case 'high':
        return {
          label: 'High Priority',
          style: 'bg-orange-50 text-orange-800 border-orange-200'
        };

      case 'moderate':
        return {
          label: 'Moderate',
          style: 'bg-amber-50 text-amber-800 border-amber-200'
        };

      default:
        return {
          label: 'Low',
          style: 'bg-[#EAF3ED] text-[#245B4B] border-[#D2E4DA]'
        };
    }
  };

  const filteredAlerts = alerts.filter((record) => {
    const alert = record.alert || {};
    const hazard = String(record.hazard || alert.hazard || '').toLowerCase();

    if (filter === 'all') return true;
    if (filter === 'Air Quality') return hazard === 'air';
    if (filter === 'Heat') return hazard === 'heat';
    if (filter === 'Rainfall') return hazard === 'rain';

    return true;
  });

  const formatDate = (value) => {
    if (!value) return 'Time unavailable';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'Time unavailable';

    return date.toLocaleString([], {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#E8F1EC]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
              <BellRing className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#203C37]">
                Early Warning Notices
              </h3>

              <p className="text-[11px] text-[#66847D]">
                Backend screening alerts · {selectedWard?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {alerts.length} Active
            </span>

            <button
              onClick={loadAlerts}
              disabled={loading}
              className="p-1.5 rounded-lg bg-[#EAF3ED] text-[#368F83] hover:bg-[#D2E4DA] disabled:opacity-50"
              title="Refresh alerts"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto text-[11px]">
          {['all', 'Air Quality', 'Heat', 'Rainfall'].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all whitespace-nowrap ${filter === item
                ? 'bg-[#245B4B] text-white shadow-xs'
                : 'bg-[#EAF3ED] text-[#66847D] hover:text-[#203C37]'
                }`}
            >
              {item === 'all' ? 'All Alerts' : item}
            </button>
          ))}
        </div>

        <div className="space-y-2.5 mt-1 max-h-72 overflow-y-auto pr-1">
          {loading ? (
            <div className="py-10 text-center text-xs text-[#66847D]">
              Loading backend alerts...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-xs text-red-600">
              <ShieldAlert className="w-6 h-6 mx-auto mb-2" />
              {error}
              <button
                onClick={loadAlerts}
                className="block mx-auto mt-2 font-bold text-[#368F83]"
              >
                Try again
              </button>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="py-8 px-3 text-center rounded-xl bg-[#EAF3ED]/40 border border-[#D2E4DA]">
              <CheckCircle className="w-7 h-7 text-[#368F83] mx-auto mb-2" />

              <p className="text-xs font-bold text-[#203C37]">
                No active backend alerts
              </p>

              <p className="text-[11px] text-[#66847D] mt-1">
                No matching active screening alerts are recorded for {selectedWard?.name}.
              </p>
            </div>
          ) : (
            filteredAlerts.map((record) => {
              const alert = record.alert || {};

              const alertId = record.alert_id || alert.alert_id;
              const hazard = record.hazard || alert.hazard;
              const severity = record.severity || alert.severity;

              const title =
                record.title || alert.title || 'Environmental Risk Alert';

              const message =
                record.message || alert.message || 'No additional details available.';

              const location =
                record.location_name ||
                alert.location_name ||
                selectedWard?.name;

              const badge = getSeverityBadge(severity);

              return (
                <div
                  key={alertId}
                  className="p-3 rounded-xl border border-[#D2E4DA] bg-[#EAF3ED]/30 hover:bg-[#EAF3ED]/60 transition-colors text-xs space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border mb-1 ${badge.style}`}>
                        {badge.label}
                      </span>

                      <p className="font-bold text-[#203C37] text-xs">
                        {title}
                      </p>
                    </div>

                    <span className="text-[10px] text-[#66847D] font-mono flex items-center gap-1 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatDate(record.created_at || alert.created_at)}
                    </span>
                  </div>

                  <p className="text-[#66847D] text-[11px] leading-relaxed">
                    {message}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#D2E4DA]/60 text-[10px] text-[#66847D]">
                    <span className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3 h-3 text-[#368F83] flex-shrink-0" />
                      <span className="truncate">{location}</span>
                    </span>

                    <span className="font-bold text-[#203C37] flex-shrink-0">
                      {getHazardName(hazard)} · {record.risk_score ?? alert.risk_score}/100
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      disabled={updatingId === alertId}
                      onClick={() => handleStatusUpdate(alertId, 'acknowledged')}
                      className="px-2.5 py-1 rounded-lg border border-[#D2E4DA] text-[#66847D] font-semibold hover:bg-white disabled:opacity-50"
                    >
                      Acknowledge
                    </button>

                    <button
                      disabled={updatingId === alertId}
                      onClick={() => handleStatusUpdate(alertId, 'resolved')}
                      className="px-2.5 py-1 rounded-lg bg-[#368F83] text-white font-semibold hover:bg-[#245B4B] disabled:opacity-50"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <p className="mt-2 text-[10px] text-[#66847D]">
          These are backend-generated screening records, not independently verified emergency warnings.
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-[#E8F1EC] text-right">
        <Link
          to="/map"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#368F83] hover:text-[#245B4B] transition-colors"
        >
          <span>View Affected Wards on Map</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default AlertsList;
