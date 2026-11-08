
import React, { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Calendar, Clock, TrendingUp, RefreshCw } from 'lucide-react';

import { useClimate } from '../../context/ClimateContext';
import apiService from '../../services/api';

export const TrendChart = () => {
  const { selectedWard } = useClimate();

  const [timeframe, setTimeframe] = useState('7');
  const [metric, setMetric] = useState('overall_score');

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataStatus, setDataStatus] = useState('');

  const loadHistory = async () => {
    if (!selectedWard?.name) return;

    setLoading(true);
    setError('');

    try {
      const result = await apiService.getHistoryTrends({
        location: selectedWard.name,
        community_profile: 'general',
        limit: 500
      });

      if (!result?.success) {
        throw new Error('Unable to retrieve assessment history.');
      }

      const points = Array.isArray(result.data_points)
        ? result.data_points
        : [];

      const formatted = points.map((point) => {
        const date = new Date(point.generated_at);

        return {
          ...point,
          chartLabel: Number.isNaN(date.getTime())
            ? point.generated_at
            : date.toLocaleString([], {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })
        };
      });

      setHistory(formatted);

      setDataStatus(
        result.status === 'available'
          ? `${result.observation_count} saved assessments`
          : 'Waiting for more saved assessments'
      );
    } catch (err) {
      console.error('Historical trends error:', err);
      setHistory([]);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Historical data could not be loaded.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [selectedWard?.name]);

  const visibleData = useMemo(() => {
    if (timeframe === '24') {
      return history.slice(-24);
    }

    return history.slice(-7);
  }, [history, timeframe]);

  const metricOptions = [
    { value: 'overall_score', label: 'Overall Risk Score' },
    { value: 'heat_score', label: 'Heat Risk' },
    { value: 'air_score', label: 'Air Risk' },
    { value: 'rain_score', label: 'Rain Risk' }
  ];

  const metricLabel =
    metricOptions.find((item) => item.value === metric)?.label ||
    'Risk Score';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-[#203C37] text-white p-3 rounded-xl shadow-lg text-xs border border-[#368F83]/40">
        <p className="font-bold text-[#8dc7be] mb-1">{label}</p>

        {payload.map((item, index) => (
          <p key={index} className="font-medium">
            {metricLabel}: <strong>{item.value}/100</strong>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E8F1EC]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#EAF3ED] text-[#368F83]">
              <TrendingUp className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#203C37]">
                Historical Climate-Health Risk Trends
              </h3>

              <p className="text-xs text-[#66847D] mt-0.5">
                Saved backend assessments for {selectedWard?.name || 'Pune'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#EAF3ED] p-1 rounded-xl flex items-center text-xs border border-[#D2E4DA]/60">
            <button
              onClick={() => setTimeframe('24')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${timeframe === '24'
                  ? 'bg-white text-[#203C37] shadow-xs'
                  : 'text-[#66847D] hover:text-[#203C37]'
                }`}
            >
              <Clock className="w-3 h-3" />
              <span>Latest 24</span>
            </button>

            <button
              onClick={() => setTimeframe('7')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${timeframe === '7'
                  ? 'bg-white text-[#203C37] shadow-xs'
                  : 'text-[#66847D] hover:text-[#203C37]'
                }`}
            >
              <Calendar className="w-3 h-3" />
              <span>Latest 7</span>
            </button>
          </div>

          <select
            value={metric}
            onChange={(event) => setMetric(event.target.value)}
            className="text-xs bg-[#EAF3ED] border border-[#D2E4DA] rounded-xl px-2.5 py-1.5 font-semibold text-[#203C37] focus:outline-none cursor-pointer"
          >
            {metricOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            onClick={loadHistory}
            disabled={loading}
            className="p-2 rounded-lg bg-[#EAF3ED] text-[#368F83] hover:bg-[#D2E4DA] disabled:opacity-50"
            title="Refresh historical assessments"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-[10px] text-[#66847D]">
        <span>{dataStatus}</span>
        <span>Source: FastAPI + SQLite</span>
      </div>

      <div className="h-60 sm:h-64 w-full mt-4">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-[#66847D]">
            Loading saved assessments...
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-sm text-red-600 text-center px-4">
            {error}
          </div>
        ) : visibleData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2 px-4">
            <TrendingUp className="w-8 h-8 text-[#9BB8AE]" />

            <p className="text-sm font-semibold text-[#203C37]">
              No historical assessments available
            </p>

            <p className="text-xs text-[#66847D]">
              Run at least two assessments for this ward and community profile to generate a historical trend.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={visibleData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="backendRiskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#368F83" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#368F83" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E8F1EC"
              />

              <XAxis
                dataKey="chartLabel"
                tick={{ fontSize: 10, fill: '#66847D' }}
                axisLine={{ stroke: '#D2E4DA' }}
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#66847D' }}
                axisLine={{ stroke: '#D2E4DA' }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey={metric}
                name={metricLabel}
                stroke="#368F83"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#backendRiskGradient)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="text-[10px] text-[#66847D] mt-2 border-t border-[#E8F1EC] pt-2">
        Historical screening scores only. These records are not validated health-outcome predictions.
      </p>
    </div>
  );
};

export default TrendChart;
