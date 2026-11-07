/**
 * ClimateTwin Central API Service
 * Handles REST calls to FastAPI backend with automatic graceful fallback to
 * authentic demonstration/modeled baseline data when the backend is offline.
 * Clearly flags data source so users always know whether data is live or modeled.
 */

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
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Cache backend health status to avoid hammering an offline server
let cachedBackendStatus = {
  isOnline: false,
  lastChecked: null,
  error: null
};

export const apiService = {
  /**
   * Check FastAPI Backend Health
   * GET /api/health
   */
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
        error: err.message || 'FastAPI backend connection refused'
      };
      return {
        isLive: false,
        data: MOCK_HEALTH,
        error: err.message
      };
    }
  },

  /**
   * Get Environmental Readings for Pune coordinates
   * GET /api/environment?lat=18.5204&lon=73.8567
   */
  async getEnvironment(lat = 18.5204, lon = 73.8567) {
    try {
      const response = await apiClient.get('/api/environment', {
        params: { lat, lon }
      });
      return {
        isLive: true,
        dataSource: 'Live FastAPI Backend Feed',
        data: response.data
      };
    } catch (err) {
      // Return modeled demonstration dataset with clear flag
      return {
        isLive: false,
        dataSource: 'Modeled Baseline Demonstration Data (Backend Offline)',
        data: {
          ...MOCK_ENVIRONMENT,
          location: {
            ...MOCK_ENVIRONMENT.location,
            lat,
            lon
          }
        },
        error: err.message
      };
    }
  },

  /**
   * Run Dynamic Climate-Health Risk Assessment
   * POST /api/assess
   */
  async assessRisk(payload) {
    try {
      const response = await apiClient.post('/api/assess', payload);
      return {
        isLive: true,
        dataSource: 'Live AI Risk Model (FastAPI)',
        data: response.data
      };
    } catch (err) {
      // Generate client-side modeled assessment
      const fallbackData = generateMockAssessment(payload);
      return {
        isLive: false,
        dataSource: 'Client-Side Modeled Assessment (Demo Fallback)',
        data: fallbackData,
        error: err.message
      };
    }
  },

  /**
   * Run What-If Scenario Simulation
   * POST /api/simulate
   */
  async simulateScenario(payload) {
    try {
      const response = await apiClient.post('/api/simulate', payload);
      return {
        isLive: true,
        dataSource: 'FastAPI Simulation Engine',
        data: response.data
      };
    } catch (err) {
      const fallbackSimulation = generateMockSimulation(payload);
      return {
        isLive: false,
        dataSource: 'Client Simulation Engine (Offline Scenario)',
        data: fallbackSimulation,
        error: err.message
      };
    }
  },

  /**
   * Retrieve cached status
   */
  getBackendStatus() {
    return cachedBackendStatus;
  },

  getBaseUrl() {
    return BASE_URL;
  }
};

export default apiService;

