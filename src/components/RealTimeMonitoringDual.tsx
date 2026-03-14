import React from 'react';
import { EnvironmentalReading } from '../utils/disaster-detection';
import { Zap, Droplets, Wind, Gauge, Thermometer, Eye } from 'lucide-react';

interface RealTimeMonitoringDualProps {
  reading: EnvironmentalReading;
  isMonitoring: boolean;
}

export const RealTimeMonitoringDual: React.FC<RealTimeMonitoringDualProps> = ({
  reading,
  isMonitoring,
}) => {
  const parameters = [
    {
      label: 'Rainfall',
      value: reading.rainfall.toFixed(1),
      unit: 'mm',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-500',
      threshold: 200,
    },
    {
      label: 'Wind Speed',
      value: reading.windSpeed.toFixed(1),
      unit: 'km/h',
      icon: Wind,
      color: 'from-teal-500 to-green-500',
      threshold: 120,
    },
    {
      label: 'Temperature',
      value: reading.temperature.toFixed(1),
      unit: '°C',
      icon: Thermometer,
      color: 'from-orange-500 to-red-500',
      threshold: 38,
    },
    {
      label: 'Seismic Activity',
      value: reading.magnitude.toFixed(2),
      unit: 'Magnitude',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      threshold: 5.5,
    },
    {
      label: 'Pressure',
      value: reading.atmosphericPressure.toFixed(0),
      unit: 'hPa',
      icon: Gauge,
      color: 'from-indigo-500 to-blue-500',
      threshold: 950,
    },
    {
      label: 'Humidity',
      value: reading.humidity.toFixed(0),
      unit: '%',
      icon: Eye,
      color: 'from-green-500 to-emerald-500',
      threshold: 30,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Environmental Parameters</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isMonitoring ? 'Live' : 'Stopped'} · {reading.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {parameters.map((param) => {
          const Icon = param.icon;
          const isThreshold = param.label.includes('Wind') || param.label.includes('Pressure')
            ? param.value < param.threshold
            : param.value > param.threshold;

          return (
            <div
              key={param.label}
              className={`p-4 rounded-lg border transition-all ${
                isThreshold
                  ? 'border-red-300 bg-red-50 dark:bg-red-950/20'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{param.label}</p>
                  <p className={`text-2xl font-bold mt-2 bg-gradient-to-r ${param.color} bg-clip-text text-transparent`}>
                    {param.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{param.unit}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${param.color} opacity-15`}>
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
              </div>
              {isThreshold && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
                  ⚠ Threshold exceeded
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
