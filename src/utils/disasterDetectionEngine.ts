import { MonitoringEnvironmentalData, DisasterType, DetectionRiskLevel } from '../types';

export interface DetectionResult {
  disasterDetected: boolean;
  disasterType: DisasterType | 'No Disaster Detected';
  riskLevel: DetectionRiskLevel;
  confidence: number;
  reasoning: string;
}

/**
 * Core disaster detection engine with specific thresholds for each disaster type
 */
export const detectDisaster = (
  environmentalData: MonitoringEnvironmentalData
): DetectionResult => {
  // Check for Earthquake (magnitude > 5.5)
  const earthquakeDetection = detectEarthquake(environmentalData);
  if (earthquakeDetection.disasterDetected) return earthquakeDetection;

  // Check for Cyclone (wind > 120 km/h AND pressure < 950 hPa)
  const cycloneDetection = detectCyclone(environmentalData);
  if (cycloneDetection.disasterDetected) return cycloneDetection;

  // Check for Flood (rainfall > 200mm AND water level high)
  const floodDetection = detectFlood(environmentalData);
  if (floodDetection.disasterDetected) return floodDetection;

  // Check for Wildfire (temp > 38°C AND humidity < 30% AND dryness high)
  const wildfireDetection = detectWildfire(environmentalData);
  if (wildfireDetection.disasterDetected) return wildfireDetection;

  // Check for Landslide (heavy rainfall + high soil saturation + mountain terrain)
  const landslideDetection = detectLandslide(environmentalData);
  if (landslideDetection.disasterDetected) return landslideDetection;

  // No disaster detected
  return {
    disasterDetected: false,
    disasterType: 'No Disaster Detected',
    riskLevel: 'Low Risk',
    confidence: 0.95,
    reasoning: 'All environmental parameters within normal safe ranges.',
  };
};

const detectEarthquake = (data: MonitoringEnvironmentalData): DetectionResult => {
  const seismicActivity = data.seismicActivity || 0;
  const groundAcceleration = data.groundAcceleration || 0;
  const depth = data.earthquakeDepth || 0;

  // Earthquake magnitude equivalent thresholds
  if (seismicActivity > 5.5) {
    let riskLevel: DetectionRiskLevel = 'Low Risk';
    let confidence = 0;

    if (seismicActivity > 7.5) {
      riskLevel = 'Severe Risk';
      confidence = 0.95;
    } else if (seismicActivity > 6.5) {
      riskLevel = 'High Risk';
      confidence = 0.90;
    } else if (seismicActivity > 5.8) {
      riskLevel = 'Moderate Risk';
      confidence = 0.85;
    } else {
      riskLevel = 'Low Risk';
      confidence = 0.75;
    }

    return {
      disasterDetected: true,
      disasterType: 'Earthquake',
      riskLevel,
      confidence,
      reasoning: `Seismic activity at magnitude ${seismicActivity} detected. Ground acceleration: ${groundAcceleration} m/s². Epicenter depth: ${depth} km. Immediate monitoring required.`,
    };
  }

  return {
    disasterDetected: false,
    disasterType: 'No Disaster Detected',
    riskLevel: 'Low Risk',
    confidence: 0.9,
    reasoning: 'Seismic activity below threshold.',
  };
};

const detectCyclone = (data: MonitoringEnvironmentalData): DetectionResult => {
  const windSpeed = data.windSpeed || 0;
  const pressure = data.atmosphericPressure || 1013;
  const rainfallIntensity = data.rainfallIntensity || 0;
  const cloudPattern = data.cloudPattern || 'none';

  // Cyclone thresholds: wind > 120 km/h, pressure < 950 hPa
  if (windSpeed > 120 || (pressure < 950 && windSpeed > 100)) {
    let riskLevel: DetectionRiskLevel = 'Moderate Risk';
    let confidence = 0;

    if (windSpeed > 200 || pressure < 920) {
      riskLevel = 'Severe Risk';
      confidence = 0.95;
    } else if (windSpeed > 150 || pressure < 935) {
      riskLevel = 'High Risk';
      confidence = 0.90;
    } else {
      riskLevel = 'Moderate Risk';
      confidence = 0.85;
    }

    // Bonus confidence for organized cloud pattern
    if (cloudPattern === 'spiral' || cloudPattern === 'eye') {
      confidence = Math.min(0.99, confidence + 0.05);
    }

    return {
      disasterDetected: true,
      disasterType: 'Cyclone',
      riskLevel,
      confidence,
      reasoning: `Cyclone system detected. Wind speed: ${windSpeed} km/h. Atmospheric pressure: ${pressure} hPa. Rainfall intensity: ${rainfallIntensity} mm. Cloud structure: ${cloudPattern}. Coastal impact expected.`,
    };
  }

  return {
    disasterDetected: false,
    disasterType: 'No Disaster Detected',
    riskLevel: 'Low Risk',
    confidence: 0.9,
    reasoning: 'Wind and pressure parameters below cyclone thresholds.',
  };
};

const detectFlood = (data: MonitoringEnvironmentalData): DetectionResult => {
  const rainfall = data.rainfall || 0;
  const rainfallIntensity = data.rainfallIntensity || 0;
  const riverLevel = data.riverLevel || 'Low';
  const soilSaturation = data.soilSaturation || 0;

  // Flood thresholds: rainfall > 200mm OR high water level + saturation
  const cumulativeRainfall = rainfall + (rainfallIntensity * 6); // 6-hour projection
  const waterLevelScore = riverLevel === 'Critical' ? 3 : riverLevel === 'High' ? 2 : riverLevel === 'Medium' ? 1 : 0;
  const saturationFactor = soilSaturation > 70 ? 1.3 : 1;

  if (cumulativeRainfall > 200 || (waterLevelScore >= 2 && soilSaturation > 50)) {
    let riskLevel: DetectionRiskLevel = 'Low Risk';
    let confidence = 0;

    if (riverLevel === 'Critical' && soilSaturation > 80) {
      riskLevel = 'Severe Risk';
      confidence = 0.95;
    } else if (cumulativeRainfall > 400 || (riverLevel === 'High' && soilSaturation > 70)) {
      riskLevel = 'High Risk';
      confidence = 0.90;
    } else if (cumulativeRainfall > 250 || riverLevel === 'High') {
      riskLevel = 'Moderate Risk';
      confidence = 0.85;
    } else {
      riskLevel = 'Low Risk';
      confidence = 0.75;
    }

    return {
      disasterDetected: true,
      disasterType: 'Flood',
      riskLevel,
      confidence,
      reasoning: `Flood conditions detected. Cumulative rainfall: ${cumulativeRainfall.toFixed(1)} mm. River level: ${riverLevel}. Soil saturation: ${soilSaturation}%. Downstream impact likely.`,
    };
  }

  return {
    disasterDetected: false,
    disasterType: 'No Disaster Detected',
    riskLevel: 'Low Risk',
    confidence: 0.9,
    reasoning: 'Rainfall and water levels below flood thresholds.',
  };
};

const detectWildfire = (data: MonitoringEnvironmentalData): DetectionResult => {
  const temperature = data.temperature || 0;
  const humidity = data.humidity || 100;
  const drynessIndex = data.drynessIndex || 'Low';
  const windSpeed = data.windSpeed || 0;

  // Wildfire thresholds: temp > 38°C AND humidity < 30% AND dryness index high
  const drynessScore = drynessIndex === 'High' ? 3 : drynessIndex === 'Medium' ? 2 : 1;

  if (temperature > 38 && humidity < 30 && drynessScore >= 2) {
    let riskLevel: DetectionRiskLevel = 'Low Risk';
    let confidence = 0;

    if (temperature > 45 && humidity < 15 && drynessScore === 3 && windSpeed > 40) {
      riskLevel = 'Severe Risk';
      confidence = 0.95;
    } else if (temperature > 42 && humidity < 20 && drynessScore === 3) {
      riskLevel = 'High Risk';
      confidence = 0.90;
    } else if (temperature > 40 && humidity < 25) {
      riskLevel = 'Moderate Risk';
      confidence = 0.85;
    } else {
      riskLevel = 'Low Risk';
      confidence = 0.75;
    }

    return {
      disasterDetected: true,
      disasterType: 'Wildfire',
      riskLevel,
      confidence,
      reasoning: `Wildfire risk detected. Temperature: ${temperature}°C. Humidity: ${humidity}%. Vegetation dryness: ${drynessIndex}. Wind speed: ${windSpeed} km/h. High fire spread potential.`,
    };
  }

  return {
    disasterDetected: false,
    disasterType: 'No Disaster Detected',
    riskLevel: 'Low Risk',
    confidence: 0.9,
    reasoning: 'Temperature, humidity, and dryness parameters below wildfire thresholds.',
  };
};

const detectLandslide = (data: MonitoringEnvironmentalData): DetectionResult => {
  const rainfall = data.rainfall || 0;
  const rainfallIntensity = data.rainfallIntensity || 0;
  const soilSaturation = data.soilSaturation || 0;
  const temperature = data.temperature || 25;

  // Landslide thresholds: heavy rainfall + high soil saturation + mountain terrain (assumed)
  const cumulativeRainfall = rainfall + (rainfallIntensity * 6);

  if (cumulativeRainfall > 150 && soilSaturation > 70) {
    let riskLevel: DetectionRiskLevel = 'Low Risk';
    let confidence = 0;

    if (cumulativeRainfall > 350 && soilSaturation > 85) {
      riskLevel = 'Severe Risk';
      confidence = 0.95;
    } else if (cumulativeRainfall > 250 && soilSaturation > 80) {
      riskLevel = 'High Risk';
      confidence = 0.90;
    } else if (cumulativeRainfall > 200 && soilSaturation > 75) {
      riskLevel = 'Moderate Risk';
      confidence = 0.85;
    } else {
      riskLevel = 'Low Risk';
      confidence = 0.75;
    }

    return {
      disasterDetected: true,
      disasterType: 'Landslide',
      riskLevel,
      confidence,
      reasoning: `Landslide conditions detected. Cumulative rainfall: ${cumulativeRainfall.toFixed(1)} mm. Soil saturation: ${soilSaturation}%. Mountain terrain increases failure risk. Slope stability compromised.`,
    };
  }

  return {
    disasterDetected: false,
    disasterType: 'No Disaster Detected',
    riskLevel: 'Low Risk',
    confidence: 0.9,
    reasoning: 'Rainfall and saturation levels below landslide thresholds.',
  };
};
