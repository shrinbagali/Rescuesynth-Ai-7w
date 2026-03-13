import { MonitoringEnvironmentalData, RiverWaterLevel } from '../types';

/**
 * Generates simulated real-time environmental data
 * Simulates continuous monitoring of environmental parameters
 */
export const generateEnvironmentalReading = (
  region: string,
  previousData?: MonitoringEnvironmentalData
): MonitoringEnvironmentalData => {
  const timestamp = new Date();

  // Use previous data as baseline for smooth transitions
  const baselineRainfall = previousData?.rainfall || randomInRange(0, 100);
  const baselineWindSpeed = previousData?.windSpeed || randomInRange(5, 40);
  const baselineTemperature = previousData?.temperature || randomInRange(20, 35);
  const baselineHumidity = previousData?.humidity || randomInRange(40, 80);
  const baselineSeismic = previousData?.seismicActivity || randomInRange(0, 3);

  // Add small random variations to create smooth trends
  const rainfall = Math.max(0, baselineRainfall + randomInRange(-10, 15));
  const windSpeed = Math.max(0, baselineWindSpeed + randomInRange(-5, 8));
  const temperature = Math.max(-10, Math.min(60, baselineTemperature + randomInRange(-1, 2)));
  const humidity = Math.max(10, Math.min(100, baselineHumidity + randomInRange(-5, 5)));
  const soilSaturation = Math.max(0, Math.min(100, rainfall > 150 ? 70 + Math.random() * 30 : Math.random() * 60));
  const drynessIndex = humidity < 30 && temperature > 35 ? 'High' : humidity < 50 ? 'Medium' : 'Low';

  // Determine river level based on rainfall
  let riverLevel: RiverWaterLevel = 'Low';
  if (rainfall > 250) riverLevel = 'Critical';
  else if (rainfall > 150) riverLevel = 'High';
  else if (rainfall > 75) riverLevel = 'Medium';

  // Seismic activity (typically low but occasional spikes)
  const seismicActivity = shouldSpikeSeis() 
    ? randomInRange(4, 6.5) 
    : baselineSeismic + randomInRange(-0.5, 0.5);

  // Earthquake-specific parameters
  const earthquakeDepth = seismicActivity > 4 ? randomInRange(5, 150) : undefined;
  const groundAcceleration = seismicActivity > 4 ? seismicActivity * randomInRange(0.5, 2) : undefined;
  const epicenterLat = seismicActivity > 4 ? randomInRange(8, 35) : undefined;
  const epicenterLng = seismicActivity > 4 ? randomInRange(68, 97) : undefined;

  // Cyclone-specific parameters
  const atmosphericPressure = windSpeed > 80 
    ? randomInRange(920, 950) 
    : randomInRange(1000, 1020);
  const seaSurfaceTemp = temperature + randomInRange(-2, 5);
  const rainfallIntensity = rainfall > 100 ? randomInRange(50, 150) : randomInRange(0, 50);
  const cloudPattern = windSpeed > 120 ? 'spiral' : windSpeed > 80 ? 'forming' : 'none';

  return {
    rainfall: Math.round(rainfall * 10) / 10,
    riverLevel,
    windSpeed: Math.round(windSpeed * 10) / 10,
    seismicActivity: Math.round(seismicActivity * 100) / 100,
    temperature: Math.round(temperature * 10) / 10,
    humidity: Math.round(humidity * 10) / 10,
    soilSaturation: Math.round(soilSaturation * 10) / 10,
    drynessIndex,
    timestamp,
    // Earthquake-specific
    earthquakeDepth,
    groundAcceleration,
    epicenterLat,
    epicenterLng,
    // Cyclone-specific
    atmosphericPressure: Math.round(atmosphericPressure * 10) / 10,
    seaSurfaceTemp: Math.round(seaSurfaceTemp * 10) / 10,
    rainfallIntensity: Math.round(rainfallIntensity * 10) / 10,
    cloudPattern,
  };
};

/**
 * Generates a sequence of environmental readings over time
 * Useful for simulating a data stream
 */
export const generateEnvironmentalDataStream = (
  region: string,
  count: number = 10
): MonitoringEnvironmentalData[] => {
  const readings: MonitoringEnvironmentalData[] = [];
  let previousData: MonitoringEnvironmentalData | undefined;

  for (let i = 0; i < count; i++) {
    const reading = generateEnvironmentalReading(region, previousData);
    readings.push(reading);
    previousData = reading;
  }

  return readings;
};

/**
 * Generates extreme weather conditions (for testing disaster thresholds)
 */
export const generateExtremeWeatherConditions = (
  disasterType: 'Earthquake' | 'Cyclone' | 'Flood' | 'Wildfire' | 'Landslide'
): MonitoringEnvironmentalData => {
  const timestamp = new Date();

  switch (disasterType) {
    case 'Earthquake':
      return {
        rainfall: randomInRange(0, 50),
        riverLevel: 'Low',
        windSpeed: randomInRange(5, 30),
        seismicActivity: randomInRange(6, 7.5),
        temperature: randomInRange(15, 35),
        humidity: randomInRange(30, 70),
        soilSaturation: randomInRange(20, 50),
        drynessIndex: 'Low',
        timestamp,
        earthquakeDepth: randomInRange(10, 100),
        groundAcceleration: randomInRange(2, 5),
        epicenterLat: randomInRange(8, 35),
        epicenterLng: randomInRange(68, 97),
        atmosphericPressure: randomInRange(1000, 1020),
        seaSurfaceTemp: randomInRange(25, 32),
        rainfallIntensity: randomInRange(0, 30),
        cloudPattern: 'none',
      };

    case 'Cyclone':
      return {
        rainfall: randomInRange(150, 300),
        riverLevel: 'High',
        windSpeed: randomInRange(140, 220),
        seismicActivity: randomInRange(0.5, 2),
        temperature: randomInRange(28, 35),
        humidity: randomInRange(60, 90),
        soilSaturation: randomInRange(40, 70),
        drynessIndex: 'Low',
        timestamp,
        atmosphericPressure: randomInRange(900, 940),
        seaSurfaceTemp: randomInRange(28, 32),
        rainfallIntensity: randomInRange(100, 200),
        cloudPattern: 'spiral',
      };

    case 'Flood':
      return {
        rainfall: randomInRange(250, 400),
        riverLevel: 'Critical',
        windSpeed: randomInRange(10, 40),
        seismicActivity: randomInRange(0, 2),
        temperature: randomInRange(15, 30),
        humidity: randomInRange(70, 95),
        soilSaturation: randomInRange(80, 95),
        drynessIndex: 'Low',
        timestamp,
        atmosphericPressure: randomInRange(1000, 1020),
        seaSurfaceTemp: randomInRange(20, 28),
        rainfallIntensity: randomInRange(80, 150),
        cloudPattern: 'forming',
      };

    case 'Wildfire':
      return {
        rainfall: randomInRange(0, 20),
        riverLevel: 'Low',
        windSpeed: randomInRange(30, 80),
        seismicActivity: randomInRange(0, 1),
        temperature: randomInRange(40, 50),
        humidity: randomInRange(10, 25),
        soilSaturation: randomInRange(5, 30),
        drynessIndex: 'High',
        timestamp,
        atmosphericPressure: randomInRange(1000, 1020),
        seaSurfaceTemp: randomInRange(25, 35),
        rainfallIntensity: randomInRange(0, 10),
        cloudPattern: 'none',
      };

    case 'Landslide':
      return {
        rainfall: randomInRange(200, 350),
        riverLevel: 'High',
        windSpeed: randomInRange(15, 50),
        seismicActivity: randomInRange(0.5, 3),
        temperature: randomInRange(10, 25),
        humidity: randomInRange(65, 85),
        soilSaturation: randomInRange(75, 95),
        drynessIndex: 'Low',
        timestamp,
        atmosphericPressure: randomInRange(950, 1000),
        seaSurfaceTemp: randomInRange(15, 25),
        rainfallIntensity: randomInRange(60, 140),
        cloudPattern: 'forming',
      };
  }
};

/**
 * Generates region-specific environmental baseline data
 */
export const getRegionBaseline = (region: string) => {
  const baselines: Record<string, { temp: number; humidity: number; rainfall: number }> = {
    'Kerala Coastal Region': { temp: 28, humidity: 75, rainfall: 200 },
    'Assam Flood Plains': { temp: 26, humidity: 80, rainfall: 180 },
    'Odisha Cyclone Belt': { temp: 29, humidity: 70, rainfall: 150 },
    'Uttarakhand Himalayan Region': { temp: 20, humidity: 60, rainfall: 120 },
    'California Forest Zone': { temp: 25, humidity: 45, rainfall: 50 },
    'Japan Seismic Zone': { temp: 15, humidity: 65, rainfall: 100 },
  };

  return baselines[region] || { temp: 25, humidity: 60, rainfall: 100 };
};

// Utility functions
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const shouldSpikeSeis = (): boolean => {
  // 15% chance of seismic spike
  return Math.random() < 0.15;
};
