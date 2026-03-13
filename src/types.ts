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
  | 'history';
