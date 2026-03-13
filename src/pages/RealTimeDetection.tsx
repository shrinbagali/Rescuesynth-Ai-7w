import { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Thermometer, 
  Wind, 
  Droplets, 
  Mountain,
  TreePine,
  Waves,
  Zap,
  Brain,
  MapPin,
  Clock,
  Shield,
  Play,
  RotateCcw
} from 'lucide-react';
import type { Map as LeafletMap, Marker, Circle } from 'leaflet';
import { 
  EnvironmentalInputs, 
  DetectionResult, 
  DetectionRegion, 
  WaterLevel, 
  SaturationLevel, 
  DrynessIndex,
  RegionData,
  DisasterType,
  DetectionRiskLevel
} from '../types';

const REGIONS: RegionData[] = [
  { name: 'Kerala Coastal Region', latitude: 9.9312, longitude: 76.2673, populationDensity: 859, infrastructureVulnerability: 65, historicalFrequency: 78, isMountainous: false },
  { name: 'Assam Flood Plains', latitude: 26.2006, longitude: 92.9376, populationDensity: 398, infrastructureVulnerability: 72, historicalFrequency: 85, isMountainous: false },
  { name: 'Odisha Cyclone Belt', latitude: 20.9517, longitude: 85.0985, populationDensity: 270, infrastructureVulnerability: 68, historicalFrequency: 72, isMountainous: false },
  { name: 'Uttarakhand Himalayan Zone', latitude: 30.0668, longitude: 79.0193, populationDensity: 189, infrastructureVulnerability: 75, historicalFrequency: 65, isMountainous: true },
  { name: 'Himachal Mountain Region', latitude: 31.1048, longitude: 77.1734, populationDensity: 123, infrastructureVulnerability: 70, historicalFrequency: 58, isMountainous: true },
  { name: 'Maharashtra Urban Region', latitude: 19.0760, longitude: 72.8777, populationDensity: 365, infrastructureVulnerability: 55, historicalFrequency: 45, isMountainous: false },
  { name: 'Bengaluru Urban Region', latitude: 12.9716, longitude: 77.5946, populationDensity: 4381, infrastructureVulnerability: 50, historicalFrequency: 35, isMountainous: false },
];

const SIMULATION_SCENARIOS = {
  flood: {
    name: 'Flood Scenario',
    inputs: {
      region: 'Kerala Coastal Region' as DetectionRegion,
      rainfallIntensity: 240,
      waterLevel: 'High' as WaterLevel,
      windSpeed: 45,
      seismicActivity: 1.2,
      temperature: 28,
      soilSaturation: 'High' as SaturationLevel,
      vegetationDryness: 'Low' as DrynessIndex,
    }
  },
  cyclone: {
    name: 'Cyclone Scenario',
    inputs: {
      region: 'Odisha Cyclone Belt' as DetectionRegion,
      rainfallIntensity: 180,
      waterLevel: 'Medium' as WaterLevel,
      windSpeed: 145,
      seismicActivity: 0.5,
      temperature: 30,
      soilSaturation: 'Medium' as SaturationLevel,
      vegetationDryness: 'Low' as DrynessIndex,
    }
  },
  earthquake: {
    name: 'Earthquake Scenario',
    inputs: {
      region: 'Uttarakhand Himalayan Zone' as DetectionRegion,
      rainfallIntensity: 50,
      waterLevel: 'Low' as WaterLevel,
      windSpeed: 20,
      seismicActivity: 6.8,
      temperature: 22,
      soilSaturation: 'Medium' as SaturationLevel,
      vegetationDryness: 'Medium' as DrynessIndex,
    }
  },
  wildfire: {
    name: 'Wildfire Scenario',
    inputs: {
      region: 'Maharashtra Urban Region' as DetectionRegion,
      rainfallIntensity: 5,
      waterLevel: 'Low' as WaterLevel,
      windSpeed: 35,
      seismicActivity: 0.3,
      temperature: 42,
      soilSaturation: 'Low' as SaturationLevel,
      vegetationDryness: 'High' as DrynessIndex,
    }
  },
  landslide: {
    name: 'Landslide Scenario',
    inputs: {
      region: 'Himachal Mountain Region' as DetectionRegion,
      rainfallIntensity: 210,
      waterLevel: 'Medium' as WaterLevel,
      windSpeed: 25,
      seismicActivity: 2.1,
      temperature: 18,
      soilSaturation: 'High' as SaturationLevel,
      vegetationDryness: 'Low' as DrynessIndex,
    }
  },
};

interface RealTimeDetectionProps {
  onDetectionComplete?: (result: DetectionResult) => void;
  detectionHistory: DetectionResult[];
}

export default function RealTimeDetection({ onDetectionComplete, detectionHistory }: RealTimeDetectionProps) {
  const [inputs, setInputs] = useState<EnvironmentalInputs>({
    region: 'Kerala Coastal Region',
    rainfallIntensity: 100,
    waterLevel: 'Medium',
    windSpeed: 50,
    seismicActivity: 2.0,
    temperature: 30,
    soilSaturation: 'Medium',
    vegetationDryness: 'Medium',
  });

  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const circleRef = useRef<Circle | null>(null);

  const getRegionData = (regionName: DetectionRegion): RegionData => {
    return REGIONS.find(r => r.name === regionName) || REGIONS[0];
  };

  const detectDisaster = (): { type: DisasterType | 'No Disaster Detected'; explanation: string } => {
    const { rainfallIntensity, waterLevel, windSpeed, seismicActivity, temperature, soilSaturation, vegetationDryness, region } = inputs;
    const regionData = getRegionData(region);

    // Flood Detection
    if (rainfallIntensity > 200 && waterLevel === 'High') {
      return {
        type: 'Flood',
        explanation: `Flood detected because rainfall intensity (${rainfallIntensity}mm) exceeded 200mm threshold AND river water level is ${waterLevel}. The combination of heavy precipitation and elevated water levels indicates imminent flooding conditions.`
      };
    }

    // Cyclone Detection
    if (windSpeed > 120) {
      return {
        type: 'Cyclone',
        explanation: `Cyclone detected because wind speed (${windSpeed} km/h) exceeded the 120 km/h threshold. Sustained high winds of this magnitude indicate cyclonic activity requiring immediate attention.`
      };
    }

    // Earthquake Detection
    if (seismicActivity > 5.5) {
      return {
        type: 'Earthquake',
        explanation: `Earthquake detected because seismic activity (${seismicActivity} on Richter scale) exceeded 5.5 magnitude. This level of seismic activity can cause significant structural damage and requires emergency response.`
      };
    }

    // Wildfire Detection
    if (temperature > 38 && vegetationDryness === 'High') {
      return {
        type: 'Wildfire',
        explanation: `Wildfire risk detected because temperature (${temperature}°C) exceeded 38°C AND vegetation dryness index is ${vegetationDryness}. Hot, dry conditions with parched vegetation create ideal conditions for fire ignition and spread.`
      };
    }

    // Landslide Detection
    if (rainfallIntensity > 180 && soilSaturation === 'High' && regionData.isMountainous) {
      return {
        type: 'Landslide',
        explanation: `Landslide detected because rainfall (${rainfallIntensity}mm) exceeded 180mm, soil saturation is ${soilSaturation}, AND the region (${region}) is mountainous. Saturated slopes in hilly terrain are highly susceptible to mass movement.`
      };
    }

    return {
      type: 'No Disaster Detected',
      explanation: 'Current environmental conditions are within normal parameters. No immediate disaster threat detected based on the provided inputs.'
    };
  };

  const calculateRiskScore = (disasterType: DisasterType | 'No Disaster Detected'): { score: number; level: DetectionRiskLevel } => {
    if (disasterType === 'No Disaster Detected') {
      return { score: 0, level: 'Low Risk' };
    }

    const regionData = getRegionData(inputs.region);
    const { rainfallIntensity, windSpeed, seismicActivity, temperature } = inputs;

    let baseScore = 0;

    // Factor 1: Population Density (normalized to 0-25)
    baseScore += Math.min(25, (regionData.populationDensity / 200));

    // Factor 2: Infrastructure Vulnerability (0-25)
    baseScore += (regionData.infrastructureVulnerability / 100) * 25;

    // Factor 3: Rainfall Intensity (normalized to 0-25)
    baseScore += Math.min(25, (rainfallIntensity / 10));

    // Factor 4: Historical Disaster Frequency (0-25)
    baseScore += (regionData.historicalFrequency / 100) * 25;

    // Disaster-specific multipliers
    switch (disasterType) {
      case 'Flood':
        baseScore *= (inputs.waterLevel === 'High' ? 1.3 : inputs.waterLevel === 'Medium' ? 1.1 : 1.0);
        break;
      case 'Cyclone':
        baseScore *= (windSpeed > 150 ? 1.4 : windSpeed > 130 ? 1.2 : 1.0);
        break;
      case 'Earthquake':
        baseScore *= (seismicActivity > 7 ? 1.5 : seismicActivity > 6 ? 1.3 : 1.1);
        break;
      case 'Wildfire':
        baseScore *= (temperature > 45 ? 1.4 : temperature > 40 ? 1.2 : 1.0);
        break;
      case 'Landslide':
        baseScore *= (inputs.soilSaturation === 'High' ? 1.3 : 1.1);
        break;
    }

    const score = Math.min(100, Math.round(baseScore));
    
    let level: DetectionRiskLevel;
    if (score >= 75) level = 'Severe Risk';
    else if (score >= 50) level = 'High Risk';
    else if (score >= 25) level = 'Moderate Risk';
    else level = 'Low Risk';

    return { score, level };
  };

  const getRecommendation = (disasterType: DisasterType | 'No Disaster Detected', riskLevel: DetectionRiskLevel): string => {
    if (disasterType === 'No Disaster Detected') {
      return 'Continue monitoring environmental conditions. No immediate action required.';
    }

    const recommendations: Record<DisasterType, Record<DetectionRiskLevel, string>> = {
      'Flood': {
        'Low Risk': 'Monitor water levels. Prepare emergency supplies and evacuation routes.',
        'Moderate Risk': 'Alert local authorities. Begin pre-evacuation preparations for low-lying areas.',
        'High Risk': 'Initiate evacuation of flood-prone zones. Deploy rescue teams to standby positions.',
        'Severe Risk': 'IMMEDIATE EVACUATION REQUIRED. Deploy all available rescue resources. Establish emergency shelters.',
      },
      'Cyclone': {
        'Low Risk': 'Secure loose objects. Monitor weather updates closely.',
        'Moderate Risk': 'Move to cyclone shelters. Stockpile emergency supplies.',
        'High Risk': 'Mandatory evacuation of coastal areas. Activate emergency response teams.',
        'Severe Risk': 'CRITICAL ALERT: Complete coastal evacuation. Maximum emergency response activation.',
      },
      'Earthquake': {
        'Low Risk': 'Review earthquake safety procedures. Check structural integrity.',
        'Moderate Risk': 'Prepare for aftershocks. Position rescue teams on alert.',
        'High Risk': 'Deploy search and rescue teams. Establish medical triage centers.',
        'Severe Risk': 'MAXIMUM ALERT: Full emergency response. Request national disaster assistance.',
      },
      'Wildfire': {
        'Low Risk': 'Clear dry vegetation near structures. Monitor fire conditions.',
        'Moderate Risk': 'Prepare evacuation plans. Alert firefighting resources.',
        'High Risk': 'Begin evacuations in fire-prone areas. Deploy firefighting units.',
        'Severe Risk': 'IMMEDIATE EVACUATION. Maximum firefighting resource deployment. Request aerial support.',
      },
      'Landslide': {
        'Low Risk': 'Monitor slope stability. Avoid construction in vulnerable areas.',
        'Moderate Risk': 'Evacuate unstable slope areas. Establish early warning systems.',
        'High Risk': 'Mandatory evacuation of hillside communities. Deploy rescue teams.',
        'Severe Risk': 'CRITICAL: Complete evacuation of mountain areas. Maximum emergency response.',
      },
    };

    return recommendations[disasterType]?.[riskLevel] || 'Take appropriate safety measures.';
  };

  const handleDetect = () => {
    setIsDetecting(true);
    
    // Simulate processing time
    setTimeout(() => {
      const detection = detectDisaster();
      const risk = calculateRiskScore(detection.type);
      const recommendation = getRecommendation(detection.type, risk.level);

      const newResult: DetectionResult = {
        id: `detection-${Date.now()}`,
        timestamp: new Date(),
        disasterType: detection.type,
        region: inputs.region,
        riskLevel: risk.level,
        riskScore: risk.score,
        environmentalConditions: { ...inputs },
        explanation: detection.explanation,
        recommendation,
      };

      setResult(newResult);
      setIsDetecting(false);
      
      if (onDetectionComplete) {
        onDetectionComplete(newResult);
      }

      // Update map
      updateMap(newResult);
    }, 1500);
  };

  const handleSimulate = (scenario: keyof typeof SIMULATION_SCENARIOS) => {
    setInputs(SIMULATION_SCENARIOS[scenario].inputs);
    setResult(null);
  };

  const handleReset = () => {
    setInputs({
      region: 'Kerala Coastal Region',
      rainfallIntensity: 100,
      waterLevel: 'Medium',
      windSpeed: 50,
      seismicActivity: 2.0,
      temperature: 30,
      soilSaturation: 'Medium',
      vegetationDryness: 'Medium',
    });
    setResult(null);
  };

  const updateMap = async (detection: DetectionResult) => {
    if (!mapInstanceRef.current) return;

    const L = await import('leaflet');
    const regionData = getRegionData(detection.region);
    
    // Remove existing marker and circle
    if (markerRef.current) {
      markerRef.current.remove();
    }
    if (circleRef.current) {
      circleRef.current.remove();
    }

    if (detection.disasterType === 'No Disaster Detected') return;

    const getColor = (riskLevel: DetectionRiskLevel) => {
      switch (riskLevel) {
        case 'Severe Risk': return '#ef4444';
        case 'High Risk': return '#f59e0b';
        case 'Moderate Risk': return '#eab308';
        case 'Low Risk': return '#14b8a6';
        default: return '#14b8a6';
      }
    };

    const color = getColor(detection.riskLevel);

    // Add marker
    const markerIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 0 20px ${color}, 0 0 40px ${color}40;
          animation: pulse 2s infinite;
        "></div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    markerRef.current = L.marker([regionData.latitude, regionData.longitude], { icon: markerIcon });
    
    markerRef.current.bindPopup(`
      <div style="
        background: #1e293b;
        padding: 16px;
        border-radius: 8px;
        min-width: 220px;
        color: #f1f5f9;
        font-family: system-ui;
      ">
        <h3 style="margin: 0 0 12px 0; color: ${color}; font-size: 18px; font-weight: 700;">
          ${detection.disasterType} Detected
        </h3>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94a3b8;">Region</span>
            <span style="color: #f1f5f9; font-weight: 500;">${detection.region}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94a3b8;">Risk Level</span>
            <span style="color: ${color}; font-weight: 600;">${detection.riskLevel}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #94a3b8;">Timestamp</span>
            <span style="color: #f1f5f9; font-weight: 500;">${detection.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    `, { className: 'custom-popup' });

    markerRef.current.addTo(mapInstanceRef.current);

    // Add impact circle
    circleRef.current = L.circle([regionData.latitude, regionData.longitude], {
      color: color,
      fillColor: color,
      fillOpacity: 0.2,
      radius: detection.riskScore * 1000,
      weight: 2,
    });
    circleRef.current.addTo(mapInstanceRef.current);

    // Pan to location
    mapInstanceRef.current.setView([regionData.latitude, regionData.longitude], 7, { animate: true });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      if (!mapRef.current) return;
      
      const map = L.map(mapRef.current).setView([22.5, 82.5], 5);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CartoDB',
        maxZoom: 19,
      }).addTo(map);

      // Add region markers
      REGIONS.forEach((region) => {
        const markerIcon = L.divIcon({
          className: 'region-marker',
          html: `
            <div style="
              width: 12px;
              height: 12px;
              background: #64748b;
              border: 2px solid #94a3b8;
              border-radius: 50%;
            "></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        L.marker([region.latitude, region.longitude], { icon: markerIcon })
          .bindTooltip(region.name, { permanent: false, direction: 'top' })
          .addTo(map);
      });
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const getRiskColor = (level: DetectionRiskLevel) => {
    switch (level) {
      case 'Severe Risk': return 'text-neon-red';
      case 'High Risk': return 'text-neon-amber';
      case 'Moderate Risk': return 'text-yellow-400';
      case 'Low Risk': return 'text-neon-teal';
      default: return 'text-slate-400';
    }
  };

  const getRiskBgColor = (level: DetectionRiskLevel) => {
    switch (level) {
      case 'Severe Risk': return 'bg-neon-red/20 border-neon-red/50';
      case 'High Risk': return 'bg-neon-amber/20 border-neon-amber/50';
      case 'Moderate Risk': return 'bg-yellow-400/20 border-yellow-400/50';
      case 'Low Risk': return 'bg-neon-teal/20 border-neon-teal/50';
      default: return 'bg-slate-800 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-neon-red/20 to-neon-amber/20 border border-neon-red/30">
              <Activity size={24} className="text-neon-red" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Real-Time Disaster Detection Engine</h2>
              <p className="text-sm text-slate-400">AI-powered disaster detection using live environmental inputs</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Simulation Mode */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-3">
            <Play size={18} className="text-neon-teal" />
            <span className="text-sm font-medium text-white">Demo Simulation Mode</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SIMULATION_SCENARIOS).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => handleSimulate(key as keyof typeof SIMULATION_SCENARIOS)}
                className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm text-slate-300 hover:text-white transition-colors border border-slate-600 hover:border-neon-teal"
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="glow-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={20} className="text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Environmental Data Input</h3>
          </div>

          <div className="space-y-5">
            {/* Region Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Region</label>
              <select
                value={inputs.region}
                onChange={(e) => setInputs({ ...inputs, region: e.target.value as DetectionRegion })}
                className="select-field w-full"
              >
                {REGIONS.map((region) => (
                  <option key={region.name} value={region.name}>{region.name}</option>
                ))}
              </select>
            </div>

            {/* Rainfall Intensity Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Droplets size={16} className="text-neon-blue" />
                  Rainfall Intensity
                </label>
                <span className="text-sm font-bold text-neon-blue">{inputs.rainfallIntensity} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="400"
                value={inputs.rainfallIntensity}
                onChange={(e) => setInputs({ ...inputs, rainfallIntensity: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0 mm</span>
                <span>200 mm (Flood threshold)</span>
                <span>400 mm</span>
              </div>
            </div>

            {/* River Water Level */}
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                <Waves size={16} className="text-neon-teal" />
                River Water Level
              </label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as WaterLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setInputs({ ...inputs, waterLevel: level })}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      inputs.waterLevel === level
                        ? 'bg-neon-teal/20 border-neon-teal text-neon-teal'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Wind Speed Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Wind size={16} className="text-neon-amber" />
                  Wind Speed
                </label>
                <span className="text-sm font-bold text-neon-amber">{inputs.windSpeed} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={inputs.windSpeed}
                onChange={(e) => setInputs({ ...inputs, windSpeed: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-amber"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0 km/h</span>
                <span>120 km/h (Cyclone threshold)</span>
                <span>250 km/h</span>
              </div>
            </div>

            {/* Seismic Activity Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Activity size={16} className="text-neon-red" />
                  Seismic Activity (Richter)
                </label>
                <span className="text-sm font-bold text-neon-red">{inputs.seismicActivity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={inputs.seismicActivity}
                onChange={(e) => setInputs({ ...inputs, seismicActivity: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-red"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0.0</span>
                <span>5.5 (Earthquake threshold)</span>
                <span>10.0</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Thermometer size={16} className="text-orange-400" />
                  Temperature
                </label>
                <span className="text-sm font-bold text-orange-400">{inputs.temperature}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="55"
                value={inputs.temperature}
                onChange={(e) => setInputs({ ...inputs, temperature: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-400"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0°C</span>
                <span>38°C (Wildfire threshold)</span>
                <span>55°C</span>
              </div>
            </div>

            {/* Soil Saturation */}
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                <Mountain size={16} className="text-amber-600" />
                Soil Saturation Level
              </label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as SaturationLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setInputs({ ...inputs, soilSaturation: level })}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      inputs.soilSaturation === level
                        ? 'bg-amber-600/20 border-amber-600 text-amber-500'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Vegetation Dryness */}
            <div>
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                <TreePine size={16} className="text-green-500" />
                Vegetation Dryness Index
              </label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as DrynessIndex[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setInputs({ ...inputs, vegetationDryness: level })}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-all ${
                      inputs.vegetationDryness === level
                        ? 'bg-green-500/20 border-green-500 text-green-400'
                        : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Detect Button */}
            <button
              onClick={handleDetect}
              disabled={isDetecting}
              className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDetecting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <AlertTriangle size={20} />
                  Detect Disaster Risk
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Detection Result */}
          {result && (
            <div className={`glow-card p-6 border-2 ${getRiskBgColor(result.riskLevel)}`}>
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className={getRiskColor(result.riskLevel)} />
                <h3 className="text-lg font-semibold text-white">Detection Result</h3>
              </div>

              <div className="space-y-4">
                {/* Main Result */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Detected Disaster</p>
                      <p className={`text-xl font-bold ${result.disasterType === 'No Disaster Detected' ? 'text-neon-teal' : getRiskColor(result.riskLevel)}`}>
                        {result.disasterType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Risk Level</p>
                      <p className={`text-xl font-bold ${getRiskColor(result.riskLevel)}`}>
                        {result.riskLevel}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Region</p>
                      <p className="text-lg font-medium text-white">{result.region}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Risk Score</p>
                      <p className={`text-lg font-bold ${getRiskColor(result.riskLevel)}`}>
                        {result.riskScore}/100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Environmental Summary */}
                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Environmental Conditions</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rainfall:</span>
                      <span className="text-white font-medium">{result.environmentalConditions.rainfallIntensity} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Water Level:</span>
                      <span className="text-white font-medium">{result.environmentalConditions.waterLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Wind Speed:</span>
                      <span className="text-white font-medium">{result.environmentalConditions.windSpeed} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Seismic:</span>
                      <span className="text-white font-medium">{result.environmentalConditions.seismicActivity.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temperature:</span>
                      <span className="text-white font-medium">{result.environmentalConditions.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Soil Saturation:</span>
                      <span className="text-white font-medium">{result.environmentalConditions.soilSaturation}</span>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className={`rounded-lg p-4 ${getRiskBgColor(result.riskLevel)}`}>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Recommended Action</p>
                  <p className={`text-sm font-medium ${getRiskColor(result.riskLevel)}`}>
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Explanation Panel */}
          {result && (
            <div className="glow-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain size={20} className="text-neon-blue" />
                <h3 className="text-lg font-semibold text-white">AI Detection Explanation</h3>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-slate-300 leading-relaxed">{result.explanation}</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} />
                <span>Detected at {result.timestamp.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Placeholder when no result */}
          {!result && (
            <div className="glow-card p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="p-4 rounded-full bg-slate-800 mb-4">
                <AlertTriangle size={40} className="text-slate-600" />
              </div>
              <h4 className="text-lg font-medium text-slate-400 mb-2">No Detection Yet</h4>
              <p className="text-sm text-slate-500 max-w-xs">
                Adjust the environmental parameters and click "Detect Disaster Risk" to analyze conditions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Map Visualization */}
      <div className="glow-card overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Real-Time Detection Map</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-red animate-pulse"></div>
              <span className="text-slate-400">Severe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-amber"></div>
              <span className="text-slate-400">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <span className="text-slate-400">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-teal"></div>
              <span className="text-slate-400">Low</span>
            </div>
          </div>
        </div>
        <div 
          ref={mapRef} 
          className="h-[400px] w-full"
          style={{ background: '#0f172a' }}
        />
      </div>

      {/* Detection History */}
      {detectionHistory.length > 0 && (
        <div className="glow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={20} className="text-neon-teal" />
            <h3 className="text-lg font-semibold text-white">Detection History</h3>
            <span className="ml-auto text-sm text-slate-400">{detectionHistory.length} detections</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Region</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Disaster Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Risk Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Conditions</th>
                </tr>
              </thead>
              <tbody>
                {detectionHistory.slice(0, 5).map((detection) => (
                  <tr key={detection.id} className="border-b border-slate-700/50 hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {detection.timestamp.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-white font-medium">
                      {detection.region}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${
                        detection.disasterType === 'No Disaster Detected' ? 'text-slate-400' : getRiskColor(detection.riskLevel)
                      }`}>
                        {detection.disasterType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskBgColor(detection.riskLevel)} ${getRiskColor(detection.riskLevel)}`}>
                        {detection.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      Rain: {detection.environmentalConditions.rainfallIntensity}mm, 
                      Wind: {detection.environmentalConditions.windSpeed}km/h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
