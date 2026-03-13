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
  TrendingUp
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
  MonitoringStatus
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
  // Flood Detection
  if ((region === 'Kerala Coastal Region' || region === 'Assam Flood Plains') && 
      data.rainfall > 200 && (data.riverLevel === 'High' || data.riverLevel === 'Critical')) {
    const riskLevel: DetectionRiskLevel = data.riverLevel === 'Critical' ? 'Severe Risk' : 'High Risk';
    return {
      detected: true,
      type: 'Flood',
      riskLevel,
      recommendation: 'Evacuate low-lying areas immediately. Move to higher ground. Avoid crossing flooded roads.',
    };
  }

  // Cyclone Detection
  if (region === 'Odisha Cyclone Belt' && data.windSpeed > 120) {
    const riskLevel: DetectionRiskLevel = data.windSpeed > 150 ? 'Severe Risk' : 'High Risk';
    return {
      detected: true,
      type: 'Cyclone',
      riskLevel,
      recommendation: 'Seek shelter in reinforced buildings. Stay away from windows. Stock emergency supplies.',
    };
  }

  // Earthquake Detection
  if (region === 'Japan Seismic Zone' && data.seismicActivity > 5.5) {
    const riskLevel: DetectionRiskLevel = data.seismicActivity > 7 ? 'Severe Risk' : data.seismicActivity > 6 ? 'High Risk' : 'Moderate Risk';
    return {
      detected: true,
      type: 'Earthquake',
      riskLevel,
      recommendation: 'Drop, Cover, and Hold On. Stay away from windows and heavy objects. Be prepared for aftershocks.',
    };
  }

  // Wildfire Detection
  if (region === 'California Forest Zone' && data.temperature > 38 && data.drynessIndex > 70) {
    const riskLevel: DetectionRiskLevel = data.temperature > 42 ? 'Severe Risk' : 'High Risk';
    return {
      detected: true,
      type: 'Wildfire',
      riskLevel,
      recommendation: 'Prepare for evacuation. Clear vegetation near structures. Monitor local alerts closely.',
    };
  }

  // Landslide Detection
  if (region === 'Uttarakhand Himalayan Region' && data.rainfall > 180 && data.soilSaturation > 80) {
    const riskLevel: DetectionRiskLevel = data.soilSaturation > 90 ? 'Severe Risk' : 'High Risk';
    return {
      detected: true,
      type: 'Landslide',
      riskLevel,
      recommendation: 'Evacuate hillside areas. Avoid roads near slopes. Monitor for ground movement signs.',
    };
  }

  return { detected: false, type: null, riskLevel: 'Low Risk', recommendation: '' };
};

export default function LiveMonitoring({ onAlertTriggered, alertHistory = [] }: LiveMonitoringProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [regions, setRegions] = useState<MonitoredRegion[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<DisasterAlert[]>([]);
  const [eventHistory, setEventHistory] = useState<MonitoringEvent[]>([]);
  const [showNotification, setShowNotification] = useState<DisasterAlert | null>(null);
  const [updateInterval, setUpdateInterval] = useState(15);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const circlesRef = useRef<Map<string, Circle>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize regions
  useEffect(() => {
    const initialRegions: MonitoredRegion[] = MONITORED_REGIONS.map(r => ({
      ...r,
      status: 'Normal' as MonitoringStatus,
      environmentalData: generateEnvironmentalData(r.name),
      lastUpdate: new Date(),
    }));
    setRegions(initialRegions);
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

      // Add initial markers for all regions
      MONITORED_REGIONS.forEach((region) => {
        const markerIcon = L.divIcon({
          className: 'region-marker',
          html: `
            <div style="
              width: 16px;
              height: 16px;
              background: #22c55e;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 0 10px #22c55e80;
            "></div>
          `,
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

  // Update map markers when regions change
  const updateMapMarkers = useCallback(async (updatedRegions: MonitoredRegion[], alerts: DisasterAlert[]) => {
    if (!mapInstanceRef.current) return;
    
    const L = await import('leaflet');

    updatedRegions.forEach((region) => {
      const regionConfig = MONITORED_REGIONS.find(r => r.name === region.name);
      if (!regionConfig) return;

      const alert = alerts.find(a => a.region === region.name && a.isActive);
      const color = alert ? getRiskColor(alert.riskLevel).color : getStatusColor(region.status).replace('bg-', '#').replace('-500', '');
      
      const statusColor = region.status === 'Critical' ? '#ef4444' : 
                         region.status === 'Alert' ? '#f97316' : 
                         region.status === 'Monitoring' ? '#eab308' : '#22c55e';

      // Update marker
      const existingMarker = markersRef.current.get(regionConfig.id);
      if (existingMarker) {
        existingMarker.remove();
      }

      const markerIcon = L.divIcon({
        className: 'region-marker',
        html: `
          <div style="
            width: ${alert ? '24px' : '16px'};
            height: ${alert ? '24px' : '16px'};
            background: ${alert ? getRiskColor(alert.riskLevel).color : statusColor};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 ${alert ? '20px' : '10px'} ${alert ? getRiskColor(alert.riskLevel).color : statusColor}80;
            ${alert ? 'animation: pulse 1s infinite;' : ''}
          "></div>
        `,
        iconSize: [alert ? 24 : 16, alert ? 24 : 16],
        iconAnchor: [alert ? 12 : 8, alert ? 12 : 8],
      });

      const marker = L.marker([region.latitude, region.longitude], { icon: markerIcon });
      marker.bindTooltip(`${region.name}${alert ? ` - ${alert.disasterType} ${alert.riskLevel}` : ''}`, { permanent: false, direction: 'top' });
      marker.addTo(mapInstanceRef.current!);
      markersRef.current.set(regionConfig.id, marker);

      // Update circle
      const existingCircle = circlesRef.current.get(regionConfig.id);
      if (existingCircle) {
        existingCircle.remove();
      }

      if (alert) {
        const radiusMultiplier = alert.riskLevel === 'Severe Risk' ? 150000 : 
                                 alert.riskLevel === 'High Risk' ? 100000 : 50000;
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

  // Process environmental data and detect disasters
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

        return {
          ...region,
          environmentalData: newData,
          status: newStatus,
          lastUpdate: new Date(),
        };
      });

      // Check for new disasters and create alerts
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
            
            // Add to event history
            const event: MonitoringEvent = {
              id: `event-${Date.now()}-${region.name}`,
              region: region.name,
              disasterType: detection.type,
              riskLevel: detection.riskLevel,
              environmentalData: region.environmentalData,
              timestamp: new Date(),
            };
            setEventHistory(prev => [event, ...prev].slice(0, 50));
            
            // Show notification
            setShowNotification(alert);
            setTimeout(() => setShowNotification(null), 8000);
            
            // Callback
            if (onAlertTriggered) {
              onAlertTriggered(alert);
            }
          }
        }
      });

      if (newAlerts.length > 0) {
        setActiveAlerts(prev => [...newAlerts, ...prev]);
      }

      // Update map
      updateMapMarkers(updatedRegions, [...newAlerts, ...activeAlerts]);
      setLastUpdateTime(new Date());

      return updatedRegions;
    });
  }, [activeAlerts, onAlertTriggered, updateMapMarkers]);

  // Monitoring interval
  useEffect(() => {
    if (isMonitoring) {
      intervalRef.current = setInterval(processMonitoringCycle, updateInterval * 1000);
      processMonitoringCycle(); // Run immediately
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMonitoring, updateInterval, processMonitoringCycle]);

  // Simulate extreme event
  const simulateExtremeEvent = () => {
    const randomRegion = MONITORED_REGIONS[Math.floor(Math.random() * MONITORED_REGIONS.length)];
    const extremeData = generateEnvironmentalData(randomRegion.name, true);
    
    // Force extreme values based on region
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
      r.name === randomRegion.name 
        ? { ...r, environmentalData: extremeData, lastUpdate: new Date() }
        : r
    ));

    // Process detection
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

      const event: MonitoringEvent = {
        id: `event-${Date.now()}-${randomRegion.name}`,
        region: randomRegion.name,
        disasterType: detection.type,
        riskLevel: detection.riskLevel,
        environmentalData: extremeData,
        timestamp: new Date(),
      };
      setEventHistory(prev => [event, ...prev].slice(0, 50));

      // Update map
      setRegions(prevRegions => {
        const updatedRegions = prevRegions.map(r => 
          r.name === randomRegion.name 
            ? { ...r, status: 'Critical' as MonitoringStatus, environmentalData: extremeData }
            : r
        );
        updateMapMarkers(updatedRegions, [alert, ...activeAlerts]);
        return updatedRegions;
      });

      if (onAlertTriggered) {
        onAlertTriggered(alert);
      }
    }
  };

  const dismissAlert = (alertId: string) => {
    setActiveAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, isActive: false } : a
    ));
  };

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
                <h3 className="text-white font-bold text-lg mb-1">
                  {showNotification.disasterType} Risk Detected
                </h3>
                <p className="text-slate-300 text-sm mb-2">Region: {showNotification.region}</p>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(showNotification.riskLevel).bg} ${getRiskColor(showNotification.riskLevel).text}`}>
                  {showNotification.riskLevel}
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  {showNotification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="bg-card rounded-xl border border-slate-700/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
              <h2 className="text-xl font-bold text-white">Live Disaster Monitoring</h2>
            </div>
            {lastUpdateTime && (
              <span className="text-sm text-slate-400">
                Last update: {lastUpdateTime.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Update interval:</span>
              <select 
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Number(e.target.value))}
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-white"
              >
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
                <option value={20}>20 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </div>
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                isMonitoring 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30'
              }`}
            >
              {isMonitoring ? <Pause size={18} /> : <Play size={18} />}
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
            <button
              onClick={simulateExtremeEvent}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/20"
            >
              <Zap size={18} />
              Simulate Extreme Event
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Live Environmental Data Feed */}
        <div className="col-span-4 space-y-6">
          <div className="bg-card rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="text-neon-blue" size={20} />
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
                    <span className="text-xs text-slate-500">
                      {region.lastUpdate.toLocaleTimeString()}
                    </span>
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
                      <span className="text-white">{region.environmentalData.temperature}°C</span>
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

          {/* Region Risk Levels */}
          <div className="bg-card rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="text-neon-teal" size={20} />
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
                <h3 className="font-semibold text-red-400">Active Disaster Alerts ({activeAlerts.filter(a => a.isActive).length})</h3>
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
                            <span className="font-bold text-white">{alert.disasterType} Risk</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(alert.riskLevel).bg} ${getRiskColor(alert.riskLevel).text}`}>
                              {alert.riskLevel}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300">Region: {alert.region}</p>
                          <p className="text-xs text-slate-400 mt-1">{alert.recommendation}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>Rainfall: {alert.environmentalData.rainfall} mm</span>
                            <span>Wind: {alert.environmentalData.windSpeed} km/h</span>
                            <span>River: {alert.environmentalData.riverLevel}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-slate-500">{alert.timestamp.toLocaleTimeString()}</span>
                        <button 
                          onClick={() => dismissAlert(alert.id)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-green-400 transition-colors"
                        >
                          <CheckCircle size={14} />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Disaster Map */}
          <div className="bg-card rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="text-neon-blue" size={20} />
                <h3 className="font-semibold text-white">Live Disaster Map</h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-400">Normal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-slate-400">Monitoring</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-slate-400">Alert</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-400">Critical</span>
                </div>
              </div>
            </div>
            <div ref={mapRef} className="h-[350px] rounded-lg overflow-hidden border border-slate-700/50"></div>
          </div>

          {/* Recent Detections */}
          <div className="bg-card rounded-xl border border-slate-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-neon-teal" size={20} />
              <h3 className="font-semibold text-white">Recent Disaster Detections</h3>
            </div>
            {eventHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Activity size={40} className="mx-auto mb-3 opacity-50" />
                <p>No disaster events detected yet</p>
                <p className="text-sm">Start monitoring to detect disasters automatically</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-700/50">
                      <th className="pb-3 font-medium">Region</th>
                      <th className="pb-3 font-medium">Disaster</th>
                      <th className="pb-3 font-medium">Risk Level</th>
                      <th className="pb-3 font-medium">Rainfall</th>
                      <th className="pb-3 font-medium">Wind</th>
                      <th className="pb-3 font-medium">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {eventHistory.slice(0, 10).map((event) => (
                      <tr key={event.id} className="text-slate-300">
                        <td className="py-3">{event.region}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {getDisasterIcon(event.disasterType)}
                            {event.disasterType}
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRiskColor(event.riskLevel).bg} ${getRiskColor(event.riskLevel).text}`}>
                            {event.riskLevel}
                          </span>
                        </td>
                        <td className="py-3">{event.environmentalData.rainfall} mm</td>
                        <td className="py-3">{event.environmentalData.windSpeed} km/h</td>
                        <td className="py-3 text-slate-500">{event.timestamp.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
