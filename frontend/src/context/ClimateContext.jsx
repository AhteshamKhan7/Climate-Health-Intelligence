import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';
import { PUNE_WARDS, PUNE_COORDINATES } from '../data/puneWards';
import { MOCK_ENVIRONMENT } from '../data/mockBackendData';
import toast from 'react-hot-toast';

const ClimateContext = createContext(null);

export const ClimateProvider = ({ children }) => {
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(true);
  const [selectedWard, setSelectedWard] = useState(PUNE_WARDS[0]); // Default Shivajinagar
  const [environmentData, setEnvironmentData] = useState(MOCK_ENVIRONMENT);
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [dataSourceLabel, setDataSourceLabel] = useState('Checking connection...');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Ping backend health
  const verifyBackendHealth = useCallback(async (silent = false) => {
    setCheckingHealth(true);
    try {
      const result = await apiService.checkHealth();
      setIsBackendOnline(result.isLive);
      if (result.isLive) {
        if (!silent) toast.success('Connected to Live Climate Telemetry!', { id: 'backend-status' });
      } else {
        if (!silent) toast('Backend offline: Operating in Modeled Demo Mode', { icon: 'ℹ️', id: 'backend-status' });
      }
      return result.isLive;
    } catch {
      setIsBackendOnline(false);
      return false;
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  // Fetch environmental data for current selected ward
  const refreshEnvironment = useCallback(async () => {
    const lat = selectedWard?.coordinates?.[0] || PUNE_COORDINATES.lat;
    const lon = selectedWard?.coordinates?.[1] || PUNE_COORDINATES.lng;

    const result = await apiService.getEnvironment(lat, lon);
    setIsLiveFeed(result.isLive);
    setDataSourceLabel(result.dataSource);

    if (result.data) {
      // If mock or live, tailor to ward baseline if in demo mode
      if (!result.isLive && selectedWard?.baseline) {
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
        setEnvironmentData(result.data);
      }
    }
    setLastUpdated(new Date());
  }, [selectedWard]);

  // Initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      await verifyBackendHealth(true);
      if (mounted) {
        await refreshEnvironment();
      }
    })();
    return () => { mounted = false; };
  }, [verifyBackendHealth, refreshEnvironment]);

  // Handle ward switch
  const selectWardById = (wardId) => {
    const found = PUNE_WARDS.find(w => w.id === wardId);
    if (found) {
      setSelectedWard(found);
      toast.success(`Switched to ${found.name}`);
    }
  };

  return (
    <ClimateContext.Provider
      value={{
        isBackendOnline,
        checkingHealth,
        verifyBackendHealth,
        selectedWard,
        setSelectedWard,
        selectWardById,
        environmentData,
        isLiveFeed,
        dataSourceLabel,
        refreshEnvironment,
        lastUpdated,
        wardsList: PUNE_WARDS
      }}
    >
      {children}
    </ClimateContext.Provider>
  );
};

export const useClimate = () => {
  const context = useContext(ClimateContext);
  if (!context) {
    throw new Error('useClimate must be used within a ClimateProvider');
  }
  return context;
};

