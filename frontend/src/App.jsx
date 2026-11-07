import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClimateProvider } from './context/ClimateContext';
import Layout from './components/layout/Layout';

// Pages
import OverviewDashboard from './pages/OverviewDashboard';
import ClimateHealthChallenges from './pages/ClimateHealthChallenges';
import AIClimateIntelligence from './pages/AIClimateIntelligence';
import PuneCommunityRiskMap from './pages/PuneCommunityRiskMap';
import WhatIfSimulator from './pages/WhatIfSimulator';
import CommunityInsights from './pages/CommunityInsights';
import AboutClimateTwin from './pages/AboutClimateTwin';

export const App = () => {
  return (
    <ClimateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<OverviewDashboard />} />
            <Route path="challenges" element={<ClimateHealthChallenges />} />
            <Route path="intelligence" element={<AIClimateIntelligence />} />
            <Route path="map" element={<PuneCommunityRiskMap />} />
            <Route path="simulator" element={<WhatIfSimulator />} />
            <Route path="insights" element={<CommunityInsights />} />
            <Route path="about" element={<AboutClimateTwin />} />
            <Route path="reports" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ClimateProvider>
  );
};

export default App;

