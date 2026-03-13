import { DisasterType, EnvironmentalInputs } from '../types';

export interface DetectedPattern {
  pattern: string;
  confidence: number;
  description: string;
}

export interface PatternAnalysisResult {
  detectedPatterns: DetectedPattern[];
  primaryDisasterType: DisasterType | 'No Disaster Detected';
  overallConfidence: number;
  recommendations: string[];
}

/**
 * Analyze image data for disaster patterns
 * Uses color distribution and spatial patterns to detect cyclones, earthquakes, floods, and wildfires
 */
export function analyzeImagePattern(
  imageData: ImageData,
  environmentalInputs: EnvironmentalInputs
): PatternAnalysisResult {
  const patterns: DetectedPattern[] = [];
  
  // Analyze the image data
  const colorAnalysis = analyzeColorDistribution(imageData);
  
  // Check for cyclone patterns (spiral formations)
  const cyclonePattern = detectCyclonePattern(colorAnalysis, environmentalInputs);
  if (cyclonePattern.confidence > 0) {
    patterns.push(cyclonePattern);
  }
  
  // Check for earthquake patterns (concentric ripples)
  const earthquakePattern = detectEarthquakePattern(colorAnalysis, environmentalInputs);
  if (earthquakePattern.confidence > 0) {
    patterns.push(earthquakePattern);
  }
  
  // Check for flood patterns (water spread)
  const floodPattern = detectFloodPattern(colorAnalysis, environmentalInputs);
  if (floodPattern.confidence > 0) {
    patterns.push(floodPattern);
  }
  
  // Check for wildfire patterns (thermal hotspots)
  const wildfirePattern = detectWildfirePattern(colorAnalysis, environmentalInputs);
  if (wildfirePattern.confidence > 0) {
    patterns.push(wildfirePattern);
  }
  
  // Determine primary disaster type
  const primaryPattern = patterns.reduce((prev, current) =>
    current.confidence > prev.confidence ? current : prev,
    patterns[0] || { confidence: 0 }
  );
  
  const primaryDisasterType = mapPatternToDisasterType(primaryPattern.pattern);
  const overallConfidence = primaryPattern.confidence || 0;
  
  // Generate recommendations
  const recommendations = generateRecommendations(primaryDisasterType, overallConfidence, environmentalInputs);
  
  return {
    detectedPatterns: patterns.sort((a, b) => b.confidence - a.confidence),
    primaryDisasterType,
    overallConfidence,
    recommendations,
  };
}

/**
 * Analyze color distribution in the image
 */
function analyzeColorDistribution(imageData: ImageData): {
  reds: number;
  greens: number;
  blues: number;
  alphas: number;
  darkPixels: number;
  brightPixels: number;
  spiralPixels: number;
  ripplePixels: number;
  waterPixels: number;
  thermalPixels: number;
} {
  const data = imageData.data;
  let reds = 0, greens = 0, blues = 0, alphas = 0;
  let darkPixels = 0, brightPixels = 0;
  let spiralPixels = 0, ripplePixels = 0, waterPixels = 0, thermalPixels = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    reds += r;
    greens += g;
    blues += b;
    alphas += a;
    
    const brightness = (r + g + b) / 3;
    if (brightness < 85) darkPixels++;
    if (brightness > 170) brightPixels++;
    
    // Spiral patterns (blue-ish, green-ish clouds)
    if (b > r && g > 50) spiralPixels++;
    
    // Ripple patterns (grays and whites in concentric patterns)
    if (Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && brightness > 100) ripplePixels++;
    
    // Water patterns (blues and cyans)
    if (b > g + 30 && b > r + 30) waterPixels++;
    
    // Thermal patterns (reds, oranges, yellows)
    if (r > g + 30 && r > b + 30) thermalPixels++;
  }
  
  return {
    reds: reds / (data.length / 4),
    greens: greens / (data.length / 4),
    blues: blues / (data.length / 4),
    alphas: alphas / (data.length / 4),
    darkPixels,
    brightPixels,
    spiralPixels,
    ripplePixels,
    waterPixels,
    thermalPixels,
  };
}

/**
 * Detect cyclone patterns: spiral formations + high wind speeds
 */
function detectCyclonePattern(
  colorAnalysis: ReturnType<typeof analyzeColorDistribution>,
  environmentalInputs: EnvironmentalInputs
): DetectedPattern {
  let confidence = 0;
  
  // Image analysis: spiral patterns
  if (colorAnalysis.spiralPixels > colorAnalysis.thermalPixels * 0.5) {
    confidence += 30;
  }
  
  // Environmental factors
  if (environmentalInputs.windSpeed > 120) {
    confidence += 35;
  } else if (environmentalInputs.windSpeed > 80) {
    confidence += 15;
  }
  
  // Atmospheric pressure indicator
  if (environmentalInputs.temperature > 25) {
    confidence += 15;
  }
  
  // Cloud pattern indicator (if available)
  if ((environmentalInputs as any).cloudPattern === 'spiral' || (environmentalInputs as any).cloudPattern === 'eye') {
    confidence += 20;
  }
  
  return {
    pattern: 'cyclone_spiral',
    confidence: Math.min(confidence, 100),
    description: `Spiral cloud formations detected with wind speeds of ${Math.round(environmentalInputs.windSpeed)} km/h`,
  };
}

/**
 * Detect earthquake patterns: seismic waves + ripples
 */
function detectEarthquakePattern(
  colorAnalysis: ReturnType<typeof analyzeColorDistribution>,
  environmentalInputs: EnvironmentalInputs
): DetectedPattern {
  let confidence = 0;
  
  // Image analysis: ripple patterns (concentric circles)
  if (colorAnalysis.ripplePixels > colorAnalysis.waterPixels * 0.5) {
    confidence += 35;
  }
  
  // Seismic activity parameter
  if (environmentalInputs.seismicActivity > 5.5) {
    confidence += 40;
  } else if (environmentalInputs.seismicActivity > 4.0) {
    confidence += 20;
  }
  
  // Dark pixels indicate disruption
  if (colorAnalysis.darkPixels > colorAnalysis.brightPixels) {
    confidence += 10;
  }
  
  return {
    pattern: 'earthquake_ripples',
    confidence: Math.min(confidence, 100),
    description: `Seismic wave patterns detected with magnitude ${environmentalInputs.seismicActivity.toFixed(1)}`,
  };
}

/**
 * Detect flood patterns: water spread + high water levels
 */
function detectFloodPattern(
  colorAnalysis: ReturnType<typeof analyzeColorDistribution>,
  environmentalInputs: EnvironmentalInputs
): DetectedPattern {
  let confidence = 0;
  
  // Image analysis: water pixels
  if (colorAnalysis.waterPixels > colorAnalysis.thermalPixels * 0.4) {
    confidence += 35;
  }
  
  // Water level indicator
  if (environmentalInputs.waterLevel === 'High') {
    confidence += 35;
  } else if (environmentalInputs.waterLevel === 'Medium') {
    confidence += 15;
  }
  
  // Rainfall intensity
  if (environmentalInputs.rainfallIntensity > 100) {
    confidence += 20;
  } else if (environmentalInputs.rainfallIntensity > 50) {
    confidence += 10;
  }
  
  // Soil saturation
  if (environmentalInputs.soilSaturation === 'High') {
    confidence += 10;
  }
  
  return {
    pattern: 'flood_spread',
    confidence: Math.min(confidence, 100),
    description: `Water spread patterns detected with rainfall intensity ${Math.round(environmentalInputs.rainfallIntensity)} mm/h`,
  };
}

/**
 * Detect wildfire patterns: thermal hotspots + high temperature
 */
function detectWildfirePattern(
  colorAnalysis: ReturnType<typeof analyzeColorDistribution>,
  environmentalInputs: EnvironmentalInputs
): DetectedPattern {
  let confidence = 0;
  
  // Image analysis: thermal pixels (red/orange/yellow)
  if (colorAnalysis.thermalPixels > colorAnalysis.waterPixels * 0.5) {
    confidence += 35;
  }
  
  // Temperature indicator
  if (environmentalInputs.temperature > 38) {
    confidence += 35;
  } else if (environmentalInputs.temperature > 30) {
    confidence += 15;
  }
  
  // Vegetation dryness
  if (environmentalInputs.vegetationDryness === 'High') {
    confidence += 20;
  } else if (environmentalInputs.vegetationDryness === 'Medium') {
    confidence += 10;
  }
  
  // Wind conditions (spreads fire)
  if (environmentalInputs.windSpeed > 30) {
    confidence += 10;
  }
  
  return {
    pattern: 'wildfire_thermal',
    confidence: Math.min(confidence, 100),
    description: `Thermal hotspots detected with temperature ${Math.round(environmentalInputs.temperature)}°C`,
  };
}

/**
 * Map pattern name to disaster type
 */
function mapPatternToDisasterType(pattern: string): DisasterType | 'No Disaster Detected' {
  switch (pattern) {
    case 'cyclone_spiral':
      return 'Cyclone';
    case 'earthquake_ripples':
      return 'Earthquake';
    case 'flood_spread':
      return 'Flood';
    case 'wildfire_thermal':
      return 'Wildfire';
    default:
      return 'No Disaster Detected';
  }
}

/**
 * Generate recommendations based on detected disaster
 */
function generateRecommendations(
  disasterType: DisasterType | 'No Disaster Detected',
  confidence: number,
  environmentalInputs: EnvironmentalInputs
): string[] {
  const recommendations: string[] = [];
  
  if (disasterType === 'No Disaster Detected') {
    recommendations.push('Monitor environmental conditions for any changes');
    return recommendations;
  }
  
  if (confidence < 50) {
    recommendations.push('Continue monitoring - early warning stage');
  } else if (confidence < 75) {
    recommendations.push('Increase alert level - conditions deteriorating');
    recommendations.push('Prepare evacuation procedures');
  } else {
    recommendations.push('CRITICAL - Activate emergency response');
    recommendations.push('Evacuate high-risk areas immediately');
    recommendations.push('Deploy emergency services');
  }
  
  // Specific recommendations by type
  switch (disasterType) {
    case 'Cyclone':
      recommendations.push('Secure outdoor structures and utilities');
      recommendations.push('Stock emergency supplies (food, water, medicines)');
      recommendations.push('Charge all electronic devices');
      break;
    case 'Earthquake':
      recommendations.push('Move to open areas away from buildings');
      recommendations.push('Check structural integrity of buildings');
      recommendations.push('Establish emergency shelters');
      break;
    case 'Flood':
      recommendations.push('Move to higher ground immediately');
      recommendations.push('Do not cross flooded areas');
      recommendations.push('Set up sandbag barriers');
      break;
    case 'Wildfire':
      recommendations.push('Evacuate to designated safe zones');
      recommendations.push('Keep respiratory protection equipment ready');
      recommendations.push('Monitor air quality');
      break;
  }
  
  return recommendations;
}
