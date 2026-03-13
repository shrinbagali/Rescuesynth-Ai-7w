export interface SeismicZone {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  riskLevel: 'High' | 'Very High' | 'Extreme';
  averageMagnitude: number;
  averageFrequency: string; // e.g., "3-4 per year", "10+ per year"
  populationExposed: number;
  lastMajorEvent: number; // year
  faultLines: string[];
  characteristics: string[];
}

export const seismicRegions: SeismicZone[] = [
  {
    id: 'japan-zone',
    name: 'Japan Seismic Zone',
    country: 'Japan',
    latitude: 36.2048,
    longitude: 138.2529,
    riskLevel: 'Extreme',
    averageMagnitude: 6.2,
    averageFrequency: '10+ per year',
    populationExposed: 125000000,
    lastMajorEvent: 2011,
    faultLines: ['Japan Trench', 'Kuril-Kamchatka Trench', 'Nankai Trough'],
    characteristics: [
      'Subduction zone at convergence of Pacific Plate',
      'Frequent moderate to major earthquakes',
      'High tsunami risk',
      'Well-developed early warning systems',
      'Earthquake-resistant infrastructure standard',
    ],
  },
  {
    id: 'california-zone',
    name: 'California Seismic Zone',
    country: 'USA',
    latitude: 36.7783,
    longitude: -119.4179,
    riskLevel: 'Very High',
    averageMagnitude: 5.8,
    averageFrequency: '4-5 per year',
    populationExposed: 39000000,
    lastMajorEvent: 1989,
    faultLines: ['San Andreas Fault', 'Hayward Fault', 'San Jacinto Fault'],
    characteristics: [
      'Transform fault boundary (Pacific-North American)',
      'Multiple active fault systems',
      'High urban population density in risk zones',
      'Moderate earthquake frequency with potential for large events',
      'Active seismic monitoring network',
    ],
  },
  {
    id: 'indonesia-zone',
    name: 'Indonesia Seismic Belt',
    country: 'Indonesia',
    latitude: -0.8755,
    longitude: 113.9213,
    riskLevel: 'Extreme',
    averageMagnitude: 6.5,
    averageFrequency: '8-9 per year',
    populationExposed: 275000000,
    lastMajorEvent: 2004,
    faultLines: ['Sunda Trench', 'Banda Arc', 'Sumatran Fault'],
    characteristics: [
      'Triple subduction zone region',
      'Frequent major earthquakes',
      'Extreme tsunami hazard',
      'Volcanic activity interrelated with seismic events',
      'Dense population along coasts',
    ],
  },
  {
    id: 'himalayan-zone',
    name: 'Himalayan Seismic Belt',
    country: 'India / Nepal / Bhutan',
    latitude: 28.1444,
    longitude: 84.1239,
    riskLevel: 'Very High',
    averageMagnitude: 6.0,
    averageFrequency: '3-4 per year',
    populationExposed: 400000000,
    lastMajorEvent: 2015,
    faultLines: ['Main Himalayan Thrust', 'Main Central Thrust', 'Main Boundary Thrust'],
    characteristics: [
      'Continent-continent collision zone',
      'High altitude seismic monitoring challenges',
      'Large potential for great earthquakes',
      'Landslide hazard secondary to earthquakes',
      'Rapidly growing population in foothills',
    ],
  },
  {
    id: 'chile-zone',
    name: 'Chile Subduction Zone',
    country: 'Chile',
    latitude: -30.0,
    longitude: -71.5,
    riskLevel: 'Extreme',
    averageMagnitude: 6.8,
    averageFrequency: '5-6 per year',
    populationExposed: 18000000,
    lastMajorEvent: 2010,
    faultLines: ['Peru-Chile Trench', 'Southern Volcanic Zone'],
    characteristics: [
      'Subduction zone at Peru-Chile Trench',
      'Largest recorded earthquake (1960, Magnitude 9.5)',
      'Frequent moderate to major earthquakes',
      'High tsunami potential',
      'Well-organized disaster response',
    ],
  },
];

/**
 * Get seismic risk assessment for a region
 */
export const getSeismicRiskAssessment = (region: string): SeismicZone | null => {
  return seismicRegions.find(zone => zone.name.toLowerCase().includes(region.toLowerCase())) || null;
};

/**
 * Get all high-risk seismic zones
 */
export const getHighRiskZones = (): SeismicZone[] => {
  return seismicRegions.filter(zone => zone.riskLevel === 'Very High' || zone.riskLevel === 'Extreme');
};

/**
 * Calculate seismic hazard index (0-100)
 */
export const calculateSeismicHazardIndex = (zone: SeismicZone): number => {
  let hazardIndex = 0;

  // Risk level contribution (30%)
  const riskMultiplier = zone.riskLevel === 'Extreme' ? 30 : zone.riskLevel === 'Very High' ? 25 : 15;

  // Magnitude contribution (30%)
  const magnitudeScore = Math.min((zone.averageMagnitude / 8.5) * 30, 30);

  // Population exposure contribution (20%)
  const populationScore = Math.min((zone.populationExposed / 400000000) * 20, 20);

  // Frequency contribution (20%)
  const frequencyMap: Record<string, number> = {
    '10+': 20,
    '8-9': 18,
    '5-6': 15,
    '4-5': 12,
    '3-4': 10,
  };
  const frequencyScore = frequencyMap[zone.averageFrequency.split(' ')[0]] || 10;

  hazardIndex = riskMultiplier + magnitudeScore + populationScore + frequencyScore;
  return Math.min(100, hazardIndex);
};

/**
 * Simulate earthquake magnitude probability distribution
 */
export const getEarthquakeProbability = (magnitude: number): number => {
  // Gutenberg-Richter relationship: log10(N) = a - b*M
  // Simplified: probability decreases exponentially with magnitude
  const b = 1.0; // Gutenberg-Richter b-value
  const baseMagnitude = 4.5;

  if (magnitude < baseMagnitude) return 0.99;
  
  const exponent = -b * (magnitude - baseMagnitude);
  return Math.pow(10, exponent);
};
