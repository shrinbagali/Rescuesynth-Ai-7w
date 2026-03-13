export type DisasterType = 'Flood' | 'Cyclone' | 'Earthquake' | 'Wildfire' | 'Landslide';

export type Region = 
  | 'Kerala Coastal Region'
  | 'Assam Flood Plains'
  | 'Odisha Cyclone Belt'
  | 'Uttarakhand Himalayan Zone'
  | 'Maharashtra Urban Zone'
  | 'Bengaluru Urban Region'
  | 'Mumbai Metropolitan Area'
  | 'Himachal Landslide Region';

export type RiskLevel = 'Low' | 'Medium' | 'High';
export type RescuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ScenarioData {
  id: string;
  region: Region;
  rainfallLevel: number;
  populationDensity: number;
  infrastructureDamage: number;
  shelterCapacity: number;
  riskLevel: RiskLevel;
  rescuePriority: RescuePriority;
}

export interface HistoricalDisaster {
  id: string;
  year: number;
  disasterType: DisasterType;
  region: string;
  populationAffected: number;
  damageLevel: number;
  rainfallLevel: number;
  latitude: number;
  longitude: number;
}

export interface ScenarioConfig {
  disasterType: DisasterType;
  region: Region;
  rainfallLevel: number;
  populationDensity: number;
  infrastructureDamage: number;
  shelterCapacity: number;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'critical';
  message: string;
  region: string;
}

export interface TrainingMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  featureImportance: {
    feature: string;
    importance: number;
  }[];
}

export type Page = 
  | 'dashboard'
  | 'generate'
  | 'dataset'
  | 'training'
  | 'analytics'
  | 'map'
  | 'history'
  | 'realtime'
  | 'livemonitoring'
  | 'imagedetection'
  | 'aicommandcenter'
  | 'dualdisasterdetection';

export type DetectionRegion = 
  | 'Kerala Coastal Region'
  | 'Assam Flood Plains'
  | 'Odisha Cyclone Belt'
  | 'Uttarakhand Himalayan Zone'
  | 'Himachal Mountain Region'
  | 'Maharashtra Urban Region'
  | 'Bengaluru Urban Region';

export type WaterLevel = 'Low' | 'Medium' | 'High';
export type SaturationLevel = 'Low' | 'Medium' | 'High';
export type DrynessIndex = 'Low' | 'Medium' | 'High';
export type DetectionRiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Severe Risk';

export interface EnvironmentalInputs {
  region: DetectionRegion;
  rainfallIntensity: number;
  waterLevel: WaterLevel;
  windSpeed: number;
  seismicActivity: number;
  temperature: number;
  soilSaturation: SaturationLevel;
  vegetationDryness: DrynessIndex;
}

export interface DetectionResult {
  id: string;
  timestamp: Date;
  disasterType: DisasterType | 'No Disaster Detected';
  region: DetectionRegion;
  riskLevel: DetectionRiskLevel;
  riskScore: number;
  environmentalConditions: EnvironmentalInputs;
  explanation: string;
  recommendation: string;
}

export interface RegionData {
  name: DetectionRegion;
  latitude: number;
  longitude: number;
  populationDensity: number;
  infrastructureVulnerability: number;
  historicalFrequency: number;
  isMountainous: boolean;
}

// Live Monitoring Types
export type MonitoringRegion = 
  | 'Kerala Coastal Region'
  | 'Assam Flood Plains'
  | 'Odisha Cyclone Belt'
  | 'Uttarakhand Himalayan Region'
  | 'California Forest Zone'
  | 'Japan Seismic Zone';

export type RiverWaterLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type MonitoringStatus = 'Normal' | 'Monitoring' | 'Alert' | 'Critical';

export interface MonitoringEnvironmentalData {
  rainfall: number;
  riverLevel: RiverWaterLevel;
  windSpeed: number;
  seismicActivity: number;
  temperature: number;
  humidity: number;
  soilSaturation: number;
  drynessIndex: number;
  timestamp: Date;
  // Earthquake-specific parameters
  earthquakeDepth?: number;
  groundAcceleration?: number;
  epicenterLat?: number;
  epicenterLng?: number;
  // Cyclone-specific parameters
  atmosphericPressure?: number;
  seaSurfaceTemp?: number;
  rainfallIntensity?: number;
  cloudPattern?: 'none' | 'forming' | 'spiral' | 'eye';
}

export interface MonitoredRegion {
  id: string;
  name: MonitoringRegion;
  latitude: number;
  longitude: number;
  disasterProne: DisasterType;
  status: MonitoringStatus;
  environmentalData: MonitoringEnvironmentalData;
  lastUpdate: Date;
}

export interface DisasterAlert {
  id: string;
  disasterType: DisasterType;
  region: MonitoringRegion;
  riskLevel: DetectionRiskLevel;
  environmentalData: MonitoringEnvironmentalData;
  timestamp: Date;
  recommendation: string;
  isActive: boolean;
}

export interface MonitoringEvent {
  id: string;
  region: MonitoringRegion;
  disasterType: DisasterType;
  riskLevel: DetectionRiskLevel;
  environmentalData: MonitoringEnvironmentalData;
  timestamp: Date;
}

// AI Early Warning Types
export interface EarlyWarningPrediction {
  id: string;
  region: MonitoringRegion;
  predictedDisasterType: DisasterType;
  confidenceScore: number;
  estimatedTimeWindow: string;
  trendAnalysis: {
    parameter: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    rate: number;
  }[];
  timestamp: Date;
}

// Timeline Replay Types
export interface TimelineSnapshot {
  id: string;
  timestamp: Date;
  regions: {
    name: MonitoringRegion;
    environmentalData: MonitoringEnvironmentalData;
    status: MonitoringStatus;
  }[];
  alerts: DisasterAlert[];
}

// Rescue Recommendation Types
export interface RescueRecommendation {
  id: string;
  disasterType: DisasterType;
  region: MonitoringRegion;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  actions: string[];
  resources: string[];
  evacuationZones: string[];
  timestamp: Date;
}

// Image-Based Disaster Detection Types
export interface DetectedPattern {
  pattern: string;
  confidence: number;
  description: string;
}

export interface ImageAnalysisResult {
  id: string;
  timestamp: Date;
  disasterType: DisasterType | 'No Disaster Detected';
  region: DetectionRegion;
  detectedPatterns: DetectedPattern[];
  overallConfidence: number;
  riskLevel: DetectionRiskLevel;
  recommendations: string[];
  explanation: string;
}

export interface EnhancedDisasterAlert extends DisasterAlert {
  imageAnalysisData?: ImageAnalysisResult;
  detectedPatterns?: DetectedPattern[];
  aiExplanation?: string;
}
