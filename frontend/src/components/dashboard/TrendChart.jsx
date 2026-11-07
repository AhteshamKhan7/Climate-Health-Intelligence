import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { MOCK_TRENDS_24H, MOCK_TRENDS_7D } from '../../data/mockBackendData';

export const TrendChart = () => {
  const [timeframe, setTimeframe] = useState('24h'); // '24h' | '7d'
  const [metric, setMetric] = useState('risk'); // 'risk' | 'temp' | 'aqi'

  const data = timeframe === '24h' ? MOCK_TRENDS_24H : MOCK_TRENDS_7D;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#203C37] text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1 border border-[#368F83]/40">
          <p className="font-bold text-[#8dc7be]">{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ color: item.color }} className="font-medium">
              <span className="capitalize">{item.name}</span>: <strong>{item.value}</strong>
              {item.name.toLowerCase().includes('temp') ? ' °C' : ''}
              {item.name.toLowerCase().includes('rain') ? ' mm' : ''}
              {item.name.toLowerCase().includes('risk') ? ' / 100' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#D2E4DA] shadow-xs">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E8F1EC]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#EAF3ED] text-[#368F83]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#203C37]">
                Environmental & Risk Trend Analytics
              </h3>
              <p className="text-xs text-[#66847D] mt-0.5">
                Diurnal curve telemetry across Pune urban monitoring mesh
              </p>
            </div>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-[#EAF3ED] p-1 rounded-xl flex items-center text-xs border border-[#D2E4DA]/60">
            <button
              onClick={() => setTimeframe('24h')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                timeframe === '24h'
                  ? 'bg-white text-[#203C37] shadow-xs font-bold'
                  : 'text-[#66847D] hover:text-[#203C37]'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>24h Timeline</span>
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition-all ${
                timeframe === '7d'
                  ? 'bg-white text-[#203C37] shadow-xs font-bold'
                  : 'text-[#66847D] hover:text-[#203C37]'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>7-Day History</span>
            </button>
          </div>

          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            className="text-xs bg-[#EAF3ED] border border-[#D2E4DA] rounded-xl px-2.5 py-1.5 font-semibold text-[#203C37] focus:outline-none cursor-pointer"
          >
            <option value="risk">Composite Risk Score</option>
            <option value="temp">Temperature & Rain</option>
            <option value="aqi">Air Quality Index (AQI)</option>
          </select>
        </div>
      </div>

      {/* Recharts Area */}
      <div className="h-60 sm:h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'risk' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#368F83" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#368F83" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F1EC" />
              <XAxis
                dataKey={timeframe === '24h' ? 'time' : 'date'}
                tick={{ fontSize: 11, fill: '#66847D' }}
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
                dataKey={timeframe === '24h' ? 'riskScore' : 'overallRisk'}
                name="Risk Score"
                stroke="#368F83"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#riskGrad)"
              />
            </AreaChart>
          ) : metric === 'temp' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F1EC" />
              <XAxis dataKey={timeframe === '24h' ? 'time' : 'date'} tick={{ fontSize: 11, fill: '#66847D' }} />
              <YAxis tick={{ fontSize: 11, fill: '#66847D' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Line
                type="monotone"
                dataKey={timeframe === '24h' ? 'temperature' : 'avgTemp'}
                name="Temperature (°C)"
                stroke="#f97316"
                strokeWidth={2.2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey={timeframe === '24h' ? 'rainfall' : 'rainTotal'}
                name="Rainfall (mm)"
                stroke="#4B91C5"
                strokeWidth={2.2}
                dot={{ r: 3 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F1EC" />
              <XAxis dataKey={timeframe === '24h' ? 'time' : 'date'} tick={{ fontSize: 11, fill: '#66847D' }} />
              <YAxis domain={[0, 240]} tick={{ fontSize: 11, fill: '#66847D' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="aqi"
                name="AQI (CPCB)"
                stroke="#9333ea"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#aqiGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
