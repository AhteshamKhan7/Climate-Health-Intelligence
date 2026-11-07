/**
 * ClimateTwin Climate-Health Risk Calculation Engine
 * Reusable client-side implementation of the epidemiological & meteorological
 * risk assessment algorithms for offline fallback and simulator mode.
 */

export function calculateHeatIndex(tempC, humidity) {
  // Convert Celsius to Fahrenheit for NOAA formula
  const T = (tempC * 9/5) + 32;
  const RH = humidity;

  let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (RH * 0.094));

  if (HI >= 80) {
    HI = -42.379 + 2.04901523 * T + 10.14333127 * RH
      - 0.22475541 * T * RH - 0.00683783 * T * T
      - 0.05481717 * RH * RH + 0.00122874 * T * T * RH
      + 0.00085282 * T * RH * RH - 0.00000199 * T * T * RH * RH;

    if (RH < 13 && T >= 80 && T <= 112) {
      const adjustment = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(T - 95)) / 17);
      HI -= adjustment;
    } else if (RH > 85 && T >= 80 && T <= 87) {
      const adjustment = ((RH - 85) / 10) * ((87 - T) / 5);
      HI += adjustment;
    }
  }

  // Convert back to Celsius
  const hiC = (HI - 32) * 5/9;
  return Math.round(hiC * 10) / 10;
}

export function computeHazardScores({ temperature, humidity, rainfall, aqi }) {
  const temp = Number(temperature) || 30;
  const rh = Number(humidity) || 50;
  const rain = Number(rainfall) || 0;
  const air = Number(aqi) || 100;

  // 1. Heat Risk Score (0 - 100)
  const apparentTemp = calculateHeatIndex(temp, rh);
  let heatScore = 0;
  if (apparentTemp < 27) {
    heatScore = Math.max(10, Math.round((apparentTemp / 27) * 25));
  } else if (apparentTemp < 32) {
    heatScore = Math.round(25 + ((apparentTemp - 27) / 5) * 25);
  } else if (apparentTemp < 41) {
    heatScore = Math.round(50 + ((apparentTemp - 32) / 9) * 25);
  } else if (apparentTemp < 54) {
    heatScore = Math.round(75 + ((apparentTemp - 41) / 13) * 20);
  } else {
    heatScore = Math.min(100, Math.round(95 + (apparentTemp - 54)));
  }

  // 2. Air Pollution Risk Score (0 - 100)
  let airScore = 0;
  if (air <= 50) {
    airScore = Math.round((air / 50) * 20);
  } else if (air <= 100) {
    airScore = Math.round(20 + ((air - 50) / 50) * 20);
  } else if (air <= 200) {
    airScore = Math.round(40 + ((air - 100) / 100) * 25);
  } else if (air <= 300) {
    airScore = Math.round(65 + ((air - 200) / 100) * 20);
  } else {
    airScore = Math.min(100, Math.round(85 + ((air - 300) / 200) * 15));
  }

  // 3. Rainfall & Flooding Risk Score (0 - 100)
  let floodScore = 0;
  if (rain <= 5) {
    floodScore = Math.round((rain / 5) * 15);
  } else if (rain <= 35) {
    floodScore = Math.round(15 + ((rain - 5) / 30) * 25);
  } else if (rain <= 75) {
    floodScore = Math.round(40 + ((rain - 35) / 40) * 25);
  } else if (rain <= 120) {
    floodScore = Math.round(65 + ((rain - 75) / 45) * 20);
  } else {
    floodScore = Math.min(100, Math.round(85 + ((rain - 120) / 100) * 15));
  }

  // 4. Vector / Disease Suitability Score (0 - 100)
  // Optimal dengue/malaria mosquito window in Pune: 25°C - 31°C, RH 60% - 85%
  let tempSuitability = 0;
  if (temp >= 20 && temp <= 35) {
    // Peak suitability at 28°C
    tempSuitability = 1 - Math.abs(temp - 28) / 9;
    tempSuitability = Math.max(0, tempSuitability);
  }

  let humiditySuitability = 0;
  if (rh >= 40) {
    humiditySuitability = Math.min(1, (rh - 40) / 40);
  }

  // Rain creates breeding pools (mild to moderate rain is worst, torrential rain flushes larvae)
  let rainFactor = 0.3;
  if (rain > 1 && rain <= 45) {
    rainFactor = 0.9;
  } else if (rain > 45) {
    rainFactor = 0.5; // Larval flushing effect
  }

  const rawVector = (tempSuitability * 0.45 + humiditySuitability * 0.35 + rainFactor * 0.20) * 100;
  const vectorScore = Math.min(100, Math.max(10, Math.round(rawVector)));

  // Overall Climate-Health Composite Score (weighted average)
  const compositeScore = Math.round(
    heatScore * 0.30 +
    airScore * 0.30 +
    floodScore * 0.20 +
    vectorScore * 0.20
  );

  return {
    heat: {
      score: heatScore,
      level: getHazardTier(heatScore),
      apparentTemp,
      metric: `${apparentTemp}°C Heat Index`
    },
    air: {
      score: airScore,
      level: getHazardTier(airScore),
      metric: `AQI ${air}`
    },
    flood: {
      score: floodScore,
      level: getHazardTier(floodScore),
      metric: `${rain} mm/24h`
    },
    vector: {
      score: vectorScore,
      level: getHazardTier(vectorScore),
      metric: `${vectorScore}% Suitability`
    },
    compositeScore: Math.min(100, Math.max(0, compositeScore)),
    compositeTier: getHazardTier(compositeScore)
  };
}

export function getHazardTier(score) {
  if (score >= 75) return 'Critical';
  if (score >= 55) return 'High';
  if (score >= 35) return 'Moderate';
  return 'Low';
}

export function generateAIExplanations({ temperature, humidity, rainfall, aqi, scores }) {
  const explanations = [];

  if (scores.heat.score >= 55) {
    explanations.push({
      category: 'Thermal Stress & Cardiovascular Load',
      severity: scores.heat.level,
      summary: `Ambient temperature of ${temperature}°C coupled with ${humidity}% relative humidity elevates the perceived Heat Index to ${scores.heat.apparentTemp}°C.`,
      clinicalRationale: 'Prolonged exposure accelerates cutaneous vasodilation and raises myocardial oxygen demand, posing severe dehydration and heat syncope risks for geriatric populations and outdoor laborers.',
      actionableAdvice: 'Activate municipal cool-roof shelters, mandate 20-minute rest breaks per hour for construction personnel, and ensure oral rehydration salt (ORS) depots are staffed.'
    });
  } else {
    explanations.push({
      category: 'Thermal Stress',
      severity: 'Low',
      summary: `Current temperature (${temperature}°C) remains within baseline adaptive physiological limits for Pune citizens.`,
      clinicalRationale: 'Core body temperature maintenance requires baseline metabolic effort; low risk of acute thermal illness.',
      actionableAdvice: 'Standard hydration advisories suffice for general public.'
    });
  }

  if (scores.air.score >= 55) {
    explanations.push({
      category: 'Respiratory Airway Inflammation',
      severity: scores.air.level,
      summary: `Air Quality Index of ${aqi} indicates dangerous airborne particulate density over Pune's urban basin.`,
      clinicalRationale: 'Fine particulate matter (PM2.5) penetrates terminal bronchioles and alveolar membranes, initiating systemic oxidative stress, microvascular endothelial injury, and acute bronchospasm in asthma/COPD patients.',
      actionableAdvice: 'Issue immediate school advisories restricting morning outdoor sports, recommend N95 respirators for two-wheeler commuters, and deploy smog dust-suppression cannons along heavy traffic arterial roads.'
    });
  }

  if (scores.vector.score >= 50) {
    explanations.push({
      category: 'Vector Pathogen Amplification',
      severity: scores.vector.level,
      summary: `Microclimate parameters (${temperature}°C, ${humidity}% RH) create a high-risk replication window for Aedes aegypti mosquitoes.`,
      clinicalRationale: 'Elevated ambient warmth shortens the extrinsic incubation period (EIP) of dengue virus from 14 to 7-9 days, accelerating human-to-human transmission velocity by up to 2.4x.',
      actionableAdvice: 'Initiate targeted anti-larval bio-larvicide spraying in stormwater drains and conduct ward-level weekend dry-day inspections in multi-storey residential complexes.'
    });
  }

  if (scores.flood.score >= 50) {
    explanations.push({
      category: 'Hydrological & Waterborne Contamination',
      severity: scores.flood.level,
      summary: `Cumulative rainfall of ${rainfall} mm/24h triggers stormwater drainage saturation in low-lying Pune sectors.`,
      clinicalRationale: 'Overflowing surface runoff breaches sewer conduits, creating acute leptospirosis transmission risks via skin abrasions and bacterial gastroenteritis through compromised drinking mains.',
      actionableAdvice: 'Mobilize emergency dewatering pumps at known underpass choke points and issue preemptive boil-water advisories in riverbank settlements.'
    });
  }

  return explanations;
}

