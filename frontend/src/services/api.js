
import axios from 'axios';

import {
  MOCK_HEALTH,
  MOCK_ENVIRONMENT,
  generateMockAssessment,
  generateMockSimulation
} from '../data/mockBackendData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json'
  }
});

let cachedBackendStatus = {
  isOnline: false,
  lastChecked: null,
  error: null
};

// Convert backend Open-Meteo response into the format
// already used by the existing React dashboard.
const normalizeEnvironment = (rawData, lat, lon) => {
  const weather = rawData?.weather || {};
  const air = rawData?.air_quality || {};
  const daily = rawData?.forecast?.daily || {};

  const forecastRainfall = Array.isArray(daily.precipitation_sum)
    ? daily.precipitation_sum[0]
    : null;

  return {
    success: rawData?.success ?? true,

    location: {
      area: 'Selected Pune Ward',
      lat: rawData?.location?.latitude ?? lat,
      lon: rawData?.location?.longitude ?? lon,
      timezone: rawData?.location?.timezone ?? null
    },

    readings: {
      temperature: weather.temperature_c ?? null,
      apparentTemperature: weather.feels_like_c ?? null,
      humidity: weather.humidity_percent ?? null,

      // Current precipitation, not historical 24-hour rainfall.
      rainfall: weather.precipitation_mm ?? null,

      forecastRainfall: forecastRainfall,

      aqi: air.us_aqi ?? null,
      pm25: air.pm25_ug_m3 ?? null,
      pm10: air.pm10_ug_m3 ?? null,
      no2: air.nitrogen_dioxide_ug_m3 ?? null,
      o3: air.ozone_ug_m3 ?? null,

      windSpeed: weather.wind_speed_kmh ?? null
    },

    metadata: rawData?.metadata ?? {},
    forecast: rawData?.forecast ?? {},
    rawBackendData: rawData
  };
};

export const apiService = {
  async checkHealth() {
    try {
      const response = await apiClient.get('/api/health');

      cachedBackendStatus = {
        isOnline: true,
        lastChecked: new Date().toISOString(),
        error: null,
        data: response.data
      };

      return {
        isLive: true,
        data: response.data
      };
    } catch (err) {
      cachedBackendStatus = {
        isOnline: false,
        lastChecked: new Date().toISOString(),
        error: err.message || 'Backend connection failed'
      };

      return {
        isLive: false,
        data: MOCK_HEALTH,
        error: err.message
      };
    }
  },

  async getEnvironment(latitude = 18.5204, longitude = 73.8567) {
    try {
      const response = await apiClient.get('/api/environment', {
        params: {
          latitude,
          longitude
        }
      });

      return {
        isLive: true,
        dataSource: 'Live Open-Meteo Data via FastAPI',
        data: normalizeEnvironment(
          response.data,
          latitude,
          longitude
        ),
        rawData: response.data
      };
    } catch (err) {
      return {
        isLive: false,
        dataSource: 'Modeled Demonstration Data (Backend Offline)',
        data: {
          ...MOCK_ENVIRONMENT,
          location: {
            ...MOCK_ENVIRONMENT.location,
            lat: latitude,
            lon: longitude
          }
        },
        error: err.message
      };
    }
  },

  async assessRisk(payload) {
    try {
      const response = await apiClient.post('/api/assess', payload);

      return {
        isLive: true,
        dataSource: 'Live Backend Climate-Health Assessment',
        data: response.data.assessment,
        rawData: response.data
      };
    } catch (err) {
      return {
        isLive: false,
        dataSource: 'Client-Side Demonstration Assessment',
        data: generateMockAssessment(payload),
        error: err.message
      };
    }
  },

  async simulateScenario(payload) {
    try {
      const response = await apiClient.post('/api/simulate', payload);

      return {
        isLive: true,
        dataSource: 'FastAPI Simulation Engine',
        data: response.data,
        rawData: response.data
      };
    } catch (err) {
      return {
        isLive: false,
        dataSource: 'Client-Side Demonstration Simulation',
        data: generateMockSimulation(payload),
        error: err.message
      };
    }
  },

  async getHistory(params = {}) {
    const response = await apiClient.get('/api/history', { params });
    return response.data;
  },

  async getHistoryTrends(params = {}) {
    const response = await apiClient.get('/api/history/trends', { params });
    return response.data;
  },

  async assessGeographicLocations(payload) {
    const response = await apiClient.post('/api/geographic/assess', payload);
    return response.data;
  },

  async compareCommunities(payload) {
    const response = await apiClient.post('/api/communities/compare', payload);
    return response.data;
  },

  async assessCommunity(payload) {
    const response = await apiClient.post('/api/communities/assess', payload);
    return response.data;
  },

  async getCommunityRecommendations(payload) {
    const response = await apiClient.post('/api/communities/recommendations', payload);
    return response.data;
  },

  async evaluateAlerts(payload) {
    const response = await apiClient.post('/api/alerts/evaluate', payload);
    return response.data;
  },

  async getAlerts(params = {}) {
    const response = await apiClient.get('/api/alerts', { params });
    return response.data;
  },

  async getAlert(alertId) {
    const response = await apiClient.get(`/api/alerts/${encodeURIComponent(alertId)}`);
    return response.data;
  },

  async updateAlertStatus(alertId, status) {
    const response = await apiClient.patch(
      `/api/alerts/${encodeURIComponent(alertId)}/status`,
      { status }
    );

    return response.data;
  },

  getBackendStatus() {
    return cachedBackendStatus;
  },

  getBaseUrl() {
    return BASE_URL;
  }
};

export default apiService;
