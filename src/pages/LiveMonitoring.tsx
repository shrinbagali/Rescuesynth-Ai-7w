import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  AlertTriangle, Activity, Thermometer, Wind, Droplets, Mountain, Waves, Flame, Radio,
  MapPin, Clock, Shield, Play, Pause, Bell, X, TrendingUp, TrendingDown, Brain
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
    'Flood': <Waves size={16} />, 'Cyclone': <Wind size={16} />, 'Earthquake': <Activity size={16} />,
    'Wildfire': <Flame size={16} />, 'Landslide': <Mountain size={16} />
  };
  return icons[type] || <AlertTriangle size={16} />;
};

const getRiskStyle = (level: DetectionRiskLevel) => {
  const styles: Record<DetectionRiskLevel, { bg: string; text: string; color: string }> = {
    'Severe Risk': { bg: 'bg-red-100', text: 'text-red-700', color: '#ef4444' },
    'High Risk': { bg: 'bg-orange-100', text: 'text-orange-700', color: '#f97316' },
    'Moderate Risk': { bg: 'bg-yellow-100', text: 'text-yellow-700', color: '#eab308' },
    'Low Risk': { bg: 'bg-green-100', text: 'text-green-700', color: '#22c55e' }
  };
  return styles[level] || styles['Low Risk'];
};

const generateData = (region: MonitoringRegion, extreme = false): MonitoringEnvironmentalData => {
  const bases: Record<string, Partial<MonitoringEnvironmentalData>> = {
    'Kerala Coastal Region': { rainfall: 120, riverLevel: 'Medium', humidity: 85, temperature: 28 },
    'Assam Flood Plains': { rainfall: 150, riverLevel: 'High', humidity: 90, temperature: 30 },
    'Odisha Cyclone Belt': { windSpeed: 80, humidity: 75, temperature: 32 },
    'Uttarakhand Himalayan Region': { rainfall: 100, soilSaturation: 60, temperature: 18 },
    'California Forest Zone': { temperature: 38, drynessIndex: 70, humidity: 20 },
    'Japan Seismic Zone': { seismicActivity: 3.5, temperature: 22 },
  };
  const b = bases[region] || {};
  const v = extreme ? 1.8 : 0.3;
  return {
    rainfall: Math.round((b.rainfall || 50) * (1 + (Math.random() - 0.5) * v)),
    riverLevel: extreme && region.includes('Flood') ? 'Critical' : (b.riverLevel || 'Medium') as RiverWaterLevel,
    windSpeed: Math.round((b.windSpeed || 30) * (1 + (Math.random() - 0.5) * v)),
    seismicActivity: +((b.seismicActivity || 2) * (1 + (Math.random() - 0.5) * v)).toFixed(1),
    temperature: Math.round((b.temperature || 25) * (1 + (Math.random() - 0.2) * v * 0.5)),
    humidity: Math.round((b.humidity || 60) * (1 + (Math.random() - 0.5) * 0.3)),
    soilSaturation: Math.round((b.soilSaturation || 40) * (1 + (Math.random() - 0.5) * v)),
    drynessIndex: Math.round((b.drynessIndex || 30) * (1 + (Math.random() - 0.5) * v)),
    timestamp: new Date(),
  };
};

const detect = (region: MonitoringRegion, d: MonitoringEnvironmentalData): { type: DisasterType | null; risk: DetectionRiskLevel; msg: string } => {
  if (region.includes('Flood') && d.rainfall > 200 && (d.riverLevel === 'High' || d.riverLevel === 'Critical'))
    return { type: 'Flood', risk: d.riverLevel === 'Critical' ? 'Severe Risk' : 'High Risk', msg: 'Evacuate low-lying areas immediately.' };
  if (region === 'Odisha Cyclone Belt' && d.windSpeed > 120)
    return { type: 'Cyclone', risk: d.windSpeed > 150 ? 'Severe Risk' : 'High Risk', msg: 'Seek shelter in reinforced buildings.' };
  if (region === 'Japan Seismic Zone' && d.seismicActivity > 5.5)
    return { type: 'Earthquake', risk: d.seismicActivity > 7 ? 'Severe Risk' : 'Moderate Risk', msg: 'Drop, Cover, and Hold On.' };
  if (region === 'California Forest Zone' && d.temperature > 38 && d.drynessIndex > 70)
    return { type: 'Wildfire', risk: d.temperature > 42 ? 'Severe Risk' : 'High Risk', msg: 'Prepare for evacuation.' };
  if (region === 'Uttarakhand Himalayan Region' && d.rainfall > 180 && d.soilSaturation > 80)
    return { type: 'Landslide', risk: d.soilSaturation > 90 ? 'Severe Risk' : 'High Risk', msg: 'Evacuate hillside areas.' };
  return { type: null, risk: 'Low Risk', msg: '' };
};

const explain = (type: DisasterType, d: MonitoringEnvironmentalData): string => {
  const explanations: Record<DisasterType, string> = {
    'Flood': `Rainfall of ${d.rainfall}mm combined with ${d.riverLevel} river water levels indicates severe flooding conditions. The water levels have exceeded critical thresholds for this region.`,
    'Cyclone': `Wind speeds of ${d.windSpeed} km/h exceed the 120 km/h cyclone threshold. Current atmospheric conditions indicate active cyclone formation patterns.`,
    'Earthquake': `Seismic activity of magnitude ${d.seismicActivity} has been detected. This exceeds the 5.5 magnitude threshold indicating significant tectonic movement.`,
    'Wildfire': `Temperature of ${d.temperature}°C combined with a dryness index of ${d.drynessIndex}% creates extreme fire risk conditions. Vegetation is highly susceptible to ignition.`,
    'Landslide': `Rainfall of ${d.rainfall}mm with soil saturation at ${d.soilSaturation}% indicates unstable ground conditions. Slope failure is highly probable.`
  };
  return explanations[type] || '';
};

export default function LiveMonitoring({ onAlertTriggered }: LiveMonitoringProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [regions, setRegions] = useState<MonitoredRegionState[]>([]);
  const [alerts, setAlerts] = useState<DisasterAlert[]>([]);
  const [notification, setNotification] = useState<DisasterAlert | null>(null);
  const [dataHistory, setDataHistory] = useState<Map<string, MonitoringEnvironmentalData[]>>(new Map());
  const [predictions, setPredictions] = useState<{ region: string; type: DisasterType; confidence: number; time: string }[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    const initial = REGIONS.map(r => ({ config: r, status: 'Normal' as MonitoringStatus, data: generateData(r.name) }));
    setRegions(initial);
    const hist = new Map<string, MonitoringEnvironmentalData[]>();
    REGIONS.forEach(r => hist.set(r.id, [generateData(r.name)]));
    setDataHistory(hist);
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
          className: 'marker', html: `<div style="width:14px;height:14px;background:#22c55e;border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>`,
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
          className: 'marker', html: `<div style="width:14px;height:14px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        }));
      }
    });
  }, []);

  // Analyze trends for predictions
  const analyzeTrends = useCallback((history: Map<string, MonitoringEnvironmentalData[]>) => {
    const preds: { region: string; type: DisasterType; confidence: number; time: string }[] = [];
    history.forEach((data, id) => {
      if (data.length < 3) return;
      const recent = data.slice(-10);
      const r = REGIONS.find(x => x.id === id);
      if (!r) return;
      const last = recent[recent.length - 1];
      const first = recent[0];
      const rainfallTrend = (last.rainfall - first.rainfall) / recent.length;
      const windTrend = (last.windSpeed - first.windSpeed) / recent.length;
      
      if (r.name.includes('Flood') && rainfallTrend > 5 && last.rainfall > 150) {
        preds.push({ region: r.name, type: 'Flood', confidence: Math.min(95, 50 + rainfallTrend * 5), time: rainfallTrend > 10 ? '6-12h' : '12-24h' });
      }
      if (r.name === 'Odisha Cyclone Belt' && windTrend > 3 && last.windSpeed > 80) {
        preds.push({ region: r.name, type: 'Cyclone', confidence: Math.min(95, 45 + windTrend * 8), time: '6-12h' });
      }
    });
    setPredictions(preds);
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
      
      setDataHistory(h => {
        const newH = new Map(h);
        updated.forEach(r => {
          const arr = newH.get(r.config.id) || [];
          newH.set(r.config.id, [...arr.slice(-9), r.data]);
        });
        return newH;
      });
      
      updateMarkers(updated, alerts);
      analyzeTrends(dataHistory);
      return updated;
    });
  }, [alerts, dataHistory, onAlertTriggered, updateMarkers, analyzeTrends]);

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

  const simulateExtreme = () => {
    const target = REGIONS[Math.floor(Math.random() * REGIONS.length)];
    const extremeData = generateData(target.name, true);
    const detection = detect(target.name, extremeData);
    if (detection.type) {
      const alert: DisasterAlert = {
        id: `alert-${Date.now()}`, disasterType: detection.type, region: target.name,
        riskLevel: detection.risk, environmentalData: extremeData, timestamp: new Date(),
        recommendation: detection.msg, isActive: true,
      };
      setAlerts(a => [alert, ...a.slice(0, 9)]);
      setNotification(alert);
      setRegions(prev => prev.map(r => r.config.id === target.id ? { ...r, data: extremeData, status: 'Critical' } : r));
      onAlertTriggered?.(alert);
    }
  };

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
              <button onClick={() => setNotification(null)}><X size={18} /></button>
            </div>
            <p className="mt-2 text-sm text-slate-600">{notification.region}</p>
            <p className="text-xs text-slate-500 mt-1">{notification.recommendation}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg"><Radio className="text-blue-600" size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Live Disaster Monitoring</h1>
            <p className="text-sm text-slate-500">Real-time environmental data and disaster detection</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={simulateExtreme} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition font-medium">
            Simulate Event
          </button>
          <button onClick={() => setIsMonitoring(!isMonitoring)} className={`px-4 py-2 rounded-lg transition font-medium flex items-center gap-2 ${isMonitoring ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
            {isMonitoring ? <><Pause size={18} /> Stop</> : <><Play size={18} /> Start</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Live Environmental Monitoring */}
        <div className="col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-blue-600" size={20} />
            <h2 className="font-semibold text-slate-800">Live Environmental Monitoring</h2>
            {isMonitoring && <span className="ml-auto text-xs text-green-600 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Streaming</span>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {regions.map((r) => (
              <div key={r.config.id} className={`p-4 rounded-lg border ${r.status === 'Critical' ? 'border-red-300 bg-red-50' : r.status === 'Alert' ? 'border-orange-300 bg-orange-50' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-slate-700 text-sm">{r.config.name}</span>
                  {getIcon(r.config.disasterProne)}
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between"><span>Rainfall</span><span className="font-medium">{r.data.rainfall}mm</span></div>
                  <div className="flex justify-between"><span>Wind</span><span className="font-medium">{r.data.windSpeed}km/h</span></div>
                  <div className="flex justify-between"><span>Temp</span><span className="font-medium">{r.data.temperature}°C</span></div>
                  <div className="flex justify-between"><span>Seismic</span><span className="font-medium">{r.data.seismicActivity}</span></div>
                  <div className="flex justify-between"><span>Humidity</span><span className="font-medium">{r.data.humidity}%</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-600" size={20} />
            <h2 className="font-semibold text-slate-800">Active Alerts</h2>
            <span className="ml-auto bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">{alerts.filter(a => a.isActive).length}</span>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No active alerts</p>
            ) : alerts.slice(0, 5).map((a) => (
              <div key={a.id} className={`p-3 rounded-lg ${getRiskStyle(a.riskLevel).bg}`}>
                <div className="flex items-center gap-2">
                  {getIcon(a.disasterType)}
                  <span className={`font-medium ${getRiskStyle(a.riskLevel).text}`}>{a.disasterType}</span>
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
            <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full" /> Critical</div>
          </div>
        </div>

        {/* AI Explanation */}
        <div className="col-span-6 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-purple-600" size={20} />
            <h2 className="font-semibold text-slate-800">AI Explanation Panel</h2>
          </div>
          {alerts.length > 0 && alerts[0].isActive ? (
            <div className="space-y-3">
              <div className={`p-3 rounded-lg ${getRiskStyle(alerts[0].riskLevel).bg}`}>
                <p className={`font-medium ${getRiskStyle(alerts[0].riskLevel).text}`}>{alerts[0].disasterType} Detected</p>
                <p className="text-sm text-slate-600 mt-2">{explain(alerts[0].disasterType, alerts[0].environmentalData)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-700 flex items-center gap-2"><Shield size={16} /> Recommendation</p>
                <p className="text-sm text-slate-600 mt-1">{alerts[0].recommendation}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Brain size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No active disasters to analyze</p>
            </div>
          )}
        </div>

        {/* Early Warning Prediction */}
        <div className="col-span-6 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-amber-600" size={20} />
            <h2 className="font-semibold text-slate-800">Early Warning Prediction</h2>
          </div>
          {predictions.length > 0 ? (
            <div className="space-y-3">
              {predictions.map((p, i) => (
                <div key={i} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-amber-700 flex items-center gap-2">{getIcon(p.type)} Possible {p.type}</span>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">{Math.round(p.confidence)}% confidence</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{p.region}</p>
                  <p className="text-xs text-slate-500">Estimated: {p.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <TrendingDown size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No predictions - Start monitoring to analyze trends</p>
            </div>
          )}
        </div>

        {/* Detection Frequency Chart */}
        <div className="col-span-6 bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-green-600" size={20} />
            <h2 className="font-semibold text-slate-800">Detection Analytics</h2>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {(['Flood', 'Cyclone', 'Earthquake', 'Wildfire', 'Landslide'] as DisasterType[]).map((type) => {
              const count = alerts.filter(a => a.disasterType === type).length;
              const height = Math.min(100, count * 20 + 10);
              return (
                <div key={type} className="flex flex-col items-center">
                  <div className="w-full h-24 bg-slate-100 rounded relative overflow-hidden">
                    <div className="absolute bottom-0 w-full transition-all duration-500" style={{ height: `${height}%`, backgroundColor: getRiskStyle(count > 2 ? 'High Risk' : 'Low Risk').color }} />
                  </div>
                  <span className="text-xs text-slate-600 mt-1">{type.slice(0, 5)}</span>
                  <span className="text-xs font-medium">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
