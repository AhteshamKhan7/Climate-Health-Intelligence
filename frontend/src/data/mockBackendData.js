/**
 * Realistic Mock Responses Matching FastAPI API Contract
 * Used when backend server is offline, with clear disclaimers that
 * data represents modeled baseline / demonstration mode.
 */

import { computeHazardScores, generateAIExplanations } from '../utils/riskCalculator';

export const MOCK_HEALTH = {
  status: "ok",
  service: "ClimateTwin AI Platform Backend",
  version: "1.0.0",
  environment: "demonstration",
  targetRegion: "Pune Municipal Corporation (PMC), Maharashtra",
  modelStatus: {
    heatEngine: "active",
    airQualityIndexEngine: "active",
    vectorSuitabilityEngine: "active",
    hydrologyModel: "active"
  },
  timestamp: new Date().toISOString()
};

export const MOCK_ENVIRONMENT = {
  location: {
    city: "Pune",
    area: "PMC Central (Shivajinagar)",
    state: "Maharashtra",
    country: "India",
    lat: 18.5204,
    lon: 73.8567,
    elevationMeters: 560
  },
  readings: {
    temperature: 32.8, // Celsius
    humidity: 58, // Percentage
    rainfall: 4.2, // mm / 24h
    aqi: 145, // CPCB Air Quality Index
    pm25: 58.4, // ug/m3
    pm10: 124.0, // ug/m3
    no2: 44.2, // ug/m3
    o3: 31.0, // ug/m3
    windSpeed: 2.6, // m/s
    windDirection: "NW",
    atmosphericPressure: 1012.4, // hPa
    uvIndex: 7.2
  },
  derivedMetrics: {
    heatIndex: 36.2,
    wetBulbTemperature: 25.1,
    respiratoryHazardLevel: "Moderate",
    floodAlertLevel: "Normal",
    vectorBreedingIndex: "Elevated"
  },
  dataSource: "Modeled Demonstration Sensor Feed (PMC Baseline)",
  timestamp: new Date().toISOString(),
  sensorFreshnessMinutes: 12
};

export const MOCK_TRENDS_24H = [
  { time: '00:00', temperature: 24.2, humidity: 76, aqi: 120, rainfall: 0.0, riskScore: 38 },
  { time: '03:00', temperature: 22.8, humidity: 82, aqi: 148, rainfall: 0.0, riskScore: 42 },
  { time: '06:00', temperature: 23.5, humidity: 84, aqi: 182, rainfall: 0.0, riskScore: 54 },
  { time: '09:00', temperature: 27.6, humidity: 68, aqi: 165, rainfall: 0.2, riskScore: 50 },
  { time: '12:00', temperature: 32.4, humidity: 52, aqi: 135, rainfall: 0.5, riskScore: 55 },
  { time: '15:00', temperature: 34.2, humidity: 46, aqi: 128, rainfall: 1.2, riskScore: 61 },
  { time: '18:00', temperature: 30.8, humidity: 58, aqi: 156, rainfall: 1.8, riskScore: 58 },
  { time: '21:00', temperature: 27.1, humidity: 69, aqi: 168, rainfall: 0.5, riskScore: 52 }
];

export const MOCK_TRENDS_7D = [
  { date: 'Mon', avgTemp: 31.2, maxTemp: 34.5, aqi: 138, rainTotal: 8.5, overallRisk: 52 },
  { date: 'Tue', avgTemp: 32.0, maxTemp: 35.1, aqi: 142, rainTotal: 4.2, overallRisk: 54 },
  { date: 'Wed', avgTemp: 32.8, maxTemp: 36.2, aqi: 158, rainTotal: 1.0, overallRisk: 59 },
  { date: 'Thu', avgTemp: 33.5, maxTemp: 37.0, aqi: 162, rainTotal: 0.0, overallRisk: 64 },
  { date: 'Fri', avgTemp: 32.9, maxTemp: 36.4, aqi: 150, rainTotal: 2.4, overallRisk: 60 },
  { date: 'Sat', avgTemp: 31.8, maxTemp: 34.8, aqi: 144, rainTotal: 12.0, overallRisk: 58 },
  { date: 'Sun (Today)', avgTemp: 32.8, maxTemp: 35.8, aqi: 145, rainTotal: 4.2, overallRisk: 57 }
];

export const MOCK_ALERTS = [
  {
    id: 'alt-01',
    hazard: 'Air Quality Advisory',
    level: 'Moderate / Warning',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    title: 'Morning Particulate Matter Spike in Traffic Corridors',
    description: 'PM2.5 concentrations exceeding 60 ug/m3 in Swargate, Hadapsar, and Karve Road. Asthmatic individuals advised to avoid strenuous morning exercise.',
    issuedAt: '2 hours ago',
    validUntil: 'Today, 20:00 IST',
    affectedWards: ['Hadapsar', 'Swargate', 'Kasba Peth']
  },
  {
    id: 'alt-02',
    hazard: 'Vector Multiplication Watch',
    level: 'Elevated Watch',
    badgeClass: 'bg-teal-100 text-teal-800 border-teal-300',
    title: 'High Humidity-Temperature Window for Dengue Vectors',
    description: 'Post-shower stagnant water accumulations combined with 28°C-32°C range create optimal Aedes aegypti breeding velocity.',
    issuedAt: '5 hours ago',
    validUntil: 'Next 72 Hours',
    affectedWards: ['Yerwada', 'Dhankawadi', 'Wadgaon Sheri']
  },
  {
    id: 'alt-03',
    hazard: 'Urban Heat Island Caution',
    level: 'Advisory',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
    title: 'Afternoon Heat Index Peak (37°C)',
    description: 'Impervious surface heat retention in central wadas. Hydration stations deployed at Pune Station and Swargate bus stops.',
    issuedAt: 'Today, 09:30 IST',
    validUntil: 'Today, 17:30 IST',
    affectedWards: ['Kasba Peth', 'Shivajinagar']
  }
];

export function generateMockAssessment(params = {}) {
  const temperature = params.temperature ?? 32.8;
  const humidity = params.humidity ?? 58;
  const rainfall = params.rainfall ?? 4.2;
  const aqi = params.aqi ?? 145;
  const wardId = params.wardId || 'shivajinagar';

  const scores = computeHazardScores({ temperature, humidity, rainfall, aqi });
  const explanations = generateAIExplanations({ temperature, humidity, rainfall, aqi, scores });

  return {
    assessmentId: `CT-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    wardId,
    inputs: { temperature, humidity, rainfall, aqi },
    scores,
    vulnerabilityProfile: {
      socialVulnerabilityIndex: 58,
      elderlyExposureIndex: 64,
      underFiveExposureIndex: 52,
      slumSettlementDensityIndex: 61,
      healthcareAccessIndex: 72
    },
    explanations,
    confidenceMetrics: {
      dataQualityScore: 92, // Percentage
      sensorCoverage: 'High (PMC Urban Mesh)',
      modelUncertainty: '±4.8%',
      lastCalibrated: '7 days ago'
    },
    recommendations: {
      municipalHealthDept: [
        'Deploy mobile cooling units and ORS supply to high-density bus terminals',
        'Direct primary health centers to initiate active dengue fever surveillance',
        'Schedule targeted dust-suppression misting along high-traffic arterial roads'
      ],
      citizens: [
        'Maintain daily fluid intake of at least 2.5 to 3.0 liters',
        'Avoid high-intensity outdoor workouts during morning peak pollution hours (07:00 - 09:30)',
        'Check residential water tanks and plant drip trays for mosquito larvae'
      ],
      healthcareClinics: [
        'Prepare emergency departments for potential heat exhaustion presentations',
        'Ensure rapid dengue NS1 antigen test kits and pediatric nebulizers are stocked'
      ]
    },
    isSimulated: false,
    disclaimer: 'This assessment is an AI-generated public health risk screening tool based on environmental proxies. It is not an individual medical diagnostic or clinical forecast.'
  };
}

export function generateMockSimulation(inputs) {
  const baseline = {
    temperature: 32.8,
    humidity: 58,
    rainfall: 4.2,
    aqi: 145
  };

  const baselineScores = computeHazardScores(baseline);
  const simulatedScores = computeHazardScores(inputs);

  const delta = {
    heatDelta: simulatedScores.heat.score - baselineScores.heat.score,
    airDelta: simulatedScores.air.score - baselineScores.air.score,
    floodDelta: simulatedScores.flood.score - baselineScores.flood.score,
    vectorDelta: simulatedScores.vector.score - baselineScores.vector.score,
    compositeDelta: simulatedScores.compositeScore - baselineScores.compositeScore
  };

  return {
    scenarioId: `SIM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    baselineInputs: baseline,
    simulatedInputs: inputs,
    baselineScores,
    simulatedScores,
    delta,
    impactSummary: [
      {
        hazard: 'Extreme Heat',
        direction: delta.heatDelta >= 0 ? 'increase' : 'decrease',
        magnitude: Math.abs(delta.heatDelta),
        narrative: delta.heatDelta > 15
          ? 'Substantial increase in heat-related illnesses and thermal exhaustion risk for outdoor workers.'
          : 'Thermal load remains near seasonal average.'
      },
      {
        hazard: 'Air Pollution',
        direction: delta.airDelta >= 0 ? 'increase' : 'decrease',
        magnitude: Math.abs(delta.airDelta),
        narrative: delta.airDelta > 15
          ? 'Severe spike in particulate inhalation risk, likely to trigger pediatric asthma ER visits.'
          : 'Air quality impact conforms to baseline urban fluctuations.'
      },
      {
        hazard: 'Rainfall & Flooding',
        direction: delta.floodDelta >= 0 ? 'increase' : 'decrease',
        magnitude: Math.abs(delta.floodDelta),
        narrative: delta.floodDelta > 15
          ? 'Critical drainage surcharge risk along Mula-Mutha river basin and urban nallas.'
          : 'Runoff remains within manageable stormwater channel thresholds.'
      },
      {
        hazard: 'Vector Suitability',
        direction: delta.vectorDelta >= 0 ? 'increase' : 'decrease',
        magnitude: Math.abs(delta.vectorDelta),
        narrative: delta.vectorDelta > 10
          ? 'Accelerated viral replication cycle within mosquito vectors, elevating dengue transmission risk.'
          : 'Vector breeding capacity is suppressed or near baseline.'
      }
    ],
    vulnerablePopulationImpacts: [
      { group: 'Informal Outdoor Laborers', impactLevel: simulatedScores.heat.score > 65 ? 'Critical' : 'Moderate', description: 'Immediate risk of dehydration, heat stroke, and loss of daily wage hours.' },
      { group: 'Senior Citizens (>65 yrs)', impactLevel: simulatedScores.heat.score > 60 || simulatedScores.air.score > 65 ? 'High' : 'Moderate', description: 'Elevated cardiac stress and chronic respiratory exacerbation risk.' },
      { group: 'Slum Settlements (Tin Roofs)', impactLevel: simulatedScores.flood.score > 60 || simulatedScores.heat.score > 70 ? 'Critical' : 'High', description: 'Indoor heat trap effect during day; flash flooding susceptibility during rain.' },
      { group: 'Pediatric Population (<5 yrs)', impactLevel: simulatedScores.vector.score > 65 || simulatedScores.air.score > 65 ? 'High' : 'Moderate', description: 'Susceptible to rapid fluid loss, dengue shock, and airway reactivity.' }
    ],
    recommendations: [
      'Pre-position emergency municipal resources in high-priority wards matching simulated hazard spikes.',
      'Calibrate public warning sirens and SMS broadcast systems according to modeled escalation thresholds.',
      'Review hospital surge bed capacity and IV fluid reserves in anticipated hotspot zones.'
    ]
  };
}

