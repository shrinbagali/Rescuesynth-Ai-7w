import { DisasterType, EnvironmentalInputs, DetectionRiskLevel } from '../types';
import { DetectedPattern } from './disasterPatternDetector';

export interface DisasterExplanation {
  narrative: string;
  keyFactors: string[];
  riskFactors: string[];
  safeguards: string[];
  timeline: string;
}

/**
 * Generate natural language explanations for disaster detection
 */
export function generateDisasterExplanation(
  disasterType: DisasterType | 'No Disaster Detected',
  confidence: number,
  patterns: DetectedPattern[],
  environmentalInputs: EnvironmentalInputs,
  riskLevel: DetectionRiskLevel
): DisasterExplanation {
  if (disasterType === 'No Disaster Detected') {
    return generateNormalConditionsExplanation(environmentalInputs);
  }

  const narrative = buildNarrative(
    disasterType,
    confidence,
    patterns,
    environmentalInputs
  );

  const keyFactors = extractKeyFactors(disasterType, environmentalInputs, patterns);
  const riskFactors = extractRiskFactors(disasterType, environmentalInputs, riskLevel);
  const safeguards = generateSafeguards(disasterType, riskLevel);
  const timeline = generateTimeline(disasterType, confidence);

  return {
    narrative,
    keyFactors,
    riskFactors,
    safeguards,
    timeline,
  };
}

/**
 * Build the main narrative explanation
 */
function buildNarrative(
  disasterType: DisasterType,
  confidence: number,
  patterns: DetectedPattern[],
  environmentalInputs: EnvironmentalInputs
): string {
  const patternDescriptions = patterns
    .slice(0, 2)
    .map(p => p.description)
    .join(' and ');

  const region = environmentalInputs.region;
  const confidenceText = getConfidenceText(confidence);

  let narrative = '';

  switch (disasterType) {
    case 'Cyclone':
      narrative = `Satellite imagery analysis indicates ${confidenceText} conditions for a cyclone formation in the ${region}. ${patternDescriptions}. Wind speeds are reaching critical levels with atmospheric instability becoming more pronounced. The spiral cloud formations visible in the imagery, combined with elevated sea surface temperatures and low atmospheric pressure, create ideal conditions for intensification.`;
      break;

    case 'Earthquake':
      narrative = `Seismic monitoring data combined with satellite analysis suggests ${confidenceText} risk of seismic activity in the ${region}. ${patternDescriptions}. Ground deformation patterns and recent tremor sequences indicate stress accumulation along fault lines. The region's geological vulnerability combined with detected seismic waves suggests imminent earthquake potential.`;
      break;

    case 'Flood':
      narrative = `Hydrological and remote sensing data indicate ${confidenceText} risk of flooding in the ${region}. ${patternDescriptions}. Water levels in major rivers and reservoirs are approaching critical thresholds. Saturated soil conditions combined with heavy rainfall patterns create ideal conditions for runoff concentration and downstream flooding.`;
      break;

    case 'Wildfire':
      narrative = `Fire risk assessment and thermal imagery analysis reveal ${confidenceText} conditions for wildfire in the ${region}. ${patternDescriptions}. Vegetation moisture levels are critically low while ambient temperatures remain elevated. The combination of dry biomass, hot weather, and wind conditions creates an extremely hazardous fire environment.`;
      break;

    case 'Landslide':
      narrative = `Slope stability analysis indicates ${confidenceText} conditions for landslides in the ${region}. Ground saturation levels combined with topographic vulnerability suggest increased instability risk. Recent precipitation patterns and geological composition indicate potential for mass movement events.`;
      break;
  }

  return narrative;
}

/**
 * Extract key factors contributing to the disaster
 */
function extractKeyFactors(
  disasterType: DisasterType,
  environmentalInputs: EnvironmentalInputs,
  patterns: DetectedPattern[]
): string[] {
  const factors: string[] = [];

  // Add primary pattern
  if (patterns.length > 0) {
    factors.push(`Detected Pattern: ${patterns[0].pattern.replace(/_/g, ' ')}`);
  }

  switch (disasterType) {
    case 'Cyclone':
      factors.push(`Wind Speed: ${Math.round(environmentalInputs.windSpeed)} km/h`);
      if (environmentalInputs.temperature > 25) {
        factors.push(`Sea Surface Temperature: ${Math.round(environmentalInputs.temperature)}°C`);
      }
      factors.push(`Region: ${environmentalInputs.region}`);
      break;

    case 'Earthquake':
      factors.push(`Seismic Magnitude: ${environmentalInputs.seismicActivity.toFixed(1)}`);
      factors.push(`Seismic Activity Level: ${environmentalInputs.seismicActivity > 6.0 ? 'Major' : 'Moderate'}`);
      factors.push(`Region: ${environmentalInputs.region}`);
      break;

    case 'Flood':
      factors.push(`Water Level: ${environmentalInputs.waterLevel}`);
      factors.push(`Rainfall Intensity: ${Math.round(environmentalInputs.rainfallIntensity)} mm/h`);
      factors.push(`Soil Saturation: ${environmentalInputs.soilSaturation}`);
      break;

    case 'Wildfire':
      factors.push(`Temperature: ${Math.round(environmentalInputs.temperature)}°C`);
      factors.push(`Vegetation Dryness: ${environmentalInputs.vegetationDryness}`);
      factors.push(`Wind Speed: ${Math.round(environmentalInputs.windSpeed)} km/h`);
      break;

    case 'Landslide':
      factors.push(`Soil Saturation: ${environmentalInputs.soilSaturation}`);
      factors.push(`Rainfall: ${Math.round(environmentalInputs.rainfallIntensity)} mm/h`);
      break;
  }

  return factors;
}

/**
 * Extract risk factors that amplify the disaster risk
 */
function extractRiskFactors(
  disasterType: DisasterType,
  environmentalInputs: EnvironmentalInputs,
  riskLevel: DetectionRiskLevel
): string[] {
  const factors: string[] = [];

  if (riskLevel === 'High Risk' || riskLevel === 'Severe Risk') {
    factors.push('High population density in affected area');
    factors.push('Critical infrastructure vulnerable');
  }

  switch (disasterType) {
    case 'Cyclone':
      if (environmentalInputs.windSpeed > 150) {
        factors.push('Extreme wind speeds - catastrophic damage potential');
      }
      factors.push('Coastal vulnerability');
      break;

    case 'Earthquake':
      if (environmentalInputs.seismicActivity > 6.5) {
        factors.push('High magnitude - major damage potential');
      }
      factors.push('Building structure vulnerability');
      break;

    case 'Flood':
      if (environmentalInputs.waterLevel === 'High') {
        factors.push('Water levels at critical thresholds');
      }
      factors.push('Low-lying area vulnerability');
      break;

    case 'Wildfire':
      if (environmentalInputs.vegetationDryness === 'High') {
        factors.push('Extreme vegetation dryness');
      }
      factors.push('Limited visibility from smoke');
      break;

    case 'Landslide':
      factors.push('Steep terrain instability');
      break;
  }

  return factors;
}

/**
 * Generate specific safeguards for the disaster type
 */
function generateSafeguards(
  disasterType: DisasterType,
  riskLevel: DetectionRiskLevel
): string[] {
  const safeguards: string[] = [];

  const urgency = riskLevel === 'Severe Risk' ? 'IMMEDIATE' : 'URGENT';

  switch (disasterType) {
    case 'Cyclone':
      safeguards.push(`${urgency}: Secure all outdoor structures`);
      safeguards.push('Stock emergency supplies for 3+ days');
      safeguards.push('Ensure backup power systems operational');
      safeguards.push('Activate cyclone shelters');
      break;

    case 'Earthquake':
      safeguards.push(`${urgency}: Move to open ground away from buildings`);
      safeguards.push('Establish emergency assembly points');
      safeguards.push('Activate search and rescue teams');
      safeguards.push('Set up field medical facilities');
      break;

    case 'Flood':
      safeguards.push(`${urgency}: Evacuate to higher elevations`);
      safeguards.push('Do not attempt to cross flood waters');
      safeguards.push('Deploy water rescue equipment');
      safeguards.push('Set up emergency shelters at elevated locations');
      break;

    case 'Wildfire':
      safeguards.push(`${urgency}: Evacuate to designated safe zones`);
      safeguards.push('Distribute air quality masks');
      safeguards.push('Clear firebreaks and defensible spaces');
      safeguards.push('Position firefighting units strategically');
      break;

    case 'Landslide':
      safeguards.push(`${urgency}: Evacuate affected slopes`);
      safeguards.push('Monitor for ground deformation');
      safeguards.push('Deploy slope stabilization equipment');
      break;
  }

  return safeguards;
}

/**
 * Generate timeline for expected impact
 */
function generateTimeline(
  disasterType: DisasterType,
  confidence: number
): string {
  let hours = 0;

  if (confidence > 80) {
    hours = 2; // Imminent
  } else if (confidence > 60) {
    hours = 6; // Within hours
  } else if (confidence > 40) {
    hours = 12; // Within half day
  } else {
    hours = 24; // Within day
  }

  switch (disasterType) {
    case 'Cyclone':
      return `Expected impact within ${hours} hours. Monitor for rapid intensification.`;
    case 'Earthquake':
      return `Tremors may begin within ${Math.max(1, Math.round(hours / 6))} to ${Math.round(hours / 3)} hours. Aftershocks likely.`;
    case 'Flood':
      return `Peak flow expected within ${hours} to ${hours + 6} hours. Water levels will peak gradually.`;
    case 'Wildfire':
      return `Fire progression rate dependent on wind. Rapid spread possible within ${Math.max(1, Math.round(hours / 6))} hours.`;
    case 'Landslide':
      return `Potential occurrence within ${hours} to ${hours + 12} hours. Monitor continuously.`;
  }
}

/**
 * Get confidence text for narrative
 */
function getConfidenceText(confidence: number): string {
  if (confidence > 85) return 'critical';
  if (confidence > 70) return 'very high';
  if (confidence > 55) return 'high';
  if (confidence > 40) return 'moderate';
  return 'low to moderate';
}

/**
 * Generate explanation for normal conditions
 */
function generateNormalConditionsExplanation(
  environmentalInputs: EnvironmentalInputs
): DisasterExplanation {
  return {
    narrative: `Environmental conditions in the ${environmentalInputs.region} remain within normal parameters. Current temperature, precipitation, wind speeds, and seismic activity do not indicate imminent disaster risk. Continue routine monitoring protocols.`,
    keyFactors: [
      `Temperature: ${Math.round(environmentalInputs.temperature)}°C`,
      `Wind Speed: ${Math.round(environmentalInputs.windSpeed)} km/h`,
      `Rainfall: ${Math.round(environmentalInputs.rainfallIntensity)} mm/h`,
      `Seismic Activity: ${environmentalInputs.seismicActivity.toFixed(1)}`,
    ],
    riskFactors: ['No significant risk factors detected'],
    safeguards: ['Continue standard monitoring', 'Maintain regular preventive measures'],
    timeline: 'No imminent threat expected. Maintain alert readiness.',
  };
}
