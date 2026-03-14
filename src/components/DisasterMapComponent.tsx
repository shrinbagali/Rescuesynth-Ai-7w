import React from 'react';
import { DualDetectionResult } from '../utils/disaster-detection';

interface DisasterMapComponentProps {
  detectionResult: DualDetectionResult;
}

interface Region {
  name: string;
  type: 'earthquake' | 'cyclone';
  lat: number;
  lon: number;
  status: 'safe' | 'warning' | 'alert' | 'critical';
}

export const DisasterMapComponent: React.FC<DisasterMapComponentProps> = ({ detectionResult }) => {
  const regions: Region[] = [
    // Earthquake zones
    { name: 'Japan', type: 'earthquake', lat: 36.2, lon: 138.2, status: 'warning' },
    { name: 'California', type: 'earthquake', lat: 36.7, lon: -118.1, status: 'safe' },
    { name: 'Indonesia', type: 'earthquake', lat: -0.8, lon: 113.6, status: 'alert' },
    // Cyclone zones
    { name: 'Odisha Coast', type: 'cyclone', lat: 19.8, lon: 85.3, status: 'safe' },
    { name: 'Bay of Bengal', type: 'cyclone', lat: 15.0, lon: 88.0, status: 'warning' },
    { name: 'Philippines', type: 'cyclone', lat: 12.8, lon: 121.7, status: 'critical' },
  ];

  const getStatusColor = (status: string, type: string) => {
    const baseColor = type === 'earthquake' ? 'from-purple-600' : 'from-cyan-600';

    switch (status) {
      case 'critical':
        return `${baseColor} to-red-600 ring-2 ring-red-400`;
      case 'alert':
        return `${baseColor} to-orange-600 ring-2 ring-orange-400`;
      case 'warning':
        return `${baseColor} to-yellow-600 ring-2 ring-yellow-400`;
      default:
        return `${baseColor} to-green-600 ring-2 ring-green-400`;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-950/30 border-red-300 dark:border-red-800';
      case 'alert':
        return 'bg-orange-100 dark:bg-orange-950/30 border-orange-300 dark:border-orange-800';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-800';
      default:
        return 'bg-green-100 dark:bg-green-950/30 border-green-300 dark:border-green-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical':
        return 'CRITICAL';
      case 'alert':
        return 'ALERT';
      case 'warning':
        return 'WARNING';
      default:
        return 'SAFE';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Global Disaster Zones</h3>

        {/* ASCII World Map */}
        <div className="p-4 rounded-lg bg-card border border-border overflow-auto">
          <pre className="text-xs leading-tight font-mono text-muted-foreground whitespace-pre overflow-x-auto">
            {`
  North America          Europe      Asia Pacific
  ┌─ California          ├─          ├─ Japan ★
  │                      │           ├─ Indonesia ★
  └─                     └─          ├─ Philippines ◉
                                     └─ Bay of Bengal ◉
  
  Legend: ★ = Earthquake Zone | ◉ = Cyclone Zone
            `}
          </pre>
        </div>
      </div>

      {/* Regional Status Grid */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Regional Status</h4>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region) => {
            const isActive =
              (region.type === 'earthquake' && detectionResult.earthquake.detected) ||
              (region.type === 'cyclone' && detectionResult.cyclone.detected);

            return (
              <div
                key={region.name}
                className={`p-4 rounded-lg border-2 transition-all ${getStatusBg(region.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{region.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {region.type.charAt(0).toUpperCase() + region.type.slice(1)} Zone
                    </p>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${getStatusColor(
                      region.status,
                      region.type
                    )} animate-pulse`}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    region.status === 'critical' ? 'text-red-700 dark:text-red-400' :
                    region.status === 'alert' ? 'text-orange-700 dark:text-orange-400' :
                    region.status === 'warning' ? 'text-yellow-700 dark:text-yellow-400' :
                    'text-green-700 dark:text-green-400'
                  }`}>
                    {getStatusText(region.status)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {region.lat.toFixed(1)}°, {region.lon.toFixed(1)}°
                  </span>
                </div>

                {isActive && (
                  <div className="mt-3 p-2 rounded bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800">
                    <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                      ★ Active Detection
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50 border border-border">
        <div>
          <p className="text-sm text-muted-foreground font-semibold">Earthquake Zones</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {regions.filter((r) => r.type === 'earthquake').length}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-semibold">Cyclone Zones</p>
          <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">
            {regions.filter((r) => r.type === 'cyclone').length}
          </p>
        </div>
      </div>
    </div>
  );
};
