import { MonitoringEnvironmentalData, DisasterType, DetectionRiskLevel } from '../types';

export interface LLMExplanation {
  id: string;
  summary: string;
  keyFactors: string[];
  riskAmplifiers: string[];
  safeguards: string[];
  recommendations: string[];
  timelineWarning: string;
  timestamp: Date;
}

/**
 * Simulates an LLM generating natural language explanations
 * based on environmental data and detected disaster patterns
 */
export const generateLLMExplanation = (
  disasterType: DisasterType,
  region: string,
  environmentalData: MonitoringEnvironmentalData,
  riskLevel: DetectionRiskLevel
): LLMExplanation => {
  const id = `llm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date();

  let summary = '';
  let keyFactors: string[] = [];
  let riskAmplifiers: string[] = [];
  let recommendations: string[] = [];
  let timelineWarning = '';

  switch (disasterType) {
    case 'Earthquake':
      summary = generateEarthquakeSummary(environmentalData, riskLevel);
      keyFactors = [
        `Seismic Activity: ${environmentalData.seismicActivity || 0} (Richter scale reference)`,
        `Ground Acceleration: ${environmentalData.groundAcceleration || 0} m/s²`,
        `Epicenter Depth: ${environmentalData.earthquakeDepth || 0} km`,
        `Local Time: ${new Date().toLocaleTimeString()}`,
      ];
      riskAmplifiers = [
        'Urban infrastructure concentration',
        'Population density in seismic zone',
        'Older building stock vulnerable to seismic activity',
        'Proximity to fault lines',
      ];
      recommendations = [
        'Activate emergency response protocols immediately',
        'Deploy medical teams to high-density areas',
        'Initiate structural damage assessment',
        'Prepare evacuation routes for aftershock zones',
      ];
      timelineWarning = 'Aftershocks likely within 24-72 hours';
      break;

    case 'Cyclone':
      summary = generateCycloneSummary(environmentalData, riskLevel);
      keyFactors = [
        `Wind Speed: ${environmentalData.windSpeed || 0} km/h`,
        `Atmospheric Pressure: ${environmentalData.atmosphericPressure || 0} hPa`,
        `Sea Surface Temperature: ${environmentalData.seaSurfaceTemp || 0}°C`,
        `Cloud Pattern: ${environmentalData.cloudPattern || 'none'}`,
      ];
      riskAmplifiers = [
        'Storm surge potential in coastal areas',
        'Heavy rainfall leading to inland flooding',
        'Wind damage to infrastructure',
        'Disruption to transportation and utilities',
      ];
      recommendations = [
        'Issue cyclone warning to coastal populations',
        'Pre-position emergency supplies',
        'Secure loose structures and vegetation',
        'Establish storm shelters for vulnerable populations',
      ];
      timelineWarning = 'Peak intensity expected in 12-24 hours';
      break;

    case 'Flood':
      summary = generateFloodSummary(environmentalData, riskLevel);
      keyFactors = [
        `Rainfall: ${environmentalData.rainfall || 0} mm`,
        `Water Level: ${environmentalData.riverLevel || 'Low'}`,
        `Soil Saturation: ${environmentalData.soilSaturation || 0}%`,
        `Temperature: ${environmentalData.temperature || 0}°C`,
      ];
      riskAmplifiers = [
        'Saturation reduces water absorption capacity',
        'Urban impervious surfaces increase runoff',
        'Low-lying areas prone to inundation',
        'Potential for dam overflow',
      ];
      recommendations = [
        'Monitor river levels continuously',
        'Issue flood warnings to downstream communities',
        'Prepare evacuation zones in low-lying areas',
        'Stage emergency rescue equipment',
      ];
      timelineWarning = 'Flood peak expected in 6-18 hours';
      break;

    case 'Wildfire':
      summary = generateWildfireSummary(environmentalData, riskLevel);
      keyFactors = [
        `Temperature: ${environmentalData.temperature || 0}°C`,
        `Vegetation Dryness Index: ${environmentalData.drynessIndex || 'Low'}`,
        `Wind Speed: ${environmentalData.windSpeed || 0} km/h`,
        `Humidity: ${environmentalData.humidity || 0}%`,
      ];
      riskAmplifiers = [
        'Low moisture in vegetation fuels rapid fire spread',
        'Wind accelerates fire advancement',
        'Dry conditions reduce natural fire resistance',
        'Proximity to populated areas increases impact',
      ];
      recommendations = [
        'Deploy firefighting resources to high-risk zones',
        'Issue air quality warnings for surrounding areas',
        'Prepare evacuation protocols for nearby communities',
        'Increase water resource allocation',
      ];
      timelineWarning = 'Fire advancement possible within 2-4 hours';
      break;

    case 'Landslide':
      summary = generateLandslideSummary(environmentalData, riskLevel);
      keyFactors = [
        `Soil Saturation: ${environmentalData.soilSaturation || 0}%`,
        `Rainfall Intensity: ${environmentalData.rainfall || 0} mm`,
        `Temperature Gradient: ${environmentalData.temperature || 0}°C`,
        `Terrain Classification: Himalayan/Mountain`,
      ];
      riskAmplifiers = [
        'Steep terrain increases gravitational stress',
        'Saturated soil reduces friction resistance',
        'Heavy rainfall destabilizes slopes',
        'Deforestation accelerates soil erosion',
      ];
      recommendations = [
        'Evacuate high-risk slope communities',
        'Monitor for ground deformation',
        'Deploy geological survey teams',
        'Prepare emergency shelters in safe zones',
      ];
      timelineWarning = 'Landslide occurrence possible within 6-12 hours';
      break;

    default:
      summary = 'No significant disaster pattern detected. Conditions are within normal parameters.';
      keyFactors = ['All monitored parameters within safe ranges'];
      riskAmplifiers = [];
      recommendations = ['Continue routine monitoring'];
      timelineWarning = 'No immediate threat detected';
  }

  const safeguards = [
    'Early warning system activated',
    'Real-time environmental monitoring',
    'Multi-parameter disaster detection',
    'Automated alert distribution',
    'AI-enhanced risk assessment',
  ];

  return {
    id,
    summary,
    keyFactors,
    riskAmplifiers,
    safeguards,
    recommendations,
    timelineWarning,
    timestamp,
  };
};

const generateEarthquakeSummary = (
  data: MonitoringEnvironmentalData,
  riskLevel: DetectionRiskLevel
): string => {
  const severity = riskLevel.includes('Severe') ? 'significant' : 'notable';
  const depth = data.earthquakeDepth || 0;
  const depthDesc = depth > 70 ? 'deep' : depth > 30 ? 'moderate' : 'shallow';
  return `A ${severity} earthquake with ${depthDesc} hypocenter depth has been detected. Seismic waves have been recorded across monitoring stations. Emergency response activation is recommended for populated zones.`;
};

const generateCycloneSummary = (
  data: MonitoringEnvironmentalData,
  riskLevel: DetectionRiskLevel
): string => {
  const severity = riskLevel.includes('Severe') ? 'major' : 'significant';
  const pressure = data.atmosphericPressure || 1013;
  const intensifying = pressure < 950 ? 'rapidly intensifying' : 'steady';
  return `A ${severity} cyclone system is ${intensifying}. Satellite imagery confirms organized cloud structure with characteristic spiral pattern. Storm surge and extreme rainfall are expected in coastal regions.`;
};

const generateFloodSummary = (
  data: MonitoringEnvironmentalData,
  riskLevel: DetectionRiskLevel
): string => {
  const severity = riskLevel.includes('Severe') ? 'major' : 'moderate';
  const saturation = data.soilSaturation || 0;
  const saturated = saturation > 80 ? 'heavily' : saturation > 50 ? 'moderately' : 'partially';
  return `A ${severity} flood event is developing with ${saturated} saturated soils limiting further water absorption. Rivers are approaching critical levels. Downstream communities should prepare for potential inundation.`;
};

const generateWildfireSummary = (
  data: MonitoringEnvironmentalData,
  riskLevel: DetectionRiskLevel
): string => {
  const severity = riskLevel.includes('Severe') ? 'uncontrolled' : 'active';
  const temp = data.temperature || 25;
  const hotDesc = temp > 40 ? 'extreme heat' : temp > 35 ? 'high temperature' : 'elevated temperature';
  return `A ${severity} wildfire is spreading rapidly under conditions of ${hotDesc} and low humidity. Fire propagation is being accelerated by wind patterns. Air quality degradation is expected across downwind areas.`;
};

const generateLandslideSummary = (
  data: MonitoringEnvironmentalData,
  riskLevel: DetectionRiskLevel
): string => {
  const severity = riskLevel.includes('Severe') ? 'critical' : 'significant';
  const saturation = data.soilSaturation || 0;
  const condition = saturation > 70 ? 'unstable' : 'compromised';
  return `A ${severity} landslide risk exists in mountain regions with ${condition} soil conditions. Recent rainfall combined with saturated slopes has increased failure probability. High-altitude communities should relocate preemptively.`;
};
