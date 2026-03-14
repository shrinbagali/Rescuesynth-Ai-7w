/**
 * Specialized dual earthquake and cyclone detection library
 * Optimized for real-time monitoring with memoized calculations
 */

export interface EnvironmentalReading {
  magnitude: number; // Seismic magnitude (0-9)
  groundAcceleration: number; // m/s² (0-1000)
  epicenterDepth: number; // km (0-700)
  windSpeed: number; // km/h (0-300)
  atmosphericPressure: number; // hPa (900-1050)
  rainfall: number; // mm (0-500)
  humidity: number; // % (0-100)
  temperature: number; // °C (-50-60)
  timestamp: Date;
}

export interface EarthquakeDetection {
  detected: boolean;
  magnitude: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  confidence: number;
  explanation: string;
  triggeredBy: string[];
}

export interface CycloneDetection {
  detected: boolean;
  windSpeed: number;
  pressure: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  confidence: number;
  explanation: string;
  triggeredBy: string[];
}

export interface Prediction {
  timeframe: '+2h' | '+6h' | '+12h';
  riskScore: number;
  expectedMagnitude?: number;
  expectedWindSpeed?: number;
  description: string;
}

export interface RiskScoring {
  overallScore: number; // 0-100
  earthquakeScore: number; // 0-100
  cycloneScore: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  predictions: Prediction[];
  aiExplanation: string;
}

export interface DualDetectionResult {
  earthquake: EarthquakeDetection;
  cyclone: CycloneDetection;
  activeAlert: 'earthquake' | 'cyclone' | 'both' | 'none';
  riskScoring: RiskScoring;
  timestamp: Date;
}

/**
 * Detect earthquake based on magnitude and ground acceleration
 * Threshold: Magnitude > 5.5
 */
export const detectEarthquake = (reading: EnvironmentalReading): EarthquakeDetection => {
  const magnitude = reading.magnitude;
  const groundAccel = reading.groundAcceleration;
  const depth = reading.epicenterDepth;

  const detected = magnitude > 5.5;
  const triggeredBy: string[] = [];

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let confidence = 0;

  if (detected) {
    // Determine risk level based on magnitude
    if (magnitude > 7.5) {
      riskLevel = 'Severe';
      confidence = 0.98;
      triggeredBy.push(`Extreme magnitude: ${magnitude.toFixed(2)}`);
    } else if (magnitude > 6.5) {
      riskLevel = 'High';
      confidence = 0.95;
      triggeredBy.push(`High magnitude: ${magnitude.toFixed(2)}`);
    } else if (magnitude > 5.8) {
      riskLevel = 'Moderate';
      confidence = 0.88;
      triggeredBy.push(`Moderate magnitude: ${magnitude.toFixed(2)}`);
    } else {
      riskLevel = 'Low';
      confidence = 0.78;
      triggeredBy.push(`Detected magnitude: ${magnitude.toFixed(2)}`);
    }

    // Increase confidence if high ground acceleration
    if (groundAccel > 500) {
      confidence = Math.min(0.99, confidence + 0.05);
      triggeredBy.push(`High ground acceleration: ${groundAccel.toFixed(0)} m/s²`);
    }

    // Shallow depth increases severity
    if (depth < 70 && depth > 0) {
      riskLevel = riskLevel === 'Low' ? 'Moderate' : riskLevel;
      triggeredBy.push(`Shallow epicenter: ${depth.toFixed(0)} km`);
    }
  }

  const explanation = generateEarthquakeExplanation(magnitude, riskLevel, groundAccel, depth);

  return {
    detected,
    magnitude,
    riskLevel,
    confidence,
    explanation,
    triggeredBy,
  };
};

/**
 * Detect cyclone based on wind speed AND pressure drop
 * Threshold: Wind > 120 km/h + Pressure < 950 hPa
 */
export const detectCyclone = (reading: EnvironmentalReading): CycloneDetection => {
  const windSpeed = reading.windSpeed;
  const pressure = reading.atmosphericPressure;
  const rainfall = reading.rainfall;

  // Multi-parameter validation: wind AND pressure
  const windThreshold = windSpeed > 120;
  const pressureThreshold = pressure < 950;
  const detected = windThreshold && pressureThreshold;

  const triggeredBy: string[] = [];

  let riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let confidence = 0;

  if (detected) {
    // Determine risk level based on wind speed
    if (windSpeed > 200 || pressure < 920) {
      riskLevel = 'Severe';
      confidence = 0.98;
      triggeredBy.push(`Extreme wind: ${windSpeed.toFixed(0)} km/h`);
    } else if (windSpeed > 160 || pressure < 935) {
      riskLevel = 'High';
      confidence = 0.95;
      triggeredBy.push(`High wind: ${windSpeed.toFixed(0)} km/h`);
    } else if (windSpeed > 120 || pressure < 950) {
      riskLevel = 'Moderate';
      confidence = 0.88;
      triggeredBy.push(`Cyclone wind: ${windSpeed.toFixed(0)} km/h`);
    }

    // Add pressure observation
    triggeredBy.push(`Pressure drop: ${pressure.toFixed(0)} hPa`);

    // Heavy rainfall amplifies risk
    if (rainfall > 200) {
      riskLevel = riskLevel === 'Moderate' ? 'High' : riskLevel;
      triggeredBy.push(`Heavy rainfall: ${rainfall.toFixed(0)} mm`);
    }
  }

  const explanation = generateCycloneExplanation(windSpeed, pressure, rainfall, riskLevel);

  return {
    detected,
    windSpeed,
    pressure,
    riskLevel,
    confidence,
    explanation,
    triggeredBy,
  };
};

/**
 * Calculate AI risk score (0-100) based on environmental parameters
 */
const calculateRiskScore = (reading: EnvironmentalReading, earthquake: EarthquakeDetection, cyclone: CycloneDetection): number => {
  let score = 0;

  // Earthquake component (0-50 points)
  if (earthquake.detected) {
    const magScore = Math.min(50, (reading.magnitude / 9) * 50);
    const accelScore = Math.min(10, (reading.groundAcceleration / 1000) * 10);
    score += Math.max(magScore, accelScore);
  }

  // Cyclone component (0-50 points)
  if (cyclone.detected) {
    const windScore = Math.min(50, (reading.windSpeed / 300) * 50);
    const pressureScore = Math.min(10, ((1050 - reading.atmosphericPressure) / 150) * 10);
    const rainfallScore = Math.min(5, (reading.rainfall / 500) * 5);
    score += Math.max(windScore, pressureScore) + rainfallScore;
  }

  // Cap at 100
  return Math.min(100, score);
};

/**
 * Calculate individual disaster scores
 */
const calculateDisasterScores = (reading: EnvironmentalReading): { earthquakeScore: number; cycloneScore: number } => {
  const earthquakeScore = Math.min(100, (reading.magnitude / 9) * 100);
  const cycloneScore = Math.min(100, (reading.windSpeed / 300) * 100);
  return { earthquakeScore, cycloneScore };
};

/**
 * Determine risk level from score
 */
const getRiskLevelFromScore = (score: number): 'Low' | 'Moderate' | 'High' | 'Critical' => {
  if (score >= 75) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 25) return 'Moderate';
  return 'Low';
};

/**
 * Generate AI-style explanation for current state
 */
const generateAIExplanation = (
  reading: EnvironmentalReading,
  earthquake: EarthquakeDetection,
  cyclone: CycloneDetection,
  riskScore: number
): string => {
  const riskLevel = getRiskLevelFromScore(riskScore);
  
  if (riskScore < 25) {
    return 'Environmental conditions stable. No significant disaster threats detected. Routine monitoring continues.';
  }

  let explanation = `Current risk assessment: ${riskLevel.toUpperCase()}. `;

  if (earthquake.detected) {
    explanation += `Seismic activity detected at magnitude ${reading.magnitude.toFixed(1)} with ${earthquake.riskLevel} risk. `;
  }

  if (cyclone.detected) {
    explanation += `Cyclonic system detected with wind speeds at ${reading.windSpeed.toFixed(0)} km/h and ${cyclone.riskLevel} risk. `;
  }

  explanation += 'Enhanced monitoring and preparedness protocols recommended.';

  return explanation;
};

/**
 * Generate prediction timeline for next 2h, 6h, 12h
 */
const generatePredictions = (reading: EnvironmentalReading, riskScore: number): Prediction[] => {
  const predictions: Prediction[] = [];
  
  // 2-hour prediction
  predictions.push({
    timeframe: '+2h',
    riskScore: Math.min(100, riskScore + (Math.random() * 10 - 5)),
    expectedMagnitude: reading.magnitude + (Math.random() * 0.5 - 0.25),
    expectedWindSpeed: reading.windSpeed + (Math.random() * 5 - 2.5),
    description: riskScore > 40 ? 'Conditions may intensify slightly' : 'Stable conditions expected',
  });

  // 6-hour prediction
  predictions.push({
    timeframe: '+6h',
    riskScore: Math.min(100, riskScore + (Math.random() * 20 - 10)),
    expectedMagnitude: reading.magnitude + (Math.random() * 1 - 0.5),
    expectedWindSpeed: reading.windSpeed + (Math.random() * 15 - 7.5),
    description: riskScore > 50 ? 'Risk may continue to rise' : 'Gradual improvement expected',
  });

  // 12-hour prediction
  predictions.push({
    timeframe: '+12h',
    riskScore: Math.max(0, riskScore + (Math.random() * 30 - 15)),
    expectedMagnitude: reading.magnitude + (Math.random() * 1.5 - 0.75),
    expectedWindSpeed: reading.windSpeed + (Math.random() * 25 - 12.5),
    description: riskScore > 50 ? 'Conditions may persist or evolve' : 'Return to baseline conditions',
  });

  return predictions;
};

/**
 * Combined dual disaster detection with risk scoring
 */
export const detectDisasters = (reading: EnvironmentalReading): DualDetectionResult => {
  const earthquake = detectEarthquake(reading);
  const cyclone = detectCyclone(reading);

  // Calculate risk scores
  const overallScore = calculateRiskScore(reading, earthquake, cyclone);
  const { earthquakeScore, cycloneScore } = calculateDisasterScores(reading);
  const riskLevel = getRiskLevelFromScore(overallScore);

  // Generate predictions
  const predictions = generatePredictions(reading, overallScore);

  // Generate AI explanation
  const aiExplanation = generateAIExplanation(reading, earthquake, cyclone, overallScore);

  // Determine which alert is active (prioritize by severity)
  let activeAlert: 'earthquake' | 'cyclone' | 'both' | 'none' = 'none';
  if (earthquake.detected && cyclone.detected) {
    activeAlert = 'both';
  } else if (earthquake.detected) {
    activeAlert = 'earthquake';
  } else if (cyclone.detected) {
    activeAlert = 'cyclone';
  }

  return {
    earthquake,
    cyclone,
    activeAlert,
    riskScoring: {
      overallScore: Math.round(overallScore * 10) / 10,
      earthquakeScore: Math.round(earthquakeScore * 10) / 10,
      cycloneScore: Math.round(cycloneScore * 10) / 10,
      riskLevel,
      predictions,
      aiExplanation,
    },
    timestamp: reading.timestamp,
  };
};

/**
 * Generate natural language explanation for earthquake
 */
const generateEarthquakeExplanation = (
  magnitude: number,
  riskLevel: string,
  groundAccel: number,
  depth: number
): string => {
  if (magnitude <= 5.5) {
    return 'Seismic activity within normal ranges. No significant earthquake detected.';
  }

  const riskText = riskLevel.toLowerCase();
  const depthText = depth < 70 ? 'shallow and potentially damaging' : 'deep with reduced surface impact';

  return `Earthquake detected with ${riskText} risk at magnitude ${magnitude.toFixed(2)}. Ground acceleration: ${groundAccel.toFixed(0)} m/s². Epicenter is ${depthText} at ${depth.toFixed(0)} km depth. Immediate monitoring and emergency preparedness recommended.`;
};

/**
 * Generate natural language explanation for cyclone
 */
const generateCycloneExplanation = (
  windSpeed: number,
  pressure: number,
  rainfall: number,
  riskLevel: string
): string => {
  if (windSpeed <= 120) {
    return 'Wind speeds within normal ranges. No cyclone threat detected.';
  }

  const riskText = riskLevel.toLowerCase();
  const rainNote = rainfall > 100 ? `with heavy rainfall of ${rainfall.toFixed(0)} mm` : '';

  return `Cyclone detected with ${riskText} risk. Wind speeds at ${windSpeed.toFixed(0)} km/h and atmospheric pressure of ${pressure.toFixed(0)} hPa ${rainNote}. High impact on coastal and low-lying areas. Immediate evacuation and shelter protocols recommended.`;
};

/**
 * Memoized detection cache for performance
 */
let lastReading: EnvironmentalReading | null = null;
let lastResult: DualDetectionResult | null = null;
let detectionCache = new Map<string, DualDetectionResult>();

export const memoizedDetect = (reading: EnvironmentalReading): DualDetectionResult => {
  // Create simple cache key from critical parameters
  const cacheKey = `${reading.magnitude.toFixed(2)}-${reading.windSpeed.toFixed(2)}-${reading.atmosphericPressure.toFixed(2)}`;
  
  // Check if we have this exact reading cached
  if (detectionCache.has(cacheKey)) {
    return detectionCache.get(cacheKey)!;
  }

  const result = detectDisasters(reading);
  
  // Store in cache (limit cache size to 100 entries)
  if (detectionCache.size > 100) {
    const firstKey = detectionCache.keys().next().value;
    detectionCache.delete(firstKey);
  }
  
  detectionCache.set(cacheKey, result);
  lastReading = reading;
  lastResult = result;
  return result;
};
