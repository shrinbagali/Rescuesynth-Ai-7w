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

export interface DualDetectionResult {
  earthquake: EarthquakeDetection;
  cyclone: CycloneDetection;
  activeAlert: 'earthquake' | 'cyclone' | 'both' | 'none';
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
 * Combined dual disaster detection
 */
export const detectDisasters = (reading: EnvironmentalReading): DualDetectionResult => {
  const earthquake = detectEarthquake(reading);
  const cyclone = detectCyclone(reading);

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

export const memoizedDetect = (reading: EnvironmentalReading): DualDetectionResult => {
  if (lastReading && JSON.stringify(lastReading) === JSON.stringify(reading)) {
    return lastResult!;
  }

  const result = detectDisasters(reading);
  lastReading = reading;
  lastResult = result;
  return result;
};
