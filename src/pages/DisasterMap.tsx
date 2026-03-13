import { useEffect, useRef } from 'react';
import { MapPin, Info, AlertTriangle } from 'lucide-react';
import L from 'leaflet';
import { historicalDisasters } from '../data/historicalDisasters';

export default function DisasterMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([22.5, 82.5], 5);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap, &copy; CartoDB',
      maxZoom: 19,
    }).addTo(map);

    const getMarkerColor = (damageLevel: number) => {
      if (damageLevel > 80) return '#ef4444';
      if (damageLevel > 60) return '#f59e0b';
      return '#14b8a6';
    };

    historicalDisasters.forEach((disaster) => {
      const color = getMarkerColor(disaster.damageLevel);
      
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 24px;
            height: 24px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 10px ${color};
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([disaster.latitude, disaster.longitude], { icon: markerIcon });
      
      marker.bindPopup(`
        <div style="
          background: #1e293b;
          padding: 16px;
          border-radius: 8px;
          min-width: 200px;
          color: #f1f5f9;
          font-family: system-ui;
        ">
          <h3 style="margin: 0 0 8px 0; color: ${color}; font-size: 16px; font-weight: 600;">
            ${disaster.region} ${disaster.disasterType}
          </h3>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Year</span>
              <span style="color: #f1f5f9; font-weight: 500;">${disaster.year}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Affected</span>
              <span style="color: #f1f5f9; font-weight: 500;">${(disaster.populationAffected / 1000000).toFixed(1)}M</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Damage</span>
              <span style="color: ${color}; font-weight: 500;">${disaster.damageLevel}%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Rainfall</span>
              <span style="color: #f1f5f9; font-weight: 500;">${disaster.rainfallLevel}mm</span>
            </div>
          </div>
        </div>
      `, {
        className: 'custom-popup',
      });

      marker.addTo(map);
    });

    const highRiskRegions = historicalDisasters.filter(d => d.damageLevel > 75);
    highRiskRegions.forEach((disaster) => {
      L.circle([disaster.latitude, disaster.longitude], {
        color: 'rgba(239, 68, 68, 0.3)',
        fillColor: 'rgba(239, 68, 68, 0.15)',
        fillOpacity: 0.5,
        radius: disaster.populationAffected / 100,
        weight: 1,
      }).addTo(map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="glow-card overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Global Disaster Intelligence Map</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-red"></div>
              <span className="text-sm text-slate-400">Severe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-amber"></div>
              <span className="text-sm text-slate-400">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neon-teal"></div>
              <span className="text-sm text-slate-400">Low</span>
            </div>
          </div>
        </div>
        <div 
          ref={mapRef} 
          className="h-[500px] w-full"
          style={{ background: '#0f172a' }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {historicalDisasters.slice(0, 4).map((disaster) => (
          <div 
            key={disaster.id}
            className={`glow-card p-4 ${
              disaster.damageLevel > 80 ? 'glow-card-red' :
              disaster.damageLevel > 60 ? 'glow-card-amber' : 'glow-card-teal'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${
                disaster.damageLevel > 80 ? 'bg-neon-red/20' :
                disaster.damageLevel > 60 ? 'bg-neon-amber/20' : 'bg-neon-teal/20'
              }`}>
                <AlertTriangle size={18} className={
                  disaster.damageLevel > 80 ? 'text-neon-red' :
                  disaster.damageLevel > 60 ? 'text-neon-amber' : 'text-neon-teal'
                } />
              </div>
              <span className="text-sm text-slate-400">{disaster.year}</span>
            </div>
            <h4 className="font-semibold text-white mb-1">{disaster.region}</h4>
            <p className="text-sm text-slate-400 mb-3">{disaster.disasterType}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Impact</span>
              <span className={`font-medium ${
                disaster.damageLevel > 80 ? 'text-neon-red' :
                disaster.damageLevel > 60 ? 'text-neon-amber' : 'text-neon-teal'
              }`}>
                {(disaster.populationAffected / 1000000).toFixed(1)}M affected
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="glow-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info size={20} className="text-neon-blue" />
          <h3 className="text-lg font-semibold text-white">Map Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-neon-blue font-medium mb-2">Marker Colors</p>
            <p className="text-slate-400">
              Markers indicate severity: Red for severe damage ({'>'}80%), 
              amber for moderate (60-80%), and teal for low ({'<'}60%).
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-neon-teal font-medium mb-2">Heat Zones</p>
            <p className="text-slate-400">
              Red circles indicate high-risk zones with significant 
              historical impact. Circle size represents population affected.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-neon-amber font-medium mb-2">Interactive Features</p>
            <p className="text-slate-400">
              Click on markers to view detailed information including 
              year, impact, damage level, and rainfall data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
