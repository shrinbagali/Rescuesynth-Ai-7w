import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AlertTriangle, 
  Activity, 
  Thermometer, 
  Wind, 
  Droplets, 
  Mountain,
  Waves,
  Flame,
  Radio,
  MapPin,
  Clock,
  Shield,
  Play,
  Pause,
  Zap,
  Bell,
  X,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Brain,
  Rewind,
  FastForward,
  SkipBack,
  SkipForward,
  Users,
  Truck,
  Heart,
  Home,
  Target
} from 'lucide-react';
import type { Map as LeafletMap, Marker, Circle } from 'leaflet';
import { 
  MonitoredRegion, 
  DisasterAlert, 
  MonitoringEvent,
  MonitoringRegion,
  MonitoringEnvironmentalData,
  DisasterType,
  DetectionRiskLevel,
  RiverWaterLevel,
  MonitoringStatus,
  EarlyWarningPrediction,
  TimelineSnapshot,
  RescueRecommendation
} from '../types';

interface LiveMonitoringProps {
  onAlertTriggered?: (alert: DisasterAlert) => void;
  alertHistory?: DisasterAlert[];
}

// Region configurations
const MONITORED_REGIONS: Omit<MonitoredRegion, 'environmentalData' | 'lastUpdate' | 'status'>[] = [
  { id: 'kerala', name: 'Kerala Coastal Region', latitude: 9.9312, longitude: 76.2673, disasterProne: 'Flood' },
  { id: 'assam', name: 'Assam Flood Plains', latitude: 26.2006, longitude: 92.9376, disasterProne: 'Flood' },
  { id: 'odisha', name: 'Odisha Cyclone Belt', latitude: 20.9517, longitude: 85.0985, disasterProne: 'Cyclone' },
  { id: 'uttarakhand', name: 'Uttarakhand Himalayan Region', latitude: 30.0668, longitude: 79.0193, disasterProne: 'Landslide' },
  { id: 'california', name: 'California Forest Zone', latitude: 36.7783, longitude: -119.4179, disasterProne: 'Wildfire' },
  { id: 'japan', name: 'Japan Seismic Zone', latitude: 36.2048, longitude: 138.2529, disasterProne: 'Earthquake' },
];

const getDisasterIcon = (type: DisasterType) => {
  switch (type) {
    case 'Flood': return <Waves size={16} />;
    case 'Cyclone': return <Wind size={16} />;
    case 'Earthquake': return <Activity size={16} />;
    case 'Wildfire': return <Flame size={16} />;
    case 'Landslide': return <Mountain size={16} />;
    default: return <AlertTriangle size={16} />;
  }
};

const getRiskColor = (level: DetectionRiskLevel) => {
  switch (level) {
    case 'Severe Risk': return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', color: '#ef4444' };
    case 'High Risk': return { bg: 'bg-orange-500/20', border: 'border-orange-500', text: 'text-orange-400', color: '#f97316' };
    case 'Moderate Risk': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', color: '#eab308' };
    case 'Low Risk': return { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', color: '#22c55e' };
    default: return { bg: 'bg-slate-500/20', border: 'border-slate-500', text: 'text-slate-400', color: '#64748b' };
  }
};

const getStatusColor = (status: MonitoringStatus) => {
  switch (status) {
    case 'Critical': return 'bg-red-500';
    case 'Alert': return 'bg-orange-500';
    case 'Monitoring': return 'bg-yellow-500';
    case 'Normal': return 'bg-green-500';
    default: return 'bg-slate-500';
  }
};

// Generate random environmental data
const generateEnvironmentalData = (region: MonitoringRegion, isExtreme = false): MonitoringEnvironmentalData => {
  const baseValues: Record<MonitoringRegion, Partial<MonitoringEnvironmentalData>> = {
    'Kerala Coastal Region': { rainfall: 120, riverLevel: 'Medium' as RiverWaterLevel, humidity: 85, temperature: 28 },
    'Assam Flood Plains': { rainfall: 150, riverLevel: 'High' as RiverWaterLevel, humidity: 90, temperature: 30 },
    'Odisha Cyclone Belt': { windSpeed: 80, humidity: 75, temperature: 32 },
    'Uttarakhand Himalayan Region': { rainfall: 100, soilSaturation: 60, temperature: 18 },
    'California Forest Zone': { temperature: 38, drynessIndex: 70, humidity: 20 },
    'Japan Seismic Zone': { seismicActivity: 3.5, temperature: 22 },
  };

  const base = baseValues[region] || {};
  const variation = isExtreme ? 1.8 : 0.3;

  return {
    rainfall: Math.round((base.rainfall || 50) * (1 + (Math.random() - 0.5) * variation)),
    riverLevel: isExtreme && (region === 'Kerala Coastal Region' || region === 'Assam Flood Plains') 
      ? 'Critical' 
      : (base.riverLevel || (['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as RiverWaterLevel)),
    windSpeed: Math.round((base.windSpeed || 30) * (1 + (Math.random() - 0.5) * variation)),
    seismicActivity: parseFloat(((base.seismicActivity || 2) * (1 + (Math.random() - 0.5) * variation)).toFixed(1)),
    temperature: Math.round((base.temperature || 25) * (1 + (Math.random() - 0.2) * variation * 0.5)),
    humidity: Math.round((base.humidity || 60) * (1 + (Math.random() - 0.5) * 0.3)),
    soilSaturation: Math.round((base.soilSaturation || 40) * (1 + (Math.random() - 0.5) * variation)),
    drynessIndex: Math.round((base.drynessIndex || 30) * (1 + (Math.random() - 0.5) * variation)),
    timestamp: new Date(),
  };
};

// Disaster detection logic
const detectDisaster = (region: MonitoringRegion, data: MonitoringEnvironmentalData): { detected: boolean; type: DisasterType | null; riskLevel: DetectionRiskLevel; recommendation: string } => {
  if ((region === 'Kerala Coastal Region' || region === 'Assam Flood Plains') && 
      data.rainfall > 200 && (data.riverLevel === 'High' || data.riverLevel === 'Critical')) {
    const riskLevel: DetectionRiskLevel = data.riverLevel === 'Critical' ? 'Severe Risk' : 'High Risk';
    return { detected: true, type: 'Flood', riskLevel, recommendation: 'Evacuate low-lying areas immediately. Move to higher ground.' };
  }
  if (region === 'Odisha Cyclone Belt' && data.windSpeed > 120) {
    const riskLevel: DetectionRiskLevel = data.windSpeed > 150 ? 'Severe Risk' : 'High Risk';
    return { detected: true, type: 'Cyclone', riskLevel, recommendation: 'Seek shelter in reinforced buildings. Stay away from windows.' };
  }
  if (region === 'Japan Seismic Zone' && data.seismicActivity > 5.5) {
    const riskLevel: DetectionRiskLevel = data.seismicActivity > 7 ? 'Severe Risk' : data.seismicActivity > 6 ? 'High Risk' : 'Moderate Risk';
    return { detected: true, type: 'Earthquake', riskLevel, recommendation: 'Drop, Cover, and Hold On. Be prepared for aftershocks.' };
  }
  if (region === 'California Forest Zone' && data.temperature > 38 && data.drynessIndex > 70) {
    const riskLevel: DetectionRiskLevel = data.temperature > 42 ? 'Severe Risk' : 'High Risk';
    return { detected: true, type: 'Wildfire', riskLevel, recommendation: 'Prepare for evacuation. Clear vegetation near structures.' };
  }
  if (region === 'Uttarakhand Himalayan Region' && data.rainfall > 180 && data.soilSaturation > 80) {
    const riskLevel: DetectionRiskLevel = data.soilSaturation > 90 ? 'Severe Risk' : 'High Risk';
    return { detected: true, type: 'Landslide', riskLevel, recommendation: 'Evacuate hillside areas. Avoid roads near slopes.' };
  }
  return { detected: false, type: null, riskLevel: 'Low Risk', recommendation: '' };
};

// Generate rescue recommendations
const generateRescueRecommendation = (alert: DisasterAlert): RescueRecommendation => {
  const recommendations: Record<DisasterType, { actions: string[]; resources: string[]; evacuationZones: string[] }> = {
    'Flood': {
      actions: ['Evacuate low-lying areas immediately', 'Deploy rescue boats to affected zones', 'Set up emergency shelters on higher ground', 'Establish communication centers', 'Coordinate with local authorities'],
      resources: ['Rescue boats (50+)', 'Life jackets (500+)', 'Emergency medical kits', 'Portable water pumps', 'Food supplies for 5000 people'],
      evacuationZones: ['Coastal villages', 'River bank settlements', 'Low-lying urban areas', 'Agricultural zones near water bodies']
    },
    'Cyclone': {
      actions: ['Issue evacuation orders for coastal areas', 'Secure all outdoor structures', 'Open cyclone shelters', 'Pre-position emergency response teams', 'Establish emergency communication lines'],
      resources: ['Cyclone shelters (10+)', 'Emergency generators', 'Medical response units', 'Heavy machinery for debris clearance', 'Satellite communication equipment'],
      evacuationZones: ['Coastal settlements within 5km', 'Fishing villages', 'Low-rise buildings', 'Mobile home parks']
    },
    'Earthquake': {
      actions: ['Activate search and rescue teams', 'Deploy structural assessment teams', 'Set up triage centers', 'Secure gas and electrical lines', 'Establish temporary shelters'],
      resources: ['Search and rescue dogs', 'Heavy lifting equipment', 'Medical trauma units', 'Structural engineers', 'Emergency food and water supplies'],
      evacuationZones: ['Buildings with visible damage', 'Areas near fault lines', 'Older unreinforced structures', 'Landslide-prone slopes']
    },
    'Wildfire': {
      actions: ['Establish fire containment lines', 'Evacuate residents in fire path', 'Deploy aerial firefighting units', 'Set up animal rescue operations', 'Coordinate with forestry services'],
      resources: ['Firefighting aircraft', 'Ground firefighting crews', 'Water tankers', 'Evacuation buses', 'Emergency veterinary services'],
      evacuationZones: ['Homes within 1km of fire', 'Forest-adjacent communities', 'Areas with limited escape routes', 'Wildlife corridors']
    },
    'Landslide': {
      actions: ['Evacuate hillside communities', 'Block affected roadways', 'Deploy geotechnical assessment teams', 'Set up monitoring stations', 'Prepare for secondary slides'],
      resources: ['Earth-moving equipment', 'Geological survey teams', 'Road repair crews', 'Emergency shelters', 'Search and rescue teams'],
      evacuationZones: ['Mountain villages', 'Steep slope settlements', 'Areas below unstable terrain', 'Road corridors through hills']
    }
  };

  const rec = recommendations[alert.disasterType];
  return {
    id: `rescue-${Date.now()}`,
    disasterType: alert.disasterType,
    region: alert.region,
    priority: alert.riskLevel === 'Severe Risk' ? 'Critical' : alert.riskLevel === 'High Risk' ? 'High' : 'Medium',
    actions: rec.actions,
    resources: rec.resources,
    evacuationZones: rec.evacuationZones,
    timestamp: new Date()
  };
};

export default function LiveMonitoring({ onAlertTriggered }: LiveMonitoringProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [regions, setRegions] = useState<MonitoredRegion[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<DisasterAlert[]>([]);
  const [eventHistory, setEventHistory] = useState<MonitoringEvent[]>([]);
  const [showNotification, setShowNotification] = useState<DisasterAlert | null>(null);
  const [updateInterval, setUpdateInterval] = useState(15);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  // AI Early Warning State
  const [dataHistory, setDataHistory] = useState<Map<MonitoringRegion, MonitoringEnvironmentalData[]>>(new Map());
  const [predictions, setPredictions] = useState<EarlyWarningPrediction[]>([]);
  
  // Timeline Replay State
  const [timelineSnapshots, setTimelineSnapshots] = useState<TimelineSnapshot[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState(0);
  const [replaySpeed, setReplaySpeed] = useState(1);
  
  // Rescue Recommendations State
  const [rescueRecommendations, setRescueRecommendations] = useState<RescueRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<RescueRecommendation | null>(null);
  
  // Active Tab
  const [activeTab, setActiveTab] = useState<'monitoring' | 'earlywarning' | 'timeline' | 'rescue'>('monitoring');
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const circlesRef = useRef<Map<string, Circle>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const replayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize regions
  useEffect(() => {
    const initialRegions: MonitoredRegion[] = MONITORED_REGIONS.map(r => ({
      ...r,
      status: 'Normal' as MonitoringStatus,
      environmentalData: generateEnvironmentalData(r.name),
      lastUpdate: new Date(),
    }));
    setRegions(initialRegions);
    
    // Initialize data history
    const initialHistory = new Map<MonitoringRegion, MonitoringEnvironmentalData[]>();
    MONITORED_REGIONS.forEach(r => {
      initialHistory.set(r.name, [generateEnvironmentalData(r.name)]);
    });
    setDataHistory(initialHistory);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      if (!mapRef.current) return;
      
      const map = L.map(mapRef.current).setView([25, 80], 3);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CartoDB',
        maxZoom: 19,
      }).addTo(map);

      MONITORED_REGIONS.forEach((region) => {
        const markerIcon = L.divIcon({
          className: 'region-marker',
          html: `<div style="width: 16px; height: 16px; background: #22c55e; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px #22c55e80;"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([region.latitude, region.longitude], { icon: markerIcon });
        marker.bindTooltip(region.name, { permanent: false, direction: 'top' });
        marker.addTo(map);
        markersRef.current.set(region.id, marker);
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

  // AI Early Warning Analysis
  const analyzeTraindsAndPredict = useCallback((history: Map<MonitoringRegion, MonitoringEnvironmentalData[]>) => {
    const newPredictions: EarlyWarningPrediction[] = [];
    
    history.forEach((dataPoints, region) => {
      if (dataPoints.length < 3) return;
      
      const recentData = dataPoints.slice(-10);
      const regionConfig = MONITORED_REGIONS.find(r => r.name === region);
      if (!regionConfig) return;
      
      // Calculate trends
      const rainfallTrend = recentData.length > 1 
        ? (recentData[recentData.length - 1].rainfall - recentData[0].rainfall) / recentData.length 
        : 0;
      const windTrend = recentData.length > 1 
        ? (recentData[recentData.length - 1].windSpeed - recentData[0].windSpeed) / recentData.length 
        : 0;
      const tempTrend = recentData.length > 1 
        ? (recentData[recentData.length - 1].temperature - recentData[0].temperature) / recentData.length 
        : 0;
      const seismicTrend = recentData.length > 1 
        ? (recentData[recentData.length - 1].seismicActivity - recentData[0].seismicActivity) / recentData.length 
        : 0;
      
      const latestData = recentData[recentData.length - 1];
      let prediction: EarlyWarningPrediction | null = null;
      
      // Flood prediction
      if ((region === 'Kerala Coastal Region' || region === 'Assam Flood Plains') && 
          rainfallTrend > 5 && latestData.rainfall > 150) {
        const confidence = Math.min(95, 50 + rainfallTrend * 5 + (latestData.rainfall - 150) * 0.2);
        prediction = {
          id: `pred-${Date.now()}-${region}`,
          region,
          predictedDisasterType: 'Flood',
          confidenceScore: Math.round(confidence),
          estimatedTimeWindow: rainfallTrend > 10 ? '6-12 hours' : '12-24 hours',
          trendAnalysis: [
            { parameter: 'Rainfall', trend: rainfallTrend > 0 ? 'increasing' : 'decreasing', rate: Math.abs(rainfallTrend) },
            { parameter: 'River Level', trend: latestData.riverLevel === 'High' || latestData.riverLevel === 'Critical' ? 'increasing' : 'stable', rate: 0 }
          ],
          timestamp: new Date()
        };
      }
      
      // Cyclone prediction
      if (region === 'Odisha Cyclone Belt' && windTrend > 3 && latestData.windSpeed > 80) {
        const confidence = Math.min(95, 45 + windTrend * 8 + (latestData.windSpeed - 80) * 0.3);
        prediction = {
          id: `pred-${Date.now()}-${region}`,
          region,
          predictedDisasterType: 'Cyclone',
          confidenceScore: Math.round(confidence),
          estimatedTimeWindow: windTrend > 8 ? '6-12 hours' : '12-24 hours',
          trendAnalysis: [
            { parameter: 'Wind Speed', trend: windTrend > 0 ? 'increasing' : 'decreasing', rate: Math.abs(windTrend) }
          ],
          timestamp: new Date()
        };
      }
      
      // Earthquake prediction (based on minor seismic activity)
      if (region === 'Japan Seismic Zone' && seismicTrend > 0.2 && latestData.seismicActivity > 4) {
        const confidence = Math.min(85, 40 + seismicTrend * 20 + (latestData.seismicActivity - 4) * 10);
        prediction = {
          id: `pred-${Date.now()}-${region}`,
          region,
          predictedDisasterType: 'Earthquake',
          confidenceScore: Math.round(confidence),
          estimatedTimeWindow: '0-6 hours',
          trendAnalysis: [
            { parameter: 'Seismic Activity', trend: seismicTrend > 0 ? 'increasing' : 'decreasing', rate: Math.abs(seismicTrend) }
          ],
          timestamp: new Date()
        };
      }
      
      // Wildfire prediction
      if (region === 'California Forest Zone' && tempTrend > 0.5 && latestData.temperature > 35 && latestData.drynessIndex > 60) {
        const confidence = Math.min(95, 50 + tempTrend * 10 + (latestData.drynessIndex - 60) * 0.5);
        prediction = {
          id: `pred-${Date.now()}-${region}`,
          region,
          predictedDisasterType: 'Wildfire',
          confidenceScore: Math.round(confidence),
          estimatedTimeWindow: latestData.drynessIndex > 80 ? '12-24 hours' : '24-48 hours',
          trendAnalysis: [
            { parameter: 'Temperature', trend: tempTrend > 0 ? 'increasing' : 'decreasing', rate: Math.abs(tempTrend) },
            { parameter: 'Dryness Index', trend: latestData.drynessIndex > 70 ? 'increasing' : 'stable', rate: 0 }
          ],
          timestamp: new Date()
        };
      }
      
      // Landslide prediction
      if (region === 'Uttarakhand Himalayan Region' && rainfallTrend > 4 && latestData.soilSaturation > 60) {
        const confidence = Math.min(95, 45 + rainfallTrend * 6 + (latestData.soilSaturation - 60) * 0.8);
        prediction = {
          id: `pred-${Date.now()}-${region}`,
          region,
          predictedDisasterType: 'Landslide',
          confidenceScore: Math.round(confidence),
          estimatedTimeWindow: latestData.soilSaturation > 80 ? '6-12 hours' : '12-24 hours',
          trendAnalysis: [
            { parameter: 'Rainfall', trend: rainfallTrend > 0 ? 'increasing' : 'decreasing', rate: Math.abs(rainfallTrend) },
            { parameter: 'Soil Saturation', trend: latestData.soilSaturation > 70 ? 'increasing' : 'stable', rate: 0 }
          ],
          timestamp: new Date()
        };
      }
      
      if (prediction && prediction.confidenceScore > 50) {
        newPredictions.push(prediction);
      }
    });
    
    setPredictions(newPredictions);
  }, []);

  // Update map markers
  const updateMapMarkers = useCallback(async (updatedRegions: MonitoredRegion[], alerts: DisasterAlert[]) => {
    if (!mapInstanceRef.current) return;
    
    const L = await import('leaflet');

    updatedRegions.forEach((region) => {
      const regionConfig = MONITORED_REGIONS.find(r => r.name === region.name);
      if (!regionConfig) return;

      const alert = alerts.find(a => a.region === region.name && a.isActive);
      const statusColor = region.status === 'Critical' ? '#ef4444' : 
                         region.status === 'Alert' ? '#f97316' : 
                         region.status === 'Monitoring' ? '#eab308' : '#22c55e';

      const existingMarker = markersRef.current.get(regionConfig.id);
      if (existingMarker) existingMarker.remove();

      const markerIcon = L.divIcon({
        className: 'region-marker',
        html: `<div style="width: ${alert ? '24px' : '16px'}; height: ${alert ? '24px' : '16px'}; background: ${alert ? getRiskColor(alert.riskLevel).color : statusColor}; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 ${alert ? '20px' : '10px'} ${alert ? getRiskColor(alert.riskLevel).color : statusColor}80; ${alert ? 'animation: pulse 1s infinite;' : ''}"></div>`,
        iconSize: [alert ? 24 : 16, alert ? 24 : 16],
        iconAnchor: [alert ? 12 : 8, alert ? 12 : 8],
      });

      const marker = L.marker([region.latitude, region.longitude], { icon: markerIcon });
      marker.bindTooltip(`${region.name}${alert ? ` - ${alert.disasterType} ${alert.riskLevel}` : ''}`, { permanent: false, direction: 'top' });
      marker.addTo(mapInstanceRef.current!);
      markersRef.current.set(regionConfig.id, marker);

      const existingCircle = circlesRef.current.get(regionConfig.id);
      if (existingCircle) existingCircle.remove();

      if (alert) {
        const radiusMultiplier = alert.riskLevel === 'Severe Risk' ? 150000 : alert.riskLevel === 'High Risk' ? 100000 : 50000;
        const circle = L.circle([region.latitude, region.longitude], {
          color: getRiskColor(alert.riskLevel).color,
          fillColor: getRiskColor(alert.riskLevel).color,
          fillOpacity: 0.2,
          radius: radiusMultiplier,
          weight: 2,
        });
        circle.addTo(mapInstanceRef.current!);
        circlesRef.current.set(regionConfig.id, circle);
      }
    });
  }, []);

  // Process monitoring cycle
  const processMonitoringCycle = useCallback(() => {
    setRegions(prevRegions => {
      const updatedRegions = prevRegions.map(region => {
        const newData = generateEnvironmentalData(region.name);
        const detection = detectDisaster(region.name, newData);
        
        let newStatus: MonitoringStatus = 'Normal';
        if (detection.detected) {
          newStatus = detection.riskLevel === 'Severe Risk' ? 'Critical' : 
                     detection.riskLevel === 'High Risk' ? 'Alert' : 'Monitoring';
        }

        return { ...region, environmentalData: newData, status: newStatus, lastUpdate: new Date() };
      });

      // Update data history for AI predictions
      setDataHistory(prev => {
        const newHistory = new Map(prev);
        updatedRegions.forEach(region => {
          const existing = newHistory.get(region.name) || [];
          newHistory.set(region.name, [...existing.slice(-9), region.environmentalData]);
        });
        analyzeTraindsAndPredict(newHistory);
        return newHistory;
      });

      // Save timeline snapshot
      setTimelineSnapshots(prev => [...prev.slice(-29), {
        id: `snapshot-${Date.now()}`,
        timestamp: new Date(),
        regions: updatedRegions.map(r => ({ name: r.name, environmentalData: r.environmentalData, status: r.status })),
        alerts: activeAlerts.filter(a => a.isActive)
      }]);

      // Check for disasters and create alerts
      const newAlerts: DisasterAlert[] = [];
      updatedRegions.forEach(region => {
        const detection = detectDisaster(region.name, region.environmentalData);
        if (detection.detected && detection.type) {
          const existingAlert = activeAlerts.find(a => a.region === region.name && a.disasterType === detection.type && a.isActive);
          if (!existingAlert) {
            const alert: DisasterAlert = {
              id: `alert-${Date.now()}-${region.name}`,
              disasterType: detection.type,
              region: region.name,
              riskLevel: detection.riskLevel,
              environmentalData: region.environmentalData,
              timestamp: new Date(),
              recommendation: detection.recommendation,
              isActive: true,
            };
            newAlerts.push(alert);
            
            // Generate rescue recommendation
            const rescue = generateRescueRecommendation(alert);
            setRescueRecommendations(prev => [rescue, ...prev].slice(0, 10));
            
            setEventHistory(prev => [{
              id: `event-${Date.now()}-${region.name}`,
              region: region.name,
              disasterType: detection.type,
              riskLevel: detection.riskLevel,
              environmentalData: region.environmentalData,
              timestamp: new Date(),
            }, ...prev].slice(0, 50));
            
            setShowNotification(alert);
            setTimeout(() => setShowNotification(null), 8000);
            
            if (onAlertTriggered) onAlertTriggered(alert);
          }
        }
      });

      if (newAlerts.length > 0) {
        setActiveAlerts(prev => [...newAlerts, ...prev]);
      }

      updateMapMarkers(updatedRegions, [...newAlerts, ...activeAlerts]);
      setLastUpdateTime(new Date());

      return updatedRegions;
    });
  }, [activeAlerts, onAlertTriggered, updateMapMarkers, analyzeTraindsAndPredict]);

  // Monitoring interval
  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(processMonitoringCycle, updateInterval * 1000);
      processMonitoringCycle();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isMonitoring, updateInterval, processMonitoringCycle]);

  // Timeline replay
  useEffect(() => {
    if (isReplaying && timelineSnapshots.length > 0) {
      replayIntervalRef.current = setInterval(() => {
        setReplayIndex(prev => {
          if (prev >= timelineSnapshots.length - 1) {
            setIsReplaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / replaySpeed);
    } else {
      if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    }
    return () => { if (replayIntervalRef.current) clearInterval(replayIntervalRef.current); };
  }, [isReplaying, replaySpeed, timelineSnapshots.length]);

  // Simulate extreme event
  const simulateExtremeEvent = () => {
    const randomRegion = MONITORED_REGIONS[Math.floor(Math.random() * MONITORED_REGIONS.length)];
    const extremeData = generateEnvironmentalData(randomRegion.name, true);
    
    if (randomRegion.disasterProne === 'Flood') {
      extremeData.rainfall = 280;
      extremeData.riverLevel = 'Critical';
    } else if (randomRegion.disasterProne === 'Cyclone') {
      extremeData.windSpeed = 160;
    } else if (randomRegion.disasterProne === 'Earthquake') {
      extremeData.seismicActivity = 6.8;
    } else if (randomRegion.disasterProne === 'Wildfire') {
      extremeData.temperature = 44;
      extremeData.drynessIndex = 90;
    } else if (randomRegion.disasterProne === 'Landslide') {
      extremeData.rainfall = 220;
      extremeData.soilSaturation = 95;
    }

    setRegions(prev => prev.map(r => 
      r.name === randomRegion.name ? { ...r, environmentalData: extremeData, lastUpdate: new Date() } : r
    ));

    const detection = detectDisaster(randomRegion.name, extremeData);
    if (detection.detected && detection.type) {
      const alert: DisasterAlert = {
        id: `alert-${Date.now()}-${randomRegion.name}`,
        disasterType: detection.type,
        region: randomRegion.name,
        riskLevel: detection.riskLevel,
        environmentalData: extremeData,
        timestamp: new Date(),
        recommendation: detection.recommendation,
        isActive: true,
      };
      
      setActiveAlerts(prev => [alert, ...prev]);
      setShowNotification(alert);
      setTimeout(() => setShowNotification(null), 8000);
      
      const rescue = generateRescueRecommendation(alert);
      setRescueRecommendations(prev => [rescue, ...prev].slice(0, 10));

      setEventHistory(prev => [{
        id: `event-${Date.now()}-${randomRegion.name}`,
        region: randomRegion.name,
        disasterType: detection.type,
        riskLevel: detection.riskLevel,
        environmentalData: extremeData,
        timestamp: new Date(),
      }, ...prev].slice(0, 50));

      setRegions(prevRegions => {
        const updatedRegions = prevRegions.map(r => 
          r.name === randomRegion.name ? { ...r, status: 'Critical' as MonitoringStatus, environmentalData: extremeData } : r
        );
        updateMapMarkers(updatedRegions, [alert, ...activeAlerts]);
        return updatedRegions;
      });

      if (onAlertTriggered) onAlertTriggered(alert);
    }
  };

  const dismissAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isActive: false } : a));
  };

  const currentSnapshot = isReplaying && timelineSnapshots[replayIndex] ? timelineSnapshots[replayIndex] : null;

  return (
    <div className="space-y-6 relative">
      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in">
          <div className={`${getRiskColor(showNotification.riskLevel).bg} border ${getRiskColor(showNotification.riskLevel).border} rounded-xl p-6 shadow-2xl max-w-md`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full ${getRiskColor(showNotification.riskLevel).bg} flex items-center justify-center animate-pulse`}>
                {getDisasterIcon(showNotification.disasterType)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={getRiskColor(showNotification.riskLevel).text} size={20} />
                    <span className={`font-bold ${getRiskColor(showNotification.riskLevel).text}`}>ALERT</span>
                  </div>
                  <button onClick={() => setShowNotification(null)} className="text-slate-400 hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{showNotification.disasterType} Risk Detected</h3>
                <p className="text-slate-300 text-sm mb-2">Region: {showNotification.region}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(showNotification.riskLevel).bg} ${getRiskColor(showNotification.riskLevel).text}`}>
                  {showNotification.riskLevel}
                </div>
                <p className="text-slate-400 text-xs mt-2">{showNotification.timestamp.toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="bg-card rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
              <h2 className="text-xl font-bold text-white">Disaster Intelligence Platform</h2>
            </div>
            {lastUpdateTime && (
              <span className="text-sm text-slate-400">Last update: {lastUpdateTime.toLocaleTimeString()}</span>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Interval:</span>
              <select 
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Number(e.target.value))}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value={10}>10s</option>
                <option value={15}>15s</option>
                <option value={20}>20s</option>
                <option value={30}>30s</option>
              </select>
            </div>
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all ${
                isMonitoring 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
              }`}
            >
              {isMonitoring ? <Pause size={18} /> : <Play size={18} />}
              {isMonitoring ? 'Stop' : 'Start'}
            </button>
            <button
              onClick={simulateExtremeEvent}
              className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/20"
            >
              <Zap size={18} />
              Simulate Event
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700/50 pb-2">
        {[
          { id: 'monitoring', label: 'Live Monitoring', icon: <Radio size={16} /> },
          { id: 'earlywarning', label: 'AI Early Warning', icon: <Brain size={16} /> },
          { id: 'timeline', label: 'Timeline Replay', icon: <Clock size={16} /> },
          { id: 'rescue', label: 'Rescue Operations', icon: <Shield size={16} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-slate-800 text-white border-t border-l border-r border-slate-600'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'earlywarning' && predictions.length > 0 && (
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full text-xs">{predictions.length}</span>
            )}
            {tab.id === 'rescue' && rescueRecommendations.length > 0 && (
              <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full text-xs">{rescueRecommendations.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'monitoring' && (
        <div className="grid grid-cols-12 gap-6">
          {/* Live Environmental Data Feed */}
          <div className="col-span-4 space-y-6">
            <div className="bg-card rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Radio className="text-cyan-400" size={20} />
                <h3 className="font-semibold text-white">Live Environmental Data</h3>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {regions.map((region) => (
                  <div key={region.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(region.status)} ${region.status !== 'Normal' ? 'animate-pulse' : ''}`}></div>
                        <span className="text-white font-medium text-sm">{region.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{region.lastUpdate.toLocaleTimeString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Droplets size={12} className="text-blue-400" />
                        <span className="text-slate-400">Rain:</span>
                        <span className="text-white">{region.environmentalData.rainfall} mm</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wind size={12} className="text-cyan-400" />
                        <span className="text-slate-400">Wind:</span>
                        <span className="text-white">{region.environmentalData.windSpeed} km/h</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Thermometer size={12} className="text-red-400" />
                        <span className="text-slate-400">Temp:</span>
                        <span className="text-white">{region.environmentalData.temperature}C</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Activity size={12} className="text-yellow-400" />
                        <span className="text-slate-400">Seismic:</span>
                        <span className="text-white">{region.environmentalData.seismicActivity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Waves size={12} className="text-blue-300" />
                        <span className="text-slate-400">River:</span>
                        <span className={`${region.environmentalData.riverLevel === 'Critical' ? 'text-red-400' : region.environmentalData.riverLevel === 'High' ? 'text-orange-400' : 'text-white'}`}>
                          {region.environmentalData.riverLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp size={12} className="text-green-400" />
                        <span className="text-slate-400">Humid:</span>
                        <span className="text-white">{region.environmentalData.humidity}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Region Status */}
            <div className="bg-card rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-teal-400" size={20} />
                <h3 className="font-semibold text-white">Region Status</h3>
              </div>
              <div className="space-y-2">
                {regions.map((region) => (
                  <div key={region.id} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                    <div className="flex items-center gap-2">
                      {getDisasterIcon(region.disasterProne)}
                      <span className="text-sm text-slate-300">{region.name}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      region.status === 'Critical' ? 'bg-red-500/20 text-red-400' :
                      region.status === 'Alert' ? 'bg-orange-500/20 text-orange-400' :
                      region.status === 'Monitoring' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(region.status)}`}></div>
                      {region.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map and Alerts */}
          <div className="col-span-8 space-y-6">
            {/* Active Alerts */}
            {activeAlerts.filter(a => a.isActive).length > 0 && (
              <div className="bg-card rounded-xl border border-red-500/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="text-red-400 animate-pulse" size={20} />
                  <h3 className="font-semibold text-red-400">Active Alerts ({activeAlerts.filter(a => a.isActive).length})</h3>
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                  {activeAlerts.filter(a => a.isActive).map((alert) => (
                    <div key={alert.id} className={`${getRiskColor(alert.riskLevel).bg} border ${getRiskColor(alert.riskLevel).border} rounded-lg p-4`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full ${getRiskColor(alert.riskLevel).bg} flex items-center justify-center`}>
                            {getDisasterIcon(alert.disasterType)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{alert.disasterType}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(alert.riskLevel).bg} ${getRiskColor(alert.riskLevel).text}`}>
                                {alert.riskLevel}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300">{alert.region}</p>
                            <p className="text-xs text-slate-400 mt-1">{alert.recommendation}</p>
                          </div>
                        </div>
                        <button onClick={() => dismissAlert(alert.id)} className="flex items-center gap-1 text-xs text-slate-400 hover:text-green-400">
                          <CheckCircle size={14} />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Map */}
            <div className="bg-card rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="text-cyan-400" size={20} />
                  <h3 className="font-semibold text-white">Global Disaster Map</h3>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-slate-400">Safe</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-slate-400">Warning</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-slate-400">Critical</span></div>
                </div>
              </div>
              <div ref={mapRef} className="h-[350px] rounded-lg overflow-hidden border border-slate-700/50"></div>
            </div>

            {/* Event History */}
            <div className="bg-card rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-teal-400" size={20} />
                <h3 className="font-semibold text-white">Disaster History</h3>
              </div>
              {eventHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Activity size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No disaster events detected yet</p>
                  <p className="text-sm">Start monitoring to detect disasters</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 border-b border-slate-700/50">
                        <th className="pb-3 font-medium">Region</th>
                        <th className="pb-3 font-medium">Disaster</th>
                        <th className="pb-3 font-medium">Risk</th>
                        <th className="pb-3 font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {eventHistory.slice(0, 8).map((event) => (
                        <tr key={event.id} className="text-slate-300">
                          <td className="py-3">{event.region}</td>
                          <td className="py-3"><div className="flex items-center gap-2">{getDisasterIcon(event.disasterType)}{event.disasterType}</div></td>
                          <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(event.riskLevel).bg} ${getRiskColor(event.riskLevel).text}`}>{event.riskLevel}</span></td>
                          <td className="py-3 text-slate-500">{event.timestamp.toLocaleTimeString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'earlywarning' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <div className="bg-card rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="text-purple-400" size={24} />
                <h3 className="text-xl font-bold text-white">AI Early Warning Prediction System</h3>
              </div>
              
              {predictions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Brain size={60} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No disaster predictions at this time</p>
                  <p className="text-sm mt-2">The AI is analyzing environmental trends. Start monitoring to generate predictions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  {predictions.map((prediction) => (
                    <div key={prediction.id} className={`${getRiskColor(prediction.confidenceScore > 70 ? 'High Risk' : 'Moderate Risk').bg} border ${getRiskColor(prediction.confidenceScore > 70 ? 'High Risk' : 'Moderate Risk').border} rounded-xl p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-full ${getRiskColor(prediction.confidenceScore > 70 ? 'High Risk' : 'Moderate Risk').bg} flex items-center justify-center`}>
                            {getDisasterIcon(prediction.predictedDisasterType)}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-lg">Possible {prediction.predictedDisasterType}</h4>
                            <p className="text-slate-300 text-sm">{prediction.region}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${prediction.confidenceScore > 70 ? 'text-red-400' : 'text-yellow-400'}`}>
                            {prediction.confidenceScore}%
                          </div>
                          <div className="text-xs text-slate-400">Confidence</div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={16} className="text-slate-400" />
                          <span className="text-slate-400 text-sm">Estimated Time Window:</span>
                          <span className="text-white font-medium">{prediction.estimatedTimeWindow}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-slate-400 text-sm font-medium">Trend Analysis:</h5>
                        {prediction.trendAnalysis.map((trend, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-3 py-2">
                            <span className="text-slate-300 text-sm">{trend.parameter}</span>
                            <div className="flex items-center gap-2">
                              {trend.trend === 'increasing' ? (
                                <TrendingUp size={16} className="text-red-400" />
                              ) : trend.trend === 'decreasing' ? (
                                <TrendingDown size={16} className="text-green-400" />
                              ) : (
                                <Activity size={16} className="text-slate-400" />
                              )}
                              <span className={`text-sm font-medium ${
                                trend.trend === 'increasing' ? 'text-red-400' : 
                                trend.trend === 'decreasing' ? 'text-green-400' : 'text-slate-400'
                              }`}>
                                {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-white">Disaster Timeline Replay</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Speed:</span>
                  <select 
                    value={replaySpeed}
                    onChange={(e) => setReplaySpeed(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={2}>2x</option>
                    <option value={4}>4x</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setReplayIndex(0)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"><SkipBack size={18} /></button>
                  <button onClick={() => setReplayIndex(Math.max(0, replayIndex - 1))} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"><Rewind size={18} /></button>
                  <button 
                    onClick={() => setIsReplaying(!isReplaying)}
                    className={`p-2 rounded-lg ${isReplaying ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}
                  >
                    {isReplaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button onClick={() => setReplayIndex(Math.min(timelineSnapshots.length - 1, replayIndex + 1))} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"><FastForward size={18} /></button>
                  <button onClick={() => setReplayIndex(timelineSnapshots.length - 1)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"><SkipForward size={18} /></button>
                </div>
              </div>
            </div>

            {timelineSnapshots.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Clock size={60} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No timeline data available</p>
                <p className="text-sm mt-2">Start monitoring to record environmental changes over time.</p>
              </div>
            ) : (
              <>
                {/* Timeline Slider */}
                <div className="mb-6">
                  <input
                    type="range"
                    min={0}
                    max={timelineSnapshots.length - 1}
                    value={replayIndex}
                    onChange={(e) => setReplayIndex(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <div className="flex justify-between mt-2 text-xs text-slate-400">
                    <span>{timelineSnapshots[0]?.timestamp.toLocaleTimeString()}</span>
                    <span className="text-white font-medium">
                      {currentSnapshot ? currentSnapshot.timestamp.toLocaleTimeString() : '---'}
                    </span>
                    <span>{timelineSnapshots[timelineSnapshots.length - 1]?.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Snapshot View */}
                {currentSnapshot && (
                  <div className="grid grid-cols-3 gap-4">
                    {currentSnapshot.regions.map((region) => (
                      <div key={region.name} className={`bg-slate-800/50 rounded-lg p-4 border ${
                        region.status === 'Critical' ? 'border-red-500/50' : 
                        region.status === 'Alert' ? 'border-orange-500/50' : 'border-slate-700/50'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-white font-medium text-sm">{region.name}</span>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(region.status)}`}></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-slate-400">Rain:</span> <span className="text-white">{region.environmentalData.rainfall} mm</span></div>
                          <div><span className="text-slate-400">Wind:</span> <span className="text-white">{region.environmentalData.windSpeed} km/h</span></div>
                          <div><span className="text-slate-400">Temp:</span> <span className="text-white">{region.environmentalData.temperature}C</span></div>
                          <div><span className="text-slate-400">Seismic:</span> <span className="text-white">{region.environmentalData.seismicActivity}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Active Alerts at this time */}
                {currentSnapshot && currentSnapshot.alerts.length > 0 && (
                  <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h4 className="text-red-400 font-medium mb-3">Active Alerts at {currentSnapshot.timestamp.toLocaleTimeString()}</h4>
                    <div className="flex flex-wrap gap-3">
                      {currentSnapshot.alerts.map((alert) => (
                        <div key={alert.id} className="flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-full">
                          {getDisasterIcon(alert.disasterType)}
                          <span className="text-red-300 text-sm">{alert.disasterType} - {alert.region}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'rescue' && (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-5">
            <div className="bg-card rounded-xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-red-400" size={20} />
                <h3 className="font-semibold text-white">Rescue Operations Queue</h3>
              </div>
              {rescueRecommendations.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Shield size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No active rescue operations</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {rescueRecommendations.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => setSelectedRecommendation(rec)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        selectedRecommendation?.id === rec.id
                          ? 'bg-slate-700/50 border-cyan-500'
                          : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getDisasterIcon(rec.disasterType)}
                          <span className="text-white font-medium">{rec.disasterType}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          rec.priority === 'Critical' ? 'bg-red-500/20 text-red-400' :
                          rec.priority === 'High' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{rec.region}</p>
                      <p className="text-xs text-slate-500 mt-1">{rec.timestamp.toLocaleString()}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-7">
            {selectedRecommendation ? (
              <div className="bg-card rounded-xl border border-slate-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      selectedRecommendation.priority === 'Critical' ? 'bg-red-500/20' : 'bg-orange-500/20'
                    }`}>
                      {getDisasterIcon(selectedRecommendation.disasterType)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedRecommendation.disasterType} Response</h3>
                      <p className="text-slate-400">{selectedRecommendation.region}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    selectedRecommendation.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                    selectedRecommendation.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                  }`}>
                    {selectedRecommendation.priority} Priority
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Recommended Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="text-cyan-400" size={18} />
                      <h4 className="text-white font-semibold">Recommended Actions</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedRecommendation.actions.map((action, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                          <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-slate-300 text-sm">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Resources */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="text-green-400" size={18} />
                      <h4 className="text-white font-semibold">Required Resources</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecommendation.resources.map((resource, idx) => (
                        <span key={idx} className="bg-green-500/10 border border-green-500/30 text-green-300 px-3 py-1.5 rounded-full text-sm">
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Evacuation Zones */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Home className="text-red-400" size={18} />
                      <h4 className="text-white font-semibold">Evacuation Zones</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRecommendation.evacuationZones.map((zone, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                          <Users size={16} className="text-red-400" />
                          <span className="text-red-300 text-sm">{zone}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medical Response */}
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="text-pink-400" size={18} />
                      <h4 className="text-white font-semibold">Medical Response Protocol</h4>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Deploy medical trauma units to affected areas. Establish triage centers at safe locations. 
                      Coordinate with local hospitals for emergency admissions. Prepare for mass casualty incidents.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-slate-700/50 p-6 h-full flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Shield size={60} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a rescue operation</p>
                  <p className="text-sm mt-2">Click on an operation from the queue to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
