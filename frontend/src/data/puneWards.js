/**
 * Pune Municipal Corporation (PMC) Administrative Wards & Key Localities
 * Real coordinates, baseline meteorological and environmental proxies, 
 * vulnerability profiles, and healthcare infrastructure.
 */

export const PUNE_COORDINATES = {
  lat: 18.5204,
  lng: 73.8567,
  zoom: 12
};

export const PUNE_WARDS = [
  {
    id: 'shivajinagar',
    name: 'Shivajinagar',
    wardNumber: 'Ward 08',
    coordinates: [18.5314, 73.8446],
    zone: 'Central Pune',
    population: 185000,
    slumPopulationPercent: 18.5,
    seniorCitizenPercent: 14.2,
    underFivePercent: 7.1,
    greenCoverPercent: 19.4,
    imperviousSurfacePercent: 72.0,
    hospitalBedsPerThousand: 4.8,
    primaryHealthCentres: 3,
    majorHospitals: ['Sassoon General Hospital', 'Sancheti Hospital'],
    baseline: {
      temperature: 32.4,
      humidity: 58,
      rainfall: 4.2,
      aqi: 142,
      pm25: 56,
      pm10: 118,
      no2: 44
    },
    riskProfile: {
      overallScore: 58,
      heatRisk: 'Moderate',
      heatScore: 62,
      airQualityRisk: 'High',
      airQualityScore: 68,
      floodRisk: 'Moderate',
      floodScore: 48,
      vectorSuitability: 'Moderate',
      vectorScore: 54,
      socialVulnerability: 52
    },
    floodZones: ['Mutha River Bank', 'JM Road Junction Underpass'],
    heatHotspots: ['FC Road corridor', 'PMC Bus Station area']
  },
  {
    id: 'kothrud',
    name: 'Kothrud - Bavdhan',
    wardNumber: 'Ward 12',
    coordinates: [18.5074, 73.8077],
    zone: 'Western Pune',
    population: 235000,
    slumPopulationPercent: 9.8,
    seniorCitizenPercent: 18.6, // High elderly population
    underFivePercent: 6.2,
    greenCoverPercent: 24.5,
    imperviousSurfacePercent: 64.0,
    hospitalBedsPerThousand: 3.4,
    primaryHealthCentres: 4,
    majorHospitals: ['Deenanath Mangeshkar Hospital', 'Sahyadri Hospital'],
    baseline: {
      temperature: 31.8,
      humidity: 62,
      rainfall: 5.0,
      aqi: 115,
      pm25: 42,
      pm10: 88,
      no2: 32
    },
    riskProfile: {
      overallScore: 46,
      heatRisk: 'Moderate',
      heatScore: 52,
      airQualityRisk: 'Moderate',
      airQualityScore: 54,
      floodRisk: 'Low',
      floodScore: 32,
      vectorSuitability: 'Moderate',
      vectorScore: 46,
      socialVulnerability: 38
    },
    floodZones: ['Paud Road low pocket near canal'],
    heatHotspots: ['Karve Road transit stretch']
  },
  {
    id: 'hadapsar',
    name: 'Hadapsar - Mundhwa',
    wardNumber: 'Ward 19',
    coordinates: [18.5089, 73.9259],
    zone: 'Eastern Pune',
    population: 310000,
    slumPopulationPercent: 28.4,
    seniorCitizenPercent: 10.1,
    underFivePercent: 9.4,
    greenCoverPercent: 12.1,
    imperviousSurfacePercent: 81.0,
    hospitalBedsPerThousand: 2.1,
    primaryHealthCentres: 4,
    majorHospitals: ['Noble Hospital', 'Sahyadri Speciality Hospital Hadapsar'],
    baseline: {
      temperature: 33.6,
      humidity: 52,
      rainfall: 3.5,
      aqi: 178,
      pm25: 78,
      pm10: 154,
      no2: 56
    },
    riskProfile: {
      overallScore: 74,
      heatRisk: 'High',
      heatScore: 76,
      airQualityRisk: 'High',
      airQualityScore: 79,
      floodRisk: 'High',
      floodScore: 71,
      vectorSuitability: 'High',
      vectorScore: 70,
      socialVulnerability: 72
    },
    floodZones: ['Mundhwa Bridge catchment', 'Malwadi Nalla'],
    heatHotspots: ['Industrial Zone', 'Gadital Bus Stop market cluster']
  },
  {
    id: 'yerwada',
    name: 'Yerwada - Kalas - Dhanori',
    wardNumber: 'Ward 03',
    coordinates: [18.5529, 73.8797],
    zone: 'North-Eastern Pune',
    population: 275000,
    slumPopulationPercent: 36.2, // Very high vulnerable informal settlements
    seniorCitizenPercent: 11.0,
    underFivePercent: 10.2,
    greenCoverPercent: 14.8,
    imperviousSurfacePercent: 78.0,
    hospitalBedsPerThousand: 2.4,
    primaryHealthCentres: 5,
    majorHospitals: ['Rajiv Gandhi Hospital Yerwada', 'Mental Hospital Campus'],
    baseline: {
      temperature: 32.9,
      humidity: 66,
      rainfall: 8.4,
      aqi: 162,
      pm25: 68,
      pm10: 138,
      no2: 48
    },
    riskProfile: {
      overallScore: 79,
      heatRisk: 'High',
      heatScore: 74,
      airQualityRisk: 'High',
      airQualityScore: 76,
      floodRisk: 'Critical',
      floodScore: 88,
      vectorSuitability: 'Critical',
      vectorScore: 84,
      socialVulnerability: 82
    },
    floodZones: ['Mula River Basin', 'Shanti Nagar low-lying nallas', 'Kamraj Nagar'],
    heatHotspots: ['Tin-roof dense slum clusters in Yerwada Gaon']
  },
  {
    id: 'kasbapeth',
    name: 'Kasba - Vishrambaug Wada',
    wardNumber: 'Ward 15',
    coordinates: [18.5173, 73.8562],
    zone: 'Old Historic Core',
    population: 145000,
    slumPopulationPercent: 16.0,
    seniorCitizenPercent: 17.8,
    underFivePercent: 6.8,
    greenCoverPercent: 6.2, // Extremely low tree canopy
    imperviousSurfacePercent: 91.0,
    hospitalBedsPerThousand: 5.2,
    primaryHealthCentres: 3,
    majorHospitals: ['Kem Hospital', 'Poona Hospital & Research Centre'],
    baseline: {
      temperature: 34.1,
      humidity: 50,
      rainfall: 3.8,
      aqi: 155,
      pm25: 64,
      pm10: 132,
      no2: 52
    },
    riskProfile: {
      overallScore: 68,
      heatRisk: 'Critical', // Intense urban heat island
      heatScore: 86,
      airQualityRisk: 'Moderate',
      airQualityScore: 64,
      floodRisk: 'Moderate',
      floodScore: 56,
      vectorSuitability: 'Moderate',
      vectorScore: 62,
      socialVulnerability: 64
    },
    floodZones: ['Nagzari Nalla overflow areas'],
    heatHotspots: ['Laxmi Road dense commercial core', 'Raviwar Peth market']
  },
  {
    id: 'aundh',
    name: 'Aundh - Baner',
    wardNumber: 'Ward 07',
    coordinates: [18.5590, 73.8073],
    zone: 'North-Western Pune',
    population: 195000,
    slumPopulationPercent: 8.5,
    seniorCitizenPercent: 13.9,
    underFivePercent: 7.0,
    greenCoverPercent: 28.2, // High green cover
    imperviousSurfacePercent: 58.0,
    hospitalBedsPerThousand: 3.8,
    primaryHealthCentres: 3,
    majorHospitals: ['Jupiter Hospital Baner', 'Medipoint Hospital Aundh'],
    baseline: {
      temperature: 31.2,
      humidity: 60,
      rainfall: 4.8,
      aqi: 98,
      pm25: 34,
      pm10: 74,
      no2: 28
    },
    riskProfile: {
      overallScore: 36,
      heatRisk: 'Low',
      heatScore: 38,
      airQualityRisk: 'Low',
      airQualityScore: 39,
      floodRisk: 'Moderate',
      floodScore: 42,
      vectorSuitability: 'Low',
      vectorScore: 35,
      socialVulnerability: 28
    },
    floodZones: ['Ram Nadi confluence point'],
    heatHotspots: ['Baner Road highway junction']
  },
  {
    id: 'swargate',
    name: 'Swargate - Parvati',
    wardNumber: 'Ward 14',
    coordinates: [18.4988, 73.8584],
    zone: 'South-Central Pune',
    population: 210000,
    slumPopulationPercent: 24.0,
    seniorCitizenPercent: 14.5,
    underFivePercent: 8.1,
    greenCoverPercent: 16.5,
    imperviousSurfacePercent: 79.0,
    hospitalBedsPerThousand: 3.9,
    primaryHealthCentres: 4,
    majorHospitals: ['Saraswati Hospital', 'Bibwewadi Health Center'],
    baseline: {
      temperature: 32.8,
      humidity: 55,
      rainfall: 4.0,
      aqi: 168,
      pm25: 72,
      pm10: 146,
      no2: 64 // Dense diesel bus junction
    },
    riskProfile: {
      overallScore: 66,
      heatRisk: 'High',
      heatScore: 71,
      airQualityRisk: 'High',
      airQualityScore: 78,
      floodRisk: 'Moderate',
      floodScore: 55,
      vectorSuitability: 'Moderate',
      vectorScore: 59,
      socialVulnerability: 62
    },
    floodZones: ['Ambil Odha canal overflow sector'],
    heatHotspots: ['Swargate ST Stand transit tarmac']
  },
  {
    id: 'vimannagar',
    name: 'Viman Nagar - Kharadi',
    wardNumber: 'Ward 04',
    coordinates: [18.5679, 73.9143],
    zone: 'Eastern Pune Corridor',
    population: 240000,
    slumPopulationPercent: 14.2,
    seniorCitizenPercent: 9.8,
    underFivePercent: 8.5,
    greenCoverPercent: 17.0,
    imperviousSurfacePercent: 76.0,
    hospitalBedsPerThousand: 2.8,
    primaryHealthCentres: 3,
    majorHospitals: ['Columbia Asia / Manipal Hospital Kharadi', 'Apollo Clinic'],
    baseline: {
      temperature: 32.6,
      humidity: 54,
      rainfall: 4.6,
      aqi: 148,
      pm25: 60,
      pm10: 124,
      no2: 46
    },
    riskProfile: {
      overallScore: 54,
      heatRisk: 'Moderate',
      heatScore: 58,
      airQualityRisk: 'Moderate',
      airQualityScore: 62,
      floodRisk: 'Moderate',
      floodScore: 49,
      vectorSuitability: 'Moderate',
      vectorScore: 48,
      socialVulnerability: 44
    },
    floodZones: ['Mula-Mutha floodline along Kharadi bypass'],
    heatHotspots: ['Ahmednagar Road bottleneck']
  },
  {
    id: 'dhankawadi',
    name: 'Dhankawadi - Sahakarnagar',
    wardNumber: 'Ward 17',
    coordinates: [18.4682, 73.8543],
    zone: 'Southern Pune',
    population: 220000,
    slumPopulationPercent: 22.5,
    seniorCitizenPercent: 13.2,
    underFivePercent: 8.6,
    greenCoverPercent: 21.0,
    imperviousSurfacePercent: 68.0,
    hospitalBedsPerThousand: 2.6,
    primaryHealthCentres: 4,
    majorHospitals: ['Bharti Vidyapeeth Medical College Hospital'],
    baseline: {
      temperature: 32.1,
      humidity: 61,
      rainfall: 6.2,
      aqi: 130,
      pm25: 50,
      pm10: 106,
      no2: 36
    },
    riskProfile: {
      overallScore: 57,
      heatRisk: 'Moderate',
      heatScore: 56,
      airQualityRisk: 'Moderate',
      airQualityScore: 58,
      floodRisk: 'High',
      floodScore: 68,
      vectorSuitability: 'Moderate',
      vectorScore: 58,
      socialVulnerability: 56
    },
    floodZones: ['Ambil Odha upstream catchment', 'Katraj lake runoff channels'],
    heatHotspots: ['Satara Road junction']
  },
  {
    id: 'wadgaonsheri',
    name: 'Wadgaon Sheri - Kalyani Nagar',
    wardNumber: 'Ward 05',
    coordinates: [18.5447, 73.9214],
    zone: 'North-Eastern Rim',
    population: 260000,
    slumPopulationPercent: 27.0,
    seniorCitizenPercent: 11.2,
    underFivePercent: 9.1,
    greenCoverPercent: 15.5,
    imperviousSurfacePercent: 77.0,
    hospitalBedsPerThousand: 2.2,
    primaryHealthCentres: 3,
    majorHospitals: ['Inamdar Hospital', 'Kalyani Nagar Clinics'],
    baseline: {
      temperature: 33.0,
      humidity: 57,
      rainfall: 5.1,
      aqi: 158,
      pm25: 66,
      pm10: 136,
      no2: 44
    },
    riskProfile: {
      overallScore: 64,
      heatRisk: 'High',
      heatScore: 68,
      airQualityRisk: 'High',
      airQualityScore: 71,
      floodRisk: 'Moderate',
      floodScore: 58,
      vectorSuitability: 'Moderate',
      vectorScore: 62,
      socialVulnerability: 63
    },
    floodZones: ['Mutha River shoreline pockets', 'Wadgaon Sheri Nalla'],
    heatHotspots: ['Dense construction areas along Anand Park']
  }
];

export const getRiskColor = (score) => {
  if (score >= 75) return '#ef4444'; // Red (Critical/Severe)
  if (score >= 55) return '#f97316'; // Orange (High)
  if (score >= 35) return '#eab308'; // Yellow (Moderate)
  return '#10b981'; // Green (Low)
};

export const getRiskTier = (score) => {
  if (score >= 75) return { label: 'Critical Risk', color: 'text-red-700 bg-red-50 border-red-200' };
  if (score >= 55) return { label: 'High Risk', color: 'text-orange-700 bg-orange-50 border-orange-200' };
  if (score >= 35) return { label: 'Moderate Risk', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'Low Risk', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
};

