import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AlertTriangle, Activity, Thermometer, Wind, Droplets, Mountain, Waves, Flame, Radio,
  MapPin, Clock, Shield, Play, Pause, Bell, X, Brain, Satellite, Target
} from 'lucide-react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import { 
  DisasterAlert, MonitoringRegion, MonitoringEnvironmentalData, DisasterType,
  DetectionRiskLevel, RiverWaterLevel, MonitoringStatus
} from '../types';

interface LiveMonitoringProps {
  onAlertTriggered?: (alert: DisasterAlert) => void;
  alertHistory?: DisasterAlert[];
}

interface RegionConfig {
  id: string;
  name: MonitoringRegion;
  latitude: number;
  longitude: number;
  disasterProne: DisasterType;
}

interface MonitoredRegionState {
  config: RegionConfig;
  status: MonitoringStatus;
  data: MonitoringEnvironmentalData;
}

const REGIONS: RegionConfig[] = [
  { id: 'kerala', name: 'Kerala Coastal Region', latitude: 9.9312, longitude: 76.2673, disasterProne: 'Flood' },
  { id: 'assam', name: 'Assam Flood Plains', latitude: 26.2006, longitude: 92.9376, disasterProne: 'Flood' },
  { id: 'odisha', name: 'Odisha Cyclone Belt', latitude: 20.9517, longitude: 85.0985, disasterProne: 'Cyclone' },
  { id: 'uttarakhand', name: 'Uttarakhand Himalayan Region', latitude: 30.0668, longitude: 79.0193, disasterProne: 'Landslide' },
  { id: 'california', name: 'California Forest Zone', latitude: 36.7783, longitude: -119.4179, disasterProne: 'Wildfire' },
  { id: 'japan', name: 'Japan Seismic Zone', latitude: 36.2048, longitude: 138.2529, disasterProne: 'Earthquake' },
];

const getIcon = (type: DisasterType) => {
  const icons: Record<DisasterType, JSX.Element> = {
    'Flood': <Waves size={16} className="text-blue-500" />,
    'Cyclone': <Wind size={16} className="text-purple-500" />,
    'Earthquake': <Activity size={16} className="text-orange-500" />,
    'Wildfire': <Flame size={16} className="text-red-500" />,
    'Landslide': <Mountain size={16} className="text-amber-600" />
  };
  return icons[type] || <AlertTriangle size={16} />;
};

const getRiskStyle = (level: DetectionRiskLevel) => {
  const styles: Record<DetectionRiskLevel, { bg: string; text: string; border: string; color: string }> = {
    'Severe Risk': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', color: '#ef4444' },
    'High Risk': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', color: '#f97316' },
    'Moderate Risk': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', color: '#eab308' },
    'Low Risk': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', color: '#22c55e' }
  };
  return styles[level] || styles['Low Risk'];
};

const generateData = (region: MonitoringRegion, extreme = false): MonitoringEnvironmentalData => {
  const isEarthquake = region === 'Japan Seismic Zone';
  const isCyclone = region === 'Odisha Cyclone Belt';
  const v = extreme ? 1.8 : 0.3;
  
  const baseData: MonitoringEnvironmentalData = {
    rainfall: Math.round(50 * (1 + (Math.random() - 0.5) * v)),
    riverLevel: 'Medium' as RiverWaterLevel,
    windSpeed: Math.round(30 * (1 + (Math.random() - 0.5) * v)),
    seismicActivity: +(2 * (1 + (Math.random() - 0.5) * v)).toFixed(1),
    temperature: Math.round(25 * (1 + (Math.random() - 0.2) * 0.3)),
    humidity: Math.round(60 * (1 + (Math.random() - 0.5) * 0.3)),
    soilSaturation: Math.round(40 * (1 + (Math.random() - 0.5) * v)),
    drynessIndex: Math.round(30 * (1 + (Math.random() - 0.5) * v)),
    timestamp: new Date(),
  };

  // Region-specific base values
  if (region.includes('Flood')) {
    baseData.rainfall = Math.round((extreme ? 250 : 120) * (1 + (Math.random() - 0.5) * 0.3));
    baseData.riverLevel = extreme ? 'Critical' : (Math.random() > 0.5 ? 'High' : 'Medium');
    baseData.humidity = Math.round(85 * (1 + (Math.random() - 0.5) * 0.2));
  }

  if (isCyclone) {
    baseData.windSpeed = Math.round((extreme ? 160 : 80) * (1 + (Math.random() - 0.5) * 0.3));
    baseData.atmosphericPressure = extreme ? Math.round(960 - Math.random() * 20) : Math.round(1000 - Math.random() * 15);
    baseData.seaSurfaceTemp = Math.round((extreme ? 30 : 27) + (Math.random() - 0.5) * 3);
    baseData.rainfallIntensity = Math.round((extreme ? 80 : 30) * (1 + (Math.random() - 0.5) * 0.4));
    baseData.humidity = Math.round((extreme ? 95 : 75) * (1 + (Math.random() - 0.5) * 0.1));
    baseData.cloudPattern = extreme ? 'spiral' : (Math.random() > 0.7 ? 'forming' : 'none');
  }

  if (isEarthquake) {
    baseData.seismicActivity = extreme ? +(6 + Math.random() * 2).toFixed(1) : +(2 + Math.random() * 2).toFixed(1);
    baseData.earthquakeDepth = Math.round(extreme ? 10 + Math.random() * 20 : 30 + Math.random() * 50);
    baseData.groundAcceleration = extreme ? +(0.3 + Math.random() * 0.4).toFixed(2) : +(0.05 + Math.random() * 0.1).toFixed(2);
    baseData.epicenterLat = 36.2048 + (Math.random() - 0.5) * 2;
    baseData.epicenterLng = 138.2529 + (Math.random() - 0.5) * 2;
  }

  if (region === 'Uttarakhand Himalayan Region') {
    baseData.rainfall = Math.round((extreme ? 200 : 100) * (1 + (Math.random() - 0.5) * 0.3));
    baseData.soilSaturation = Math.round((extreme ? 90 : 50) * (1 + (Math.random() - 0.5) * 0.3));
  }

  if (region === 'California Forest Zone') {
    baseData.temperature = Math.round((extreme ? 45 : 35) * (1 + (Math.random() - 0.5) * 0.2));
    baseData.drynessIndex = Math.round((extreme ? 85 : 50) * (1 + (Math.random() - 0.5) * 0.2));
    baseData.humidity = Math.round(20 * (1 + (Math.random() - 0.5) * 0.3));
  }

  return baseData;
};

interface DetectionResult {
  type: DisasterType | null;
  risk: DetectionRiskLevel;
  msg: string;
}

const detect = (region: MonitoringRegion, d: MonitoringEnvironmentalData): DetectionResult => {
  // Flood detection
  if (region.includes('Flood') && d.rainfall > 200 && (d.riverLevel === 'High' || d.riverLevel === 'Critical')) {
    return { 
      type: 'Flood', 
      risk: d.riverLevel === 'Critical' ? 'Severe Risk' : 'High Risk', 
      msg: 'Evacuate low-lying areas immediately. Move to higher ground.' 
    };
  }
  
  // Enhanced Cyclone detection
  if (region === 'Odisha Cyclone Belt') {
    const hasHighWind = d.windSpeed > 120;
    const hasLowPressure = (d.atmosphericPressure || 1013) < 980;
    const hasSpiralPattern = d.cloudPattern === 'spiral' || d.cloudPattern === 'eye';
    
    if (hasHighWind && (hasLowPressure || hasSpiralPattern)) {
      return { 
        type: 'Cyclone', 
        risk: d.windSpeed > 150 || (d.atmosphericPressure || 1013) < 960 ? 'Severe Risk' : 'High Risk', 
        msg: 'Seek shelter in reinforced buildings. Stay away from windows.' 
      };
    }
  }
  
  // Enhanced Earthquake detection
  if (region === 'Japan Seismic Zone' && d.seismicActivity > 5.5) {
    const depth = d.earthquakeDepth || 50;
    const isShallow = depth < 30;
    return { 
      type: 'Earthquake', 
      risk: d.seismicActivity > 7 || (d.seismicActivity > 6 && isShallow) ? 'Severe Risk' : d.seismicActivity > 6 ? 'High Risk' : 'Moderate Risk', 
      msg: 'Drop, Cover, and Hold On. Stay away from buildings and power lines.' 
    };
  }
  
  // Wildfire detection
  if (region === 'California Forest Zone' && d.temperature > 38 && d.drynessIndex > 70) {
    return { 
      type: 'Wildfire', 
      risk: d.temperature > 42 && d.drynessIndex > 80 ? 'Severe Risk' : 'High Risk', 
      msg: 'Prepare for evacuation. Clear vegetation around structures.' 
    };
  }
  
  // Landslide detection
  if (region === 'Uttarakhand Himalayan Region' && d.rainfall > 180 && d.soilSaturation > 80) {
    return { 
      type: 'Landslide', 
      risk: d.soilSaturation > 90 ? 'Severe Risk' : 'High Risk', 
      msg: 'Evacuate hillside areas. Avoid roads near slopes.' 
    };
  }
  
  return { type: null, risk: 'Low Risk', msg: '' };
};

const generateExplanation = (type: DisasterType, d: MonitoringEnvironmentalData, region: MonitoringRegion): string => {
  switch (type) {
    case 'Earthquake':
      return `Seismic activity of magnitude ${d.seismicActivity} has been detected at a depth of ${d.earthquakeDepth || 'unknown'}km. Ground acceleration measured at ${d.groundAcceleration || 'unknown'}g indicates ${d.seismicActivity > 6 ? 'significant' : 'moderate'} tectonic movement. The epicenter is located at coordinates (${d.epicenterLat?.toFixed(2) || 'N/A'}, ${d.epicenterLng?.toFixed(2) || 'N/A'}). Seismic activity above magnitude 5.5 indicates a potential earthquake event requiring immediate safety protocols.`;
    
    case 'Cyclone':
      return `Wind speeds of ${d.windSpeed} km/h combined with atmospheric pressure of ${d.atmosphericPressure || 'N/A'} hPa indicate active cyclone conditions. ${d.cloudPattern === 'spiral' ? 'Satellite imagery shows distinct spiral cloud formations characteristic of a mature cyclone system.' : d.cloudPattern === 'forming' ? 'Cloud patterns indicate cyclone formation in progress.' : ''} Sea surface temperature of ${d.seaSurfaceTemp || 'N/A'}°C provides favorable conditions for cyclone intensification. Current rainfall intensity: ${d.rainfallIntensity || 'N/A'} mm/hr.`;
    
    case 'Flood':
      return `Rainfall of ${d.rainfall}mm combined with ${d.riverLevel} river water levels indicates severe flooding conditions. The water levels have exceeded critical thresholds for ${region}. Humidity at ${d.humidity}% suggests continued precipitation.`;
    
    case 'Wildfire':
      return `Temperature of ${d.temperature}°C combined with a dryness index of ${d.drynessIndex}% creates extreme fire risk conditions. Low humidity at ${d.humidity}% means vegetation is highly susceptible to ignition and rapid fire spread.`;
    
    case 'Landslide':
      return `Rainfall of ${d.rainfall}mm with soil saturation at ${d.soilSaturation}% indicates unstable ground conditions in the ${region}. Slope failure is highly probable in steep terrain areas.`;
    
    default:
      return '';
  }
};

// Cyclone Cloud Pattern Visualization Component
function CycloneVisualization({ data }: { data: MonitoringEnvironmentalData }) {
  const pattern = data.cloudPattern || 'none';
  const windSpeed = data.windSpeed;
  const pressure = data.atmosphericPressure || 1013;
  
  return (
    <div className="bg-slate-900 rounded-lg p-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Satellite size={16} className="text-cyan-400" />
        <span className="text-sm font-medium text-white">Satellite Cloud Analysis</span>
      </div>
      
      {/* Cloud Pattern Visualization */}
      <div className="relative h-32 flex items-center justify-center">
        {pattern === 'none' && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-700 opacity-30" />
            <p className="text-xs text-slate-400 mt-2">No cyclonic activity detected</p>
          </div>
        )}
        
        {pattern === 'forming' && (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full border-4 border-dashed border-cyan-500/50 animate-spin" style={{ animationDuration: '8s' }}>
              <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent" />
            </div>
            <p className="text-xs text-cyan-400 mt-2">Cloud formation detected</p>
          </div>
        )}
        
        {(pattern === 'spiral' || pattern === 'eye') && (
          <div className="text-center relative">
            {/* Outer spiral bands */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-2 border-cyan-400/30 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-400/50 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-2 border-cyan-400/70 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            {/* Spiral arms */}
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-cyan-500/40 via-blue-500/30 to-purple-500/20 animate-spin relative" style={{ animationDuration: '5s' }}>
              {/* Eye of the storm */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-slate-900 border border-cyan-400" />
              </div>
            </div>
            <p className="text-xs text-red-400 mt-2 font-medium">Spiral cloud pattern detected - CYCLONE CONFIRMED</p>
          </div>
        )}
      </div>
      
      {/* Cyclone Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
        <div className="bg-slate-800 rounded p-2 text-center">
          <span className="text-slate-400 block">Wind</span>
          <span className={`font-bold ${windSpeed > 120 ? 'text-red-400' : windSpeed > 80 ? 'text-yellow-400' : 'text-green-400'}`}>
            {windSpeed} km/h
          </span>
        </div>
        <div className="bg-slate-800 rounded p-2 text-center">
          <span className="text-slate-400 block">Pressure</span>
          <span className={`font-bold ${pressure < 980 ? 'text-red-400' : pressure < 1000 ? 'text-yellow-400' : 'text-green-400'}`}>
            {pressure} hPa
          </span>
        </div>
        <div className="bg-slate-800 rounded p-2 text-center">
          <span className="text-slate-400 block">Pattern</span>
          <span className={`font-bold capitalize ${pattern === 'spiral' ? 'text-red-400' : pattern === 'forming' ? 'text-yellow-400' : 'text-green-400'}`}>
            {pattern}
          </span>
        </div>
      </div>
    </div>
  );
}

// Earthquake Visualization Component
function EarthquakeVisualization({ data }: { data: MonitoringEnvironmentalData }) {
  const magnitude = data.seismicActivity;
  const depth = data.earthquakeDepth || 50;
  const acceleration = data.groundAcceleration || 0;
  
  return (
    <div className="bg-slate-900 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Target size={16} className="text-orange-400" />
        <span className="text-sm font-medium text-white">Seismic Analysis</span>
      </div>
      
      {/* Epicenter Visualization */}
      <div className="relative h-32 flex items-center justify-center">
        <div className="relative">
          {/* Seismic waves */}
          {magnitude > 4 && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full border border-orange-400/20 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-orange-400/40 animate-ping" style={{ animationDuration: '1.5s' }} />
              </div>
            </>
          )}
          {magnitude > 5.5 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-red-500/30 animate-ping" style={{ animationDuration: '2.5s' }} />
            </div>
          )}
          {/* Epicenter */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${magnitude > 5.5 ? 'bg-red-500' : magnitude > 4 ? 'bg-orange-500' : 'bg-yellow-500'}`}>
            <span className="text-white font-bold text-sm">{magnitude}</span>
          </div>
        </div>
      </div>
      
      {/* Earthquake Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
        <div className="bg-slate-800 rounded p-2 text-center">
          <span className="text-slate-400 block">Magnitude</span>
          <span className={`font-bold ${magnitude > 6 ? 'text-red-400' : magnitude > 5 ? 'text-orange-400' : 'text-yellow-400'}`}>
            {magnitude} M
          </span>
        </div>
        <div className="bg-slate-800 rounded p-2 text-center">
          <span className="text-slate-400 block">Depth</span>
          <span className={`font-bold ${depth < 30 ? 'text-red-400' : depth < 70 ? 'text-yellow-400' : 'text-green-400'}`}>
            {depth} km
          </span>
        </div>
        <div className="bg-slate-800 rounded p-2 text-center">
          <span className="text-slate-400 block">Accel.</span>
          <span className={`font-bold ${acceleration > 0.3 ? 'text-red-400' : acceleration > 0.1 ? 'text-yellow-400' : 'text-green-400'}`}>
            {acceleration}g
          </span>
        </div>
      </div>
      
      {data.epicenterLat && data.epicenterLng && (
        <div className="mt-3 bg-slate-800 rounded p-2 text-xs text-center">
          <span className="text-slate-400">Epicenter: </span>
          <span className="text-white font-mono">{data.epicenterLat.toFixed(3)}°N, {data.epicenterLng.toFixed(3)}°E</span>
        </div>
      )}
    </div>
  );
}

export default function LiveMonitoring({ onAlertTriggered }: LiveMonitoringProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [regions, setRegions] = useState<MonitoredRegionState[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [notification, setNotification] = useState<DisasterAlert | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    const initial = REGIONS.map(r => ({ 
      config: r, 
      status: 'Normal' as MonitoringStatus, 
      data: generateData(r.name) 
    }));
    setRegions(initial);
  }, []);

  // Map initialization
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      if (!mapRef.current) return;
      const map = L.map(mapRef.current).setView([25, 80], 3);
      mapInstanceRef.current = map;
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CartoDB', maxZoom: 19,
      }).addTo(map);
      REGIONS.forEach((r) => {
        const icon = L.divIcon({
          className: 'marker', 
          html: `<div style="width:14px;height:14px;background:#22c55e;border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        });
        const marker = L.marker([r.latitude, r.longitude], { icon });
        marker.bindTooltip(r.name, { direction: 'top' });
        marker.addTo(map);
        markersRef.current.set(r.id, marker);
      });
    };
    initMap();
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, []);

  // Update map markers
  const updateMarkers = useCallback(async (regs: MonitoredRegionState[], alts: DisasterAlert[]) => {
    if (!mapInstanceRef.current) return;
    const L = await import('leaflet');
    regs.forEach((r) => {
      const alert = alts.find(a => a.region === r.config.name && a.isActive);
      const color = alert ? (alert.riskLevel === 'Severe Risk' ? '#ef4444' : alert.riskLevel === 'High Risk' ? '#f97316' : '#eab308') : '#22c55e';
      const marker = markersRef.current.get(r.config.id);
      if (marker) {
        marker.setIcon(L.divIcon({
          className: 'marker', 
          html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        }));
      }
    });
  }, []);

  // Monitoring update cycle
  const updateData = useCallback(() => {
    setRegions(prev => {
      const updated = prev.map(r => {
        const newData = generateData(r.config.name);
        const detection = detect(r.config.name, newData);
        const status: MonitoringStatus = detection.type ? (detection.risk === 'Severe Risk' ? 'Critical' : 'Alert') : 'Normal';
        
        if (detection.type) {
          const alert: DisasterAlert = {
            id: `alert-${Date.now()}-${r.config.id}`,
            disasterType: detection.type,
            region: r.config.name,
            riskLevel: detection.risk,
            environmentalData: newData,
            timestamp: new Date(),
            recommendation: detection.msg,
            isActive: true,
          };
          setAlerts(a => [alert, ...a.slice(0, 9)]);
          setNotification(alert);
          onAlertTriggered?.(alert);
        }
        
        return { ...r, data: newData, status };
      });
      
      updateMarkers(updated, alerts);
      return updated;
    });
  }, [alerts, onAlertTriggered, updateMarkers]);

  // Start/stop monitoring
  useEffect(() => {
    if (isMonitoring) {
      updateData();
      intervalRef.current = setInterval(updateData, 10000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isMonitoring, updateData]);

  const simulateExtreme = (type?: DisasterType) => {
    const targetRegion = type 
      ? REGIONS.find(r => r.disasterProne === type) 
      : REGIONS[Math.floor(Math.random() * REGIONS.length)];
    
    if (!targetRegion) return;
    
    const extremeData = generateData(targetRegion.name, true);
    const detection = detect(targetRegion.name, extremeData);
    
    if (detection.type) {
      const alert: DisasterAlert = {
        id: `alert-${Date.now()}`,
        disasterType: detection.type,
        region: targetRegion.name,
        riskLevel: detection.risk,
        environmentalData: extremeData,
        timestamp: new Date(),
        recommendation: detection.msg,
        isActive: true,
      };
      setAlerts(a => [alert, ...a.slice(0, 9)]);
      setNotification(alert);
      setRegions(prev => prev.map(r => 
        r.config.id === targetRegion.id 
          ? { ...r, data: extremeData, status: 'Critical' } 
          : r
      ));
      setSelectedRegion(targetRegion.id);
      onAlertTriggered?.(alert);
    }
  };

  const selectedRegionData = regions.find(r => r.config.id === selectedRegion);
  const latestAlert = alerts[0];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Notification Popup */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
          <div className={`p-4 rounded-lg shadow-lg border-l-4 bg-white max-w-sm ${getRiskStyle(notification.riskLevel).text} border-current`}>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Bell className="animate-pulse" size={20} />
                <span className="font-bold">{notification.disasterType} Alert</span>
              </div>
              <button onClick={() => setNotification(null)} className="hover:bg-slate-100 rounded p-1">
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">{notification.region}</p>
            <p className="text-xs text-slate-500 mt-1">{notification.recommendation}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Radio className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Live Disaster Monitoring</h1>
            <p className="text-sm text-slate-500">Real-time environmental data and AI disaster detection</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => simulateExtreme('Earthquake')} 
            className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm font-medium"
          >
            Simulate Earthquake
          </button>
          <button 
            onClick={() => simulateExtreme('Cyclone')} 
            className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition text-sm font-medium"
          >
            Simulate Cyclone
          </button>
          <button 
            onClick={() => setIsMonitoring(!isMonitoring)} 
            className={`px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 ${
              isMonitoring 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isMonitoring ? <><Pause size={18} /> Stop</> : <><Play size={18} /> Start</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Environmental Monitoring Grid */}
        <div className="col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-blue-600" size={20} />
            <h2 className="font-semibold text-slate-800">Live Environmental Monitoring</h2>
            {isMonitoring && (
              <span className="ml-auto text-xs text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> 
                Streaming (10s interval)
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {regions.map((r) => (
              <button
                key={r.config.id}
                onClick={() => setSelectedRegion(r.config.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedRegion === r.config.id 
                    ? 'ring-2 ring-blue-500 border-blue-300' 
                    : r.status === 'Critical' 
                      ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                      : r.status === 'Alert' 
                        ? 'border-orange-300 bg-orange-50 hover:bg-orange-100' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-700 text-sm truncate">{r.config.name}</span>
                  {getIcon(r.config.disasterProne)}
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  {r.config.disasterProne === 'Earthquake' ? (
                    <>
                      <div className="flex justify-between"><span>Magnitude</span><span className={`font-medium ${r.data.seismicActivity > 5.5 ? 'text-red-600' : ''}`}>{r.data.seismicActivity} M</span></div>
                      <div className="flex justify-between"><span>Depth</span><span className="font-medium">{r.data.earthquakeDepth || '-'} km</span></div>
                      <div className="flex justify-between"><span>Acceleration</span><span className="font-medium">{r.data.groundAcceleration || '-'}g</span></div>
                    </>
                  ) : r.config.disasterProne === 'Cyclone' ? (
                    <>
                      <div className="flex justify-between"><span>Wind</span><span className={`font-medium ${r.data.windSpeed > 120 ? 'text-red-600' : ''}`}>{r.data.windSpeed} km/h</span></div>
                      <div className="flex justify-between"><span>Pressure</span><span className={`font-medium ${(r.data.atmosphericPressure || 1013) < 980 ? 'text-red-600' : ''}`}>{r.data.atmosphericPressure || '-'} hPa</span></div>
                      <div className="flex justify-between"><span>Pattern</span><span className={`font-medium capitalize ${r.data.cloudPattern === 'spiral' ? 'text-red-600' : ''}`}>{r.data.cloudPattern || 'none'}</span></div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between"><span>Rainfall</span><span className="font-medium">{r.data.rainfall}mm</span></div>
                      <div className="flex justify-between"><span>Temp</span><span className="font-medium">{r.data.temperature}°C</span></div>
                      <div className="flex justify-between"><span>Humidity</span><span className="font-medium">{r.data.humidity}%</span></div>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-600" size={20} />
            <h2 className="font-semibold text-slate-800">Active Alerts</h2>
            <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
              {alerts.filter(a => a.isActive).length}
            </span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No active alerts</p>
            ) : alerts.slice(0, 5).map((a) => (
              <div key={a.id} className={`p-3 rounded-lg border ${getRiskStyle(a.riskLevel).bg} ${getRiskStyle(a.riskLevel).border}`}>
                <div className="flex items-center gap-2">
                  {getIcon(a.disasterType)}
                  <span className={`font-medium ${getRiskStyle(a.riskLevel).text}`}>{a.disasterType}</span>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded ${getRiskStyle(a.riskLevel).bg} ${getRiskStyle(a.riskLevel).text}`}>
                    {a.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{a.region}</p>
                <p className="text-xs text-slate-500">{a.timestamp.toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="col-span-6 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-blue-600" size={20} />
            <h2 className="font-semibold text-slate-800">Global Disaster Map</h2>
          </div>
          <div ref={mapRef} className="h-64 rounded-lg overflow-hidden" />
          <div className="flex gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full" /> Safe</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full" /> Warning</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded-full" /> High Risk</div>
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full" /> Critical</div>
          </div>
        </div>

        {/* Disaster-Specific Visualization */}
        <div className="col-span-6 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Satellite className="text-cyan-600" size={20} />
            <h2 className="font-semibold text-slate-800">Disaster Analysis</h2>
          </div>
          {selectedRegionData ? (
            selectedRegionData.config.disasterProne === 'Cyclone' ? (
              <CycloneVisualization data={selectedRegionData.data} />
            ) : selectedRegionData.config.disasterProne === 'Earthquake' ? (
              <EarthquakeVisualization data={selectedRegionData.data} />
            ) : (
              <div className="bg-slate-100 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-sm text-slate-500">Select Earthquake or Cyclone region for detailed analysis</p>
              </div>
            )
          ) : (
            <div className="bg-slate-100 rounded-lg p-4 h-48 flex items-center justify-center">
              <p className="text-sm text-slate-500">Select a region to view detailed disaster analysis</p>
            </div>
          )}
        </div>

        {/* AI Explanation Panel */}
        <div className="col-span-12 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-purple-600" size={20} />
            <h2 className="font-semibold text-slate-800">AI Explanation Panel</h2>
          </div>
          {latestAlert ? (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className={`p-4 rounded-lg ${getRiskStyle(latestAlert.riskLevel).bg} ${getRiskStyle(latestAlert.riskLevel).border} border`}>
                  <div className="flex items-center gap-2 mb-3">
                    {getIcon(latestAlert.disasterType)}
                    <span className={`font-bold text-lg ${getRiskStyle(latestAlert.riskLevel).text}`}>
                      {latestAlert.disasterType} Detected - {latestAlert.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {generateExplanation(latestAlert.disasterType, latestAlert.environmentalData, latestAlert.region)}
                  </p>
                </div>
              </div>
              <div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="text-blue-600" size={18} />
                    <span className="font-semibold text-blue-800">Emergency Recommendation</span>
                  </div>
                  <p className="text-sm text-blue-700 font-medium mb-3">{latestAlert.recommendation}</p>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">1.</span>
                      <span>Region: {latestAlert.region}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">2.</span>
                      <span>Time: {latestAlert.timestamp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">3.</span>
                      <span>Risk Assessment: {latestAlert.riskLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg p-8 text-center">
              <Brain className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-500">No disaster detected. The AI explanation will appear here when a disaster is identified.</p>
              <p className="text-sm text-slate-400 mt-2">Start monitoring or simulate an event to see AI analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
