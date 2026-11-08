
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import apiService from '../services/api';
import {
  PUNE_WARDS,
  PUNE_COORDINATES
} from '../data/puneWards';

import { MOCK_ENVIRONMENT } from '../data/mockBackendData';
import toast from 'react-hot-toast';

const ClimateContext = createContext(null);

export const ClimateProvider = ({ children }) => {
  // Backend connection
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(true);

  // Selected Pune ward
  const [selectedWard, setSelectedWard] = useState(PUNE_WARDS[0]);

  // Environmental information
  const [environmentData, setEnvironmentData] = useState(MOCK_ENVIRONMENT);
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [dataSourceLabel, setDataSourceLabel] = useState(
    'Checking environmental data...'
  );

  // Backend risk assessment
  const [assessmentData, setAssessmentData] = useState(null);
  const [isLiveAssessment, setIsLiveAssessment] = useState(false);
  const [assessmentSourceLabel, setAssessmentSourceLabel] = useState(
    'Assessment not loaded'
  );
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  const [lastUpdated, setLastUpdated] = useState(null);

  // Get coordinates of the selected ward
  const getSelectedCoordinates = useCallback(() => {
    const lat =
      selectedWard?.coordinates?.[0] ?? PUNE_COORDINATES.lat;

    const lon =
      selectedWard?.coordinates?.[1] ?? PUNE_COORDINATES.lng;

    return { lat, lon };
  }, [selectedWard]);

  // Check FastAPI health
  const verifyBackendHealth = useCallback(async (silent = false) => {
    setCheckingHealth(true);

    try {
      const result = await apiService.checkHealth();

      setIsBackendOnline(result.isLive);

      if (result.isLive) {
        if (!silent) {
          toast.success('Connected to ClimateTwin Backend!', {
            id: 'backend-status'
          });
        }
      } else {
        if (!silent) {
          toast('Backend offline: Using demonstration mode', {
            icon: 'ℹ️',
            id: 'backend-status'
          });
        }
      }

      return result.isLive;
    } catch (error) {
      setIsBackendOnline(false);
      return false;
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  // Fetch environmental readings
  const refreshEnvironment = useCallback(async () => {
    const { lat, lon } = getSelectedCoordinates();

    try {
      const result = await apiService.getEnvironment(lat, lon);

      setIsLiveFeed(result.isLive);
      setDataSourceLabel(result.dataSource);

      if (result.data) {
        if (!result.isLive && selectedWard?.baseline) {
          // Preserve the existing ward-specific offline fallback.
          setEnvironmentData({
            ...result.data,

            location: {
              ...result.data.location,
              area: `${selectedWard.name} (${selectedWard.wardNumber})`,
              lat,
              lon
            },

            readings: {
              ...result.data.readings,
              temperature: selectedWard.baseline.temperature,
              humidity: selectedWard.baseline.humidity,
              rainfall: selectedWard.baseline.rainfall,
              aqi: selectedWard.baseline.aqi,
              pm25: selectedWard.baseline.pm25,
              pm10: selectedWard.baseline.pm10,
              no2: selectedWard.baseline.no2
            }
          });
        } else {
          setEnvironmentData({
            ...result.data,
            location: {
              ...result.data.location,
              area: selectedWard?.name || 'Pune'
            }
          });
        }
      }

      setLastUpdated(new Date());

      return result;
    } catch (error) {
      console.error('Environment refresh failed:', error);
      setIsLiveFeed(false);
      setDataSourceLabel('Environmental data unavailable');

      return null;
    }
  }, [getSelectedCoordinates, selectedWard]);

  // Fetch backend climate-health risk assessment
  const refreshAssessment = useCallback(async () => {
    const { lat, lon } = getSelectedCoordinates();

    setAssessmentLoading(true);

    try {
      const payload = {
        latitude: lat,
        longitude: lon,
        community_profile: 'general',
        location_name: selectedWard?.name || 'Pune'
      };

      const result = await apiService.assessRisk(payload);

      setAssessmentData(result.data || null);
      setIsLiveAssessment(result.isLive);
      setAssessmentSourceLabel(result.dataSource);

      return result;
    } catch (error) {
      console.error('Risk assessment failed:', error);

      setAssessmentData(null);
      setIsLiveAssessment(false);
      setAssessmentSourceLabel('Assessment unavailable');

      return null;
    } finally {
      setAssessmentLoading(false);
    }
  }, [getSelectedCoordinates, selectedWard]);

  // Refresh both environmental data and risk assessment
  const refreshDashboardData = useCallback(async () => {
    const [environmentResult, assessmentResult] = await Promise.all([
      refreshEnvironment(),
      refreshAssessment()
    ]);

    return {
      environment: environmentResult,
      assessment: assessmentResult
    };
  }, [refreshEnvironment, refreshAssessment]);

  // Initial application loading and selected-ward updates
  useEffect(() => {
    let mounted = true;

    const initializeDashboard = async () => {
      await verifyBackendHealth(true);

      if (!mounted) return;

      await refreshDashboardData();
    };

    initializeDashboard();

    return () => {
      mounted = false;
    };
  }, [verifyBackendHealth, refreshDashboardData]);

  // Select a different ward
  const selectWardById = (wardId) => {
    const found = PUNE_WARDS.find(
      (ward) => ward.id === wardId
    );

    if (found) {
      setSelectedWard(found);

      toast.success(`Switched to ${found.name}`);
    }
  };

  return (
    <ClimateContext.Provider
      value={{
        // Backend connection
        isBackendOnline,
        checkingHealth,
        verifyBackendHealth,

        // Ward selection
        selectedWard,
        setSelectedWard,
        selectWardById,
        wardsList: PUNE_WARDS,

        // Environmental data
        environmentData,
        isLiveFeed,
        dataSourceLabel,
        refreshEnvironment,

        // Backend assessment
        assessmentData,
        isLiveAssessment,
        assessmentSourceLabel,
        assessmentLoading,
        refreshAssessment,

        // Dashboard refresh
        refreshDashboardData,

        // Last update
        lastUpdated
      }}
    >
      {children}
    </ClimateContext.Provider>
  );
};

export const useClimate = () => {
  const context = useContext(ClimateContext);

  if (!context) {
    throw new Error(
      'useClimate must be used within a ClimateProvider'
    );
  }

  return context;
};

export default ClimateContext;
