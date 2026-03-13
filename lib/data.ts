import { HistoricalDisaster } from './types';

export const historicalDisasters: HistoricalDisaster[] = [
  {
    id: '1',
    year: 2018,
    disasterType: 'Flood',
    region: 'Kerala',
    populationAffected: 5400000,
    damageLevel: 95,
    rainfallLevel: 2346,
    latitude: 10.8505,
    longitude: 76.2711,
  },
  {
    id: '2',
    year: 2019,
    disasterType: 'Cyclone',
    region: 'Odisha',
    populationAffected: 16000000,
    damageLevel: 88,
    rainfallLevel: 450,
    latitude: 20.9517,
    longitude: 85.0985,
  },
  {
    id: '3',
    year: 2020,
    disasterType: 'Flood',
    region: 'Assam',
    populationAffected: 5700000,
    damageLevel: 82,
    rainfallLevel: 1890,
    latitude: 26.2006,
    longitude: 92.9376,
  },
  {
    id: '4',
    year: 2021,
    disasterType: 'Landslide',
    region: 'Uttarakhand',
    populationAffected: 250000,
    damageLevel: 75,
    rainfallLevel: 980,
    latitude: 30.0668,
    longitude: 79.0193,
  },
  {
    id: '5',
    year: 2023,
    disasterType: 'Flood',
    region: 'Maharashtra',
    populationAffected: 1200000,
    damageLevel: 70,
    rainfallLevel: 1450,
    latitude: 19.0760,
    longitude: 72.8777,
  },
  {
    id: '6',
    year: 2019,
    disasterType: 'Flood',
    region: 'Bihar',
    populationAffected: 8800000,
    damageLevel: 78,
    rainfallLevel: 1650,
    latitude: 25.0961,
    longitude: 85.3131,
  },
  {
    id: '7',
    year: 2020,
    disasterType: 'Cyclone',
    region: 'West Bengal',
    populationAffected: 13000000,
    damageLevel: 92,
    rainfallLevel: 380,
    latitude: 22.9868,
    longitude: 87.8550,
  },
  {
    id: '8',
    year: 2021,
    disasterType: 'Flood',
    region: 'Karnataka',
    populationAffected: 950000,
    damageLevel: 65,
    rainfallLevel: 1320,
    latitude: 15.3173,
    longitude: 75.7139,
  },
  {
    id: '9',
    year: 2022,
    disasterType: 'Landslide',
    region: 'Himachal Pradesh',
    populationAffected: 180000,
    damageLevel: 72,
    rainfallLevel: 890,
    latitude: 31.1048,
    longitude: 77.1734,
  },
  {
    id: '10',
    year: 2023,
    disasterType: 'Cyclone',
    region: 'Gujarat',
    populationAffected: 2100000,
    damageLevel: 68,
    rainfallLevel: 320,
    latitude: 22.2587,
    longitude: 71.1924,
  },
  {
    id: '11',
    year: 2018,
    disasterType: 'Earthquake',
    region: 'Delhi NCR',
    populationAffected: 450000,
    damageLevel: 45,
    rainfallLevel: 0,
    latitude: 28.7041,
    longitude: 77.1025,
  },
  {
    id: '12',
    year: 2022,
    disasterType: 'Flood',
    region: 'Assam',
    populationAffected: 6200000,
    damageLevel: 85,
    rainfallLevel: 2100,
    latitude: 26.1445,
    longitude: 91.7362,
  },
  {
    id: '13',
    year: 2021,
    disasterType: 'Wildfire',
    region: 'Uttarakhand',
    populationAffected: 85000,
    damageLevel: 55,
    rainfallLevel: 120,
    latitude: 30.3165,
    longitude: 78.0322,
  },
  {
    id: '14',
    year: 2020,
    disasterType: 'Flood',
    region: 'Kerala',
    populationAffected: 3200000,
    damageLevel: 76,
    rainfallLevel: 1980,
    latitude: 9.9312,
    longitude: 76.2673,
  },
  {
    id: '15',
    year: 2023,
    disasterType: 'Landslide',
    region: 'Himachal Pradesh',
    populationAffected: 320000,
    damageLevel: 80,
    rainfallLevel: 1150,
    latitude: 32.0998,
    longitude: 77.5806,
  },
];

export const getDisastersByYear = () => {
  const yearCounts: Record<number, number> = {};
  historicalDisasters.forEach((d) => {
    yearCounts[d.year] = (yearCounts[d.year] || 0) + 1;
  });
  return Object.entries(yearCounts).map(([year, count]) => ({
    year: parseInt(year),
    count,
  }));
};

export const getDisastersByType = () => {
  const typeCounts: Record<string, number> = {};
  historicalDisasters.forEach((d) => {
    typeCounts[d.disasterType] = (typeCounts[d.disasterType] || 0) + 1;
  });
  return Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
  }));
};

export const getTotalPopulationAffected = () => {
  return historicalDisasters.reduce((sum, d) => sum + d.populationAffected, 0);
};
