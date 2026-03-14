import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisasterZone {
  name: string;
  type: 'earthquake' | 'cyclone';
  latitude: number;
  longitude: number;
  risk: number; // 0-100
}

const DISASTER_ZONES: DisasterZone[] = [
  // Earthquake zones
  { name: 'Japan Trench', type: 'earthquake', latitude: 38, longitude: 142, risk: 0 },
  { name: 'California', type: 'earthquake', latitude: 36, longitude: -120, risk: 0 },
  { name: 'Indonesia', type: 'earthquake', latitude: -2, longitude: 120, risk: 0 },
  // Cyclone zones
  { name: 'Odisha Coast', type: 'cyclone', latitude: 19, longitude: 85, risk: 0 },
  { name: 'Bay of Bengal', type: 'cyclone', latitude: 15, longitude: 90, risk: 0 },
  { name: 'Philippine Sea', type: 'cyclone', latitude: 15, longitude: 140, risk: 0 },
];

interface EnhancedDisasterMapProps {
  earthquakeRisk: number;
  cycloneRisk: number;
}

export default function EnhancedDisasterMap({
  earthquakeRisk,
  cycloneRisk,
}: EnhancedDisasterMapProps) {
  const updateZoneRisks = () => {
    return DISASTER_ZONES.map(zone => ({
      ...zone,
      risk: zone.type === 'earthquake' ? earthquakeRisk : cycloneRisk,
    }));
  };

  const zones = updateZoneRisks();

  const getRiskColor = (risk: number) => {
    if (risk >= 75) return '#dc2626'; // Red
    if (risk >= 50) return '#f97316'; // Orange
    if (risk >= 25) return '#facc15'; // Yellow
    return '#4ade80'; // Green
  };

  const getRiskLabel = (risk: number) => {
    if (risk >= 75) return 'Critical';
    if (risk >= 50) return 'High';
    if (risk >= 25) return 'Moderate';
    return 'Low';
  };

  const xToPixel = (lon: number) => ((lon + 180) / 360) * 900;
  const yToPixel = (lat: number) => ((90 - lat) / 180) * 450;

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Global Disaster Zones</h3>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 overflow-auto">
        {/* SVG Map */}
        <svg
          viewBox="0 0 900 450"
          className="w-full h-auto bg-gradient-to-b from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/10 rounded"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Simplified world map background */}
          <defs>
            <pattern id="oceanPattern" patternUnits="userSpaceOnUse" width="20" height="20">
              <rect width="20" height="20" fill="#dbeafe" />
              <circle cx="5" cy="5" r="1" fill="#bfdbfe" opacity="0.5" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="900" height="450" fill="url(#oceanPattern)" />

          {/* Grid lines */}
          {[-180, -90, 0, 90, 180].map(lon => (
            <line
              key={`vline-${lon}`}
              x1={xToPixel(lon)}
              y1="0"
              x2={xToPixel(lon)}
              y2="450"
              stroke="#e5e7eb"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          {[-60, -30, 0, 30, 60].map(lat => (
            <line
              key={`hline-${lat}`}
              x1="0"
              y1={yToPixel(lat)}
              x2="900"
              y2={yToPixel(lat)}
              stroke="#e5e7eb"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}

          {/* Disaster zones */}
          {zones.map((zone, idx) => {
            const x = xToPixel(zone.longitude);
            const y = yToPixel(zone.latitude);
            const color = getRiskColor(zone.risk);
            const isActive = zone.risk > 20;

            return (
              <g key={idx}>
                {/* Glow effect when active */}
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r="35"
                    fill={color}
                    opacity="0.15"
                    className="animate-pulse"
                  />
                )}

                {/* Zone marker */}
                <circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill={color}
                  opacity={0.8}
                  className="transition-all duration-300"
                />

                {/* Zone icon */}
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="white"
                  pointerEvents="none"
                >
                  {zone.type === 'earthquake' ? '⊙' : '⊛'}
                </text>

                {/* Label */}
                <text
                  x={x}
                  y={y + 35}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#1f2937"
                  className="dark:fill-gray-300 pointer-events-none"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend and Stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor(earthquakeRisk) }} />
              Earthquake Zones
            </h4>
            <div className="text-2xl font-bold">{earthquakeRisk.toFixed(1)}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Risk Level: {getRiskLabel(earthquakeRisk)}</div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor(cycloneRisk) }} />
              Cyclone Zones
            </h4>
            <div className="text-2xl font-bold">{cycloneRisk.toFixed(1)}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Risk Level: {getRiskLabel(cycloneRisk)}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        {[
          { label: 'Low', color: '#4ade80' },
          { label: 'Moderate', color: '#facc15' },
          { label: 'High', color: '#f97316' },
          { label: 'Critical', color: '#dc2626' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
