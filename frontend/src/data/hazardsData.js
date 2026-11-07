/**
 * Climate-Health Hazards Dataset for Pune Metropolitan Area
 * Detailed epidemiology, meteorological trigger thresholds, vulnerable populations,
 * early-warning importance, and preventive recommendations.
 */

export const CLIMATE_HAZARDS = [
  {
    id: 'extreme-heat',
    name: 'Extreme Heat & Heatwaves',
    shortName: 'Extreme Heat',
    tagline: 'Urban heat islands exacerbating heat cramps, dehydration, and cardiovascular strain',
    iconName: 'SunMedium',
    accentColor: 'text-amber-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    accentBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    puneContext: 'Pune’s rapid urbanization and expanding concrete topography (e.g., Hadapsar, Kasba Peth, Swargate) create intense localized micro-climates where surface temperatures reach 3°C to 6°C higher than peripheral green zones like Aundh and Bavdhan during pre-monsoon months (April-May).',
    
    // 1. Climate Hazard
    climateHazard: {
      overview: 'Sustained daytime temperatures exceeding 38°C combined with elevated humidity (>45%) or overnight minimum temperatures failing to drop below 26°C, preventing nocturnal physiological cooling.',
      severityLevels: [
        { level: 'Yellow Alert (Warm)', condition: 'Max Temp 37°C - 39.9°C with moderate humidity', implication: 'Tolerable for healthy adults; hydration caution for vulnerable groups.' },
        { level: 'Orange Alert (Severe Heat)', condition: 'Max Temp 40°C - 42.9°C or heatwave for 2+ consecutive days', implication: 'High risk of heat cramps and exhaustion among outdoor workers.' },
        { level: 'Red Alert (Extreme Heatwave)', condition: 'Max Temp >= 43°C or Heat Index > 46°C', implication: 'Medical emergency risk: heat stroke, organ hypoperfusion, cardiovascular collapse.' }
      ],
      keyMetrics: [
        { label: 'Critical Temp Threshold', value: '39.5°C' },
        { label: 'Wet Bulb Warning Threshold', value: '29.0°C' },
        { label: 'Urban Heat Island Delta', value: '+4.2°C' }
      ]
    },

    // 2. Environmental Conditions
    environmentalConditions: {
      meteorologicalDrivers: [
        'Prolonged anti-cyclonic weather patterns over Maharashtra interior plateau',
        'Dry, hot continental winds from the north-west passing across the Deccan',
        'Clear cloudless skies with peak solar irradiance between 11:30 AM and 3:30 PM',
        'Dense impervious surface coverage (>70%) preventing evaporative latent cooling'
      ],
      monitoringSensors: ['IMD Shivajinagar & Pashan Observatories', 'PMC Automated Weather Stations (AWS)', 'Satellite Land Surface Temperature (LST) via MODIS/Landsat'],
      seasonalWindow: 'March through early June; secondary post-monsoon heat spike in October ("October Heat").'
    },

    // 3. Potential Health Impact
    potentialHealthImpact: {
      acuteEffects: [
        'Heat exhaustion manifesting as profuse diaphoresis, syncope, severe headache, tachycardia, and nausea',
        'Life-threatening Heat Stroke (core body temperature >40.5°C) with central nervous system dysfunction, delirium, or coma',
        'Acute kidney injury (AKI) from prolonged severe volume depletion and rhabdomyolysis'
      ],
      chronicExacerbations: [
        'Decompensated congestive heart failure and acute coronary syndromes due to increased cardiac output demand',
        'Aggravation of chronic kidney disease (CKD), particularly among informal sector manual laborers',
        'Impaired drug clearance and altered electrolyte balance in hypertensive patients on diuretics or ACE inhibitors'
      ],
      estimatedHospitalizationImpact: '+18% to +26% surge in emergency admissions when Heat Index exceeds 42°C for >48 hours.'
    },

    // 4. Affected Population
    affectedPopulation: {
      primaryGroups: [
        {
          group: 'Informal Outdoor Laborers',
          description: 'Over 140,000 construction workers, auto-rickshaw operators, street hawkers, and sanitation staff in PMC with no access to shaded respite.'
        },
        {
          group: 'Elderly Citizens (>65 years)',
          description: 'Approx. 340,000 Pune residents with blunted thirst perception, autonomic thermoregulatory dysfunctions, and cardiovascular co-morbidities.'
        },
        {
          group: 'Dense Informal Settlements',
          description: 'Residents in tin/asbestos-roofed dwellings (Yerwada, Patil Estate, Janata Vasahat) where indoor temperatures frequently exceed outdoor ambient levels.'
        },
        {
          group: 'Infants & Pediatric Patients',
          description: 'High surface-area-to-mass ratio and immature sweat mechanisms leading to rapid hypovolemic dehydration.'
        }
      ]
    },

    // 5. Why Early Awareness Matters
    earlyAwarenessMatters: {
      rationale: 'Heat-related illnesses are nearly 100% preventable when behavioral and municipal interventions are deployed 24 to 48 hours in advance.',
      preventiveWindow: 'Early alert triggers give municipal health wards time to mobilize cool shelters, adjust outdoor work hours, distribute oral rehydration salts (ORS), and notify hospital casualty departments to prepare iced IV saline and cooling beds before mass casualties occur.',
      preventedOutcomes: 'Reduces heat stroke mortality by up to 70% and prevents non-reversible renal impairment in young workers.'
    },

    // 6. Preventive Recommendations
    preventiveRecommendations: {
      publicHealthAuthorities: [
        'Activate Pune Heat Action Plan (HAP) Level 2/3 color-coded advisories across PMC communication channels',
        'Mandate suspension of high-intensity construction work between 12:00 PM and 4:00 PM during Orange/Red alerts',
        'Establish 120+ shaded "Cooling Kiosks" equipped with potable water and ORS packets at key transit hubs (Swargate, Pune Station, Hadapsar Gadital)',
        'Ensure primary health centres (Uphcs) stock adequate IV crystalloids, chilled ice packs, and thermometer probes'
      ],
      citizensAndCommunities: [
        'Consume minimum 2.5 to 3.5 liters of water and electrolyte solutions daily; avoid high-sugar and alcoholic dehydrating beverages',
        'Wear loose, light-colored cotton attire; carry an umbrella or damp cloth covering when stepping outdoors',
        'Never leave infants, children, or elderly persons in parked vehicles or unventilated upper-floor rooms'
      ],
      hospitalsAndClinics: [
        'Pre-designate dedicated heat resuscitation beds with immersion or evaporative cooling mist equipment',
        'Implement mandatory core temperature and serum creatinine screening for all elderly fever/confusion presentations'
      ]
    }
  },
  {
    id: 'air-pollution',
    name: 'Air Pollution & Particulate Matter Spikes',
    shortName: 'Air Pollution',
    tagline: 'Winter thermal inversion and vehicular emissions driving PM2.5, PM10, and NO2 respiratory hazards',
    iconName: 'Wind',
    accentColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    accentBg: 'bg-purple-50',
    borderColor: 'border-purple-200',
    puneContext: 'Pune’s bowl-shaped topography flanked by Sahyadri ridges creates acute ground-level temperature inversions during winter (November-February). Traffic bottlenecks along Karve Road, Hadapsar, and Katraj combine with construction dust to trap dangerous concentrations of respirable particulate matter (PM2.5).',
    
    // 1. Climate Hazard
    climateHazard: {
      overview: 'Sustained AQI exceeding 180 (CPCB scale) or 24-hour mean PM2.5 concentrations exceeding 60 ug/m3 (over 4x WHO safe guideline) and PM10 exceeding 150 ug/m3.',
      severityLevels: [
        { level: 'Moderate (AQI 101 - 200)', condition: 'Breathing discomfort to people with lungs, asthma, and heart diseases.', implication: 'Sensitive groups should restrict intense outdoor exercise.' },
        { level: 'Poor to Very Poor (AQI 201 - 300)', condition: 'Widespread respiratory illness on prolonged exposure; microvascular inflammation.', implication: 'Children and seniors experience acute coughing, wheezing, and ocular irritation.' },
        { level: 'Severe / Emergency (AQI > 300)', condition: 'Healthy individuals develop respiratory symptoms; severe cardiovascular hazard.', implication: 'Emergency school sports closures and diesel vehicle diversions indicated.' }
      ],
      keyMetrics: [
        { label: 'WHO 24h Guideline (PM2.5)', value: '15 ug/m3' },
        { label: 'Pune Winter Peak (PM2.5)', value: '110-180 ug/m3' },
        { label: 'Vehicular NO2 Peak', value: '78 ug/m3' }
      ]
    },

    // 2. Environmental Conditions
    environmentalConditions: {
      meteorologicalDrivers: [
        'Winter nocturnal atmospheric temperature inversion locking pollutants under 200m boundary layer',
        'Calm wind conditions (surface wind speed < 1.5 m/s) preventing horizontal pollutant dispersion',
        'Relative humidity between 70-85% at dawn encouraging secondary sulfate/nitrate aerosol formation',
        'Unregulated construction excavation and unpaved road dust along the Katraj-Dehu Road bypass'
      ],
      monitoringSensors: ['SAFAR Pune monitoring stations (Shivajinagar, Bhosari, Lohegaon, Hadapsar, Alandi)', 'Maharashtra Pollution Control Board (MPCB) continuous stations', 'Low-cost sensor networks'],
      seasonalWindow: 'Mid-October through late February.'
    },

    // 3. Potential Health Impact
    potentialHealthImpact: {
      acuteEffects: [
        'Acute exacerbations of Bronchial Asthma and Chronic Obstructive Pulmonary Disease (COPD)',
        'Severe allergic rhinitis, acute bronchitis, and conjunctival irritation ("Pune Winter Cough")',
        'Transient systemic endothelial dysfunction triggering sudden acute myocardial infarctions'
      ],
      chronicExacerbations: [
        'Stunted lung volume development (FEV1 reduction) in school children residing near high-traffic corridors',
        'Accelerated atherosclerosis, hypertension, and heightened long-term stroke risk',
        'Low birth-weight and pre-term birth risks in pregnant mothers exposed to elevated PM2.5'
      ],
      estimatedHospitalizationImpact: '+22% rise in pediatric nebulization visits at Sassoon and private clinics during inversion weeks.'
    },

    // 4. Affected Population
    affectedPopulation: {
      primaryGroups: [
        {
          group: 'Children & School Students',
          description: 'Higher respiratory frequency and undeveloped alveoli; high exposure during early-morning outdoor school assemblies.'
        },
        {
          group: 'Asthma & COPD Patients',
          description: 'Over 280,000 diagnosed chronic respiratory patients in Pune urban agglomeration.'
        },
        {
          group: 'Traffic Police & Street Hawkers',
          description: 'Personnel stationed continuously at high-emission junctions like Swargate, Nal Stop, and Pune Station.'
        },
        {
          group: 'Morning Walkers & Athletes',
          description: 'Exercisers breathing high volume of unconditioned particulate-laden air during dawn pollution peaks.'
        }
      ]
    },

    // 5. Why Early Awareness Matters
    earlyAwarenessMatters: {
      rationale: 'Pollution peaks follow predictable diurnal curves peaking between 6:30 AM - 9:30 AM and 7:00 PM - 10:00 PM.',
      preventiveWindow: 'Early forecast of inversion conditions allows schools to reschedule morning physical training indoors, enables asthmatics to take preventive controller inhalers, and allows civic bodies to deploy mechanical mist-cannons and dust-suppression trucks before commute hours.',
      preventedOutcomes: 'Avoids preventable ER visits, lowers peak steroid rescue medication requirements, and shields vulnerable children from irreversible alveolar damage.'
    },

    // 6. Preventive Recommendations
    preventiveRecommendations: {
      publicHealthAuthorities: [
        'Mandate mist-spraying and water washing on high-dust transit corridors (Hadapsar, Ahmednagar Road, Sinhagad Road)',
        'Issue advisories to all Pune schools to shift morning assemblies indoors when AQI > 200',
        'Equip PMC ward dispensaries with dedicated nebulizer stations and oral corticosteroid supplies',
        'Enforce zero-tolerance for leaf and municipal solid waste open burning in peripheral wards'
      ],
      citizensAndCommunities: [
        'Wear genuine N95/N99 respirators when commuting on open two-wheelers or waiting at bus junctions during peak hours',
        'Shift outdoor running/walking to late afternoons (3:00 PM - 5:30 PM) when atmospheric mixing height is at its peak',
        'Use HEPA filtration or seal windward bedroom windows during dawn hours in dense transit wards'
      ],
      hospitalsAndClinics: [
        'Stock peak-flow meters and educate patients on individualized asthma action plans',
        'Ensure hospital air intake systems utilize certified MERV-13+ or carbon scrubbing filters'
      ]
    }
  },
  {
    id: 'heavy-rainfall',
    name: 'Heavy Rainfall, Urban Flooding & Drainage Strain',
    shortName: 'Heavy Rainfall & Flooding',
    tagline: 'Monsoon cloudbursts, Mula-Mutha river swell, and drainage bottlenecks causing flash floods',
    iconName: 'CloudRain',
    accentColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    accentBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    puneContext: 'Pune’s natural drainage relies on the Mutha, Mula, and Pavana rivers plus a network of natural storm streams (nallas like Ambil Odha, Nagzari). Siltation, encroachment, and massive impervious concrete surfaces cause extreme localized inundation during cloudburst events (>65 mm/hour), particularly affecting Dhankawadi, Yerwada, and Sinhagad Road.',
    
    // 1. Climate Hazard
    climateHazard: {
      overview: 'Intense precipitation events exceeding 64.5 mm/24h (Heavy Rain) or sudden cloudburst intensities (>50 mm in 2 hours) overwhelming the municipal stormwater capacity.',
      severityLevels: [
        { level: 'Orange Warning (Heavy to Very Heavy Rain)', condition: '64.5 to 115.5 mm in 24 hours', implication: 'Waterlogging at 40+ known road underpasses; canal overflows.' },
        { level: 'Red Warning (Extremely Heavy Rain / Cloudburst)', condition: '> 115.5 mm in 24 hours or Dam discharge > 35,000 cusecs from Khadakwasla', implication: 'Flash inundation of low-lying riverbank settlements; evacuation mandatory.' },
        { level: 'Post-Flood Contamination Crisis', condition: 'Receding floodwaters with cross-contamination of municipal water mains', implication: 'Widespread outbreaks of waterborne and zoonotic pathogens (Leptospirosis).' }
      ],
      keyMetrics: [
        { label: 'Khadakwasla Dam Spill Alert', value: '25,000 cusecs' },
        { label: 'Hourly Rain Flash Flood Threshold', value: '45 mm/hr' },
        { label: 'Identified Inundation Hotspots', value: '42 Locations' }
      ]
    },

    // 2. Environmental Conditions
    environmentalConditions: {
      meteorologicalDrivers: [
        'Active offshore monsoon trough along Maharashtra coast funneling dense moisture-laden clouds into Western Ghats',
        'Downslope convergence causing localized convective thunderstorms over Pune plateau',
        'Saturated soil retention capacity in catchments upstream of Khadakwasla, Panshet, and Varasgaon dams',
        'High impervious concrete coverage causing immediate 85% surface runoff into constrained stormwater channels'
      ],
      monitoringSensors: ['IMD Doppler Radar (Mumbai/Goa coverage)', 'Irrigation Department Khadakwasla Dam telemetry sensors', 'PMC Disaster Management Cell automated river-level gauges'],
      seasonalWindow: 'Mid-June through late September; occasional cyclone-induced squalls in October.'
    },

    // 3. Potential Health Impact
    potentialHealthImpact: {
      acuteEffects: [
        'Traumatic injuries, electrocution from submerged open electrical transformers, and drowning fatalities in overflowing nallas',
        'Acute Gastrointestinal infections (Cholera, Shigellosis, viral gastroenteritis) caused by sewage-drinking water line cross-contamination',
        'Acute Leptospirosis infection through skin abrasions in contact with floodwaters carrying rodent urine'
      ],
      chronicExacerbations: [
        'Prolonged displacement trauma and post-disaster mental health depression in flooded slum settlements',
        'Secondary mold and fungal proliferation in flooded homes triggering recurrent allergic asthma and dermatological fungal infections'
      ],
      estimatedHospitalizationImpact: '+40% surge in pediatric and adult diarrheal admissions within 72 hours of major flood events.'
    },

    // 4. Affected Population
    affectedPopulation: {
      primaryGroups: [
        {
          group: 'Riverbank & Nalla Settlements',
          description: 'Over 65,000 residents living along Ambil Odha, Mutha riverbank, Shanti Nagar (Yerwada), and Pulachi Wadi.'
        },
        {
          group: 'Commuters & Transit Passengers',
          description: 'Vehicular drivers trapped at flooded subways (Shivajinagar, Sancheti underpass, Hadapsar flyover base).'
        },
        {
          group: 'Municipal Sanitation & Rescue Staff',
          description: 'Rescue workers wading through contaminated floodwaters without prophylactic antibiotic cover or boots.'
        },
        {
          group: 'Elderly & Bedridden Patients',
          description: 'Residents unable to self-evacuate from ground-floor homes during sudden nighttime dam discharges.'
        }
      ]
    },

    // 5. Why Early Awareness Matters
    earlyAwarenessMatters: {
      rationale: 'Khadakwasla dam discharge alerts provide a critical 3-to-5 hour operational window before river levels swell downstream in Pune city.',
      preventiveWindow: 'Timely predictive alerts allow the PMC Disaster Management Cell to mobilize NDRF boats, issue evacuation sirens in riverside wadas, pre-position high-capacity dewatering pumps, and instruct citizens to move to higher ground before power grids are cut.',
      preventedOutcomes: 'Eliminates drowning casualties, prevents catastrophic vehicular submergence, and enables preemptive boil-water advisories before piped water supplies become contaminated.'
    },

    // 6. Preventive Recommendations
    preventiveRecommendations: {
      publicHealthAuthorities: [
        'Pre-position mobile medical vans with Doxycycline chemoprophylaxis for Leptospirosis in flood-prone wards',
        'Superchlorinate municipal tap water supplies to 0.5 ppm residual chlorine across low-lying distribution networks',
        'Inspect and clear all 42 known drainage choke points and desilt Ambil Odha prior to peak monsoon months',
        'Establish designated flood relief shelters equipped with dry ration, baby food, clean potable water, and sanitary pads'
      ],
      citizensAndCommunities: [
        'Never wade or drive through standing floodwater; keep away from submerged electric poles, transformers, and open gutters',
        'Boil all drinking water for minimum 10 minutes or use water purification chlorine tablets post-inundation',
        'If wading through dirty water is unavoidable, wash limbs thoroughly with antiseptic soap and report any fever or body ache immediately'
      ],
      hospitalsAndClinics: [
        'Maintain emergency standby power generators situated above historical flood levels',
        'Stock oral rehydration salts, IV Ringer’s Lactate, anti-venom, and broad-spectrum antibiotics'
      ]
    }
  },
  {
    id: 'climate-sensitive-diseases',
    name: 'Climate-Sensitive Vector & Waterborne Diseases',
    shortName: 'Climate-Sensitive Diseases',
    tagline: 'Temperature-humidity microclimates accelerating Aedes mosquito replication, Dengue, and Chikungunya',
    iconName: 'Activity',
    accentColor: 'text-teal-600',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    accentBg: 'bg-teal-50',
    borderColor: 'border-teal-200',
    puneContext: 'Pune is a perennial high-burden endemic hub for Dengue and Chikungunya. Temperatures between 26°C and 32°C combined with post-rain stagnant water puddles shorten the Extrinsic Incubation Period (EIP) of the dengue virus inside Aedes aegypti mosquitoes from 14 days down to 7 days, causing explosive transmission clusters in Kasba, Kothrud, and Yerwada.',
    
    // 1. Climate Hazard
    climateHazard: {
      overview: 'Optimal meteorological suitability conditions (Mean Temp 25°C-31°C, Relative Humidity 65%-85%) sustained for >10 days, accelerating vector lifecycle and pathogen replication.',
      severityLevels: [
        { level: 'Baseline Surveillance', condition: 'Breteau Index < 5; House Index < 1%', implication: 'Sporadic vector breeding; routine larvicide monitoring.' },
        { level: 'Elevated Vector Transmission Risk', condition: 'Breteau Index 5 - 20; Humidity > 70% post-intermittent rains', implication: 'Clustered dengue/chikungunya cases; container breeding index rising rapidly.' },
        { level: 'Epidemic Outbreak Alert', condition: 'Breteau Index > 20 with viral positivity in mosquito pools', implication: 'Exponential community transmission risk; high pediatric thrombocytopenia caseload.' }
      ],
      keyMetrics: [
        { label: 'Ideal Mosquito Breeding Temp', value: '27.5°C' },
        { label: 'Extrinsic Incubation Period (EIP)', value: '7 - 9 Days' },
        { label: 'Pune Annual Dengue Caseload', value: '3,200 - 5,500' }
      ]
    },

    // 2. Environmental Conditions
    environmentalConditions: {
      meteorologicalDrivers: [
        'Intermittent wet-and-dry monsoon spells leaving clean standing water pools in domestic and peri-domestic containers',
        'Elevated average relative humidity (>65%) extending adult female mosquito lifespan and biting frequency',
        'Warmer overnight temperatures enabling active nocturnal and early morning mosquito feeding',
        'Construction site curing tanks, discarded plastic cups, and unchecked rooftop overhead tanks in rapidly expanding suburbs'
      ],
      monitoringSensors: ['PMC Vector Control Unit larval entomological surveys', 'Sentinel Hospital disease registry notifications (NVBDCP)', 'District Malaria and Vector Borne Disease Control Office'],
      seasonalWindow: 'July through November (peak transmission August-October).'
    },

    // 3. Potential Health Impact
    potentialHealthImpact: {
      acuteEffects: [
        'Dengue Fever with severe retro-orbital headache, prostrating myalgia, and bone break pain',
        'Dengue Hemorrhagic Fever (DHF) and Dengue Shock Syndrome (DSS) with severe plasma leakage, thrombocytopenia, and hemorrhagic shock',
        'Chikungunya acute polyarthralgia and debilitating joint inflammation persisting for weeks to months',
        'Waterborne Typhoid and Hepatitis A/E from seasonal water distribution pipeline pressure drops'
      ],
      chronicExacerbations: [
        'Post-Chikungunya chronic inflammatory arthropathy causing severe long-term disability in elderly patients',
        'Economic loss from prolonged work absenteeism among informal household breadwinners'
      ],
      estimatedHospitalizationImpact: '+35% bed occupancy in pediatric wards during peak September vector transmission spikes.'
    },

    // 4. Affected Population
    affectedPopulation: {
      primaryGroups: [
        {
          group: 'Residents in Multi-Storey Apartments & Bungalows',
          description: 'Aedes aegypti breeds indoors in domestic flower vases, refrigerator drip trays, and unsealed terraces regardless of socioeconomic status.'
        },
        {
          group: 'School Children',
          description: 'Daytime-biting vector habit exposes children wearing short-sleeved school uniforms in classrooms and playgrounds.'
        },
        {
          group: 'Slum & Informal Settlement Residents',
          description: 'Uncovered domestic water storage containers necessitated by intermittent 2-hour municipal water supply schedules.'
        },
        {
          group: 'Construction Camp Workers',
          description: 'Workers sleeping in proximity to large stagnant curing water ponds and basements.'
        }
      ]
    },

    // 5. Why Early Awareness Matters
    earlyAwarenessMatters: {
      rationale: 'The lag time between environmental suitability conditions and the first cluster of hospital admissions is approximately 14 to 21 days.',
      preventiveWindow: 'Predictive surveillance allows municipal vector control staff to perform targeted indoor residual spraying (IRS), fogging, and release biological larvicides (Gambusia affinis fish / Bti) two full weeks before human clinical cases explode in hospital OPDs.',
      preventedOutcomes: 'Interrupts the exponential chain of vector-borne transmission, prevents ICU bed saturation, and avoids preventable pediatric fatalities from dengue shock syndrome.'
    },

    // 6. Preventive Recommendations
    preventiveRecommendations: {
      publicHealthAuthorities: [
        'Deploy ward-level "Dry Day" enforcement campaigns every Sunday across all 15 PMC administrative zones',
        'Mandate strict inspections and penalties for construction sites harboring stagnant water pools',
        'Ensure continuous supply of Dengue NS1 antigen and IgM ELISA test kits at all primary health centres',
        'Maintain a dynamic buffer stock of platelets and single donor platelets (SDP) across blood banks in Pune'
      ],
      citizensAndCommunities: [
        'Inspect and eliminate all indoor stagnant water sources: empty air cooler trays, plant saucers, and discarded tires weekly',
        'Keep domestic water drums and overhead sintex tanks tightly covered with mosquito-proof mesh or tight lids',
        'Apply DEET or picaridin-based mosquito repellents on exposed skin; wear full-length light clothing during daylight hours'
      ],
      hospitalsAndClinics: [
        'Implement early fluid resuscitation protocols and avoid indiscriminate prophylactic platelet transfusions',
        'Report all confirmed and suspected NS1/IgM cases into the IHIP (Integrated Health Information Platform) within 24 hours'
      ]
    }
  }
];

