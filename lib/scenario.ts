import { ScenarioConfig, ScenarioData, RiskLevel, RescuePriority, AIInsight } from './types';

export const generateScenarioData = (config: ScenarioConfig, count: number = 100): ScenarioData[] => {
  const scenarios: ScenarioData[] = [];
  
  for (let i = 0; i < count; i++) {
    const rainfallVariation = config.rainfallLevel + (Math.random() - 0.5) * 500;
    const populationVariation = config.populationDensity + (Math.random() - 0.5) * 2000;
    const damageVariation = Math.min(100, Math.max(0, config.infrastructureDamage + (Math.random() - 0.5) * 30));
    const shelterVariation = Math.min(100, Math.max(0, config.shelterCapacity + (Math.random() - 0.5) * 20));
    
    const riskScore = calculateRiskScore(rainfallVariation, populationVariation, damageVariation, shelterVariation);
    const riskLevel = getRiskLevel(riskScore);
    const rescuePriority = getRescuePriority(riskScore, populationVariation, damageVariation);
    
    scenarios.push({
      id: `scenario-${Date.now()}-${i}`,
      region: config.region,
      rainfallLevel: Math.round(rainfallVariation),
      populationDensity: Math.round(populationVariation),
      infrastructureDamage: Math.round(damageVariation),
      shelterCapacity: Math.round(shelterVariation),
      riskLevel,
      rescuePriority,
    });
  }
  
  return scenarios;
};

const calculateRiskScore = (
  rainfall: number,
  population: number,
  damage: number,
  shelter: number
): number => {
  const rainfallWeight = 0.3;
  const populationWeight = 0.25;
  const damageWeight = 0.3;
  const shelterWeight = 0.15;
  
  const normalizedRainfall = Math.min(rainfall / 3000, 1);
  const normalizedPopulation = Math.min(population / 10000, 1);
  const normalizedDamage = damage / 100;
  const normalizedShelter = 1 - (shelter / 100);
  
  return (
    normalizedRainfall * rainfallWeight +
    normalizedPopulation * populationWeight +
    normalizedDamage * damageWeight +
    normalizedShelter * shelterWeight
  ) * 100;
};

const getRiskLevel = (score: number): RiskLevel => {
  if (score < 35) return 'Low';
  if (score < 65) return 'Medium';
  return 'High';
};

const getRescuePriority = (riskScore: number, population: number, damage: number): RescuePriority => {
  const priorityScore = riskScore * 0.4 + (population / 100) * 0.3 + damage * 0.3;
  
  if (priorityScore < 25) return 'Low';
  if (priorityScore < 50) return 'Medium';
  if (priorityScore < 75) return 'High';
  return 'Critical';
};

export const generateAIInsights = (scenarios: ScenarioData[], config: ScenarioConfig): AIInsight[] => {
  const insights: AIInsight[] = [];
  
  const highRiskCount = scenarios.filter(s => s.riskLevel === 'High').length;
  const avgRainfall = scenarios.reduce((sum, s) => sum + s.rainfallLevel, 0) / scenarios.length;
  const avgPopulation = scenarios.reduce((sum, s) => sum + s.populationDensity, 0) / scenarios.length;
  const avgDamage = scenarios.reduce((sum, s) => sum + s.infrastructureDamage, 0) / scenarios.length;
  
  if (avgRainfall > 1500) {
    insights.push({
      id: `insight-${Date.now()}-1`,
      type: 'critical',
      message: `High rainfall levels (${Math.round(avgRainfall)}mm average) significantly increase ${config.disasterType.toLowerCase()} risk in ${config.region}. Immediate evacuation planning recommended.`,
      region: config.region,
    });
  }
  
  if (avgPopulation > 5000 && highRiskCount > scenarios.length * 0.3) {
    insights.push({
      id: `insight-${Date.now()}-2`,
      type: 'warning',
      message: `Dense population (${Math.round(avgPopulation)} per sq km) combined with high risk scenarios in ${config.region} requires enhanced rescue resource allocation.`,
      region: config.region,
    });
  }
  
  if (avgDamage > 60) {
    insights.push({
      id: `insight-${Date.now()}-3`,
      type: 'critical',
      message: `Infrastructure damage projections (${Math.round(avgDamage)}% average) indicate potential collapse of critical services. Pre-position emergency supplies.`,
      region: config.region,
    });
  }
  
  if (config.region.includes('Himalayan') || config.region.includes('Landslide')) {
    insights.push({
      id: `insight-${Date.now()}-4`,
      type: 'warning',
      message: `Mountain terrain in ${config.region} increases landslide vulnerability. Monitor soil saturation levels and establish early warning systems.`,
      region: config.region,
    });
  }
  
  if (config.region.includes('Coastal') || config.region.includes('Cyclone')) {
    insights.push({
      id: `insight-${Date.now()}-5`,
      type: 'info',
      message: `Coastal proximity in ${config.region} requires coordinated maritime rescue capabilities. Recommend deploying naval assets.`,
      region: config.region,
    });
  }
  
  if (config.shelterCapacity < 40) {
    insights.push({
      id: `insight-${Date.now()}-6`,
      type: 'warning',
      message: `Low shelter capacity (${config.shelterCapacity}%) detected. Identify additional temporary shelters such as schools and community centers.`,
      region: config.region,
    });
  }
  
  insights.push({
    id: `insight-${Date.now()}-7`,
    type: 'info',
    message: `AI analysis complete: ${highRiskCount} high-risk scenarios identified out of ${scenarios.length} total simulations for ${config.region}.`,
    region: config.region,
  });
  
  return insights;
};

export const simulateTraining = (): Promise<{
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  featureImportance: { feature: string; importance: number }[];
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        accuracy: 85 + Math.random() * 10,
        precision: 82 + Math.random() * 12,
        recall: 80 + Math.random() * 15,
        f1Score: 83 + Math.random() * 11,
        featureImportance: [
          { feature: 'Rainfall Level', importance: 28 + Math.random() * 5 },
          { feature: 'Population Density', importance: 22 + Math.random() * 5 },
          { feature: 'Infrastructure Damage', importance: 25 + Math.random() * 5 },
          { feature: 'Shelter Capacity', importance: 15 + Math.random() * 5 },
          { feature: 'Historical Patterns', importance: 10 + Math.random() * 3 },
        ],
      });
    }, 2000);
  });
};
