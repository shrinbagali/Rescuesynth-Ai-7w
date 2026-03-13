import React from 'react';
import { Cloud, Wind, Droplets, Thermometer, Zap, AlertCircle } from 'lucide-react';
import { MonitoringEnvironmentalData } from '../types';

interface EnvironmentalMonitoringProps {
  data: MonitoringEnvironmentalData;
  region: string;
}

export default function EnvironmentalMonitoring({ data, region }: EnvironmentalMonitoringProps) {
  const parameters = [
    {
      label: 'Rainfall',
      value: `${data.rainfall.toFixed(1)} mm`,
      icon: <Droplets size={20} className="text-neon-blue" />,
      color: 'text-neon-blue',
      status: data.rainfall > 150 ? 'warning' : 'normal',
    },
    {
      label: 'Wind Speed',
      value: `${data.windSpeed.toFixed(1)} km/h`,
      icon: <Wind size={20} className="text-cyan-400" />,
      color: 'text-cyan-400',
      status: data.windSpeed > 100 ? 'warning' : 'normal',
    },
    {
      label: 'Temperature',
      value: `${data.temperature.toFixed(1)}°C`,
      icon: <Thermometer size={20} className="text-orange-400" />,
      color: 'text-orange-400',
      status: data.temperature > 40 ? 'warning' : 'normal',
    },
    {
      label: 'Humidity',
      value: `${data.humidity.toFixed(0)}%`,
      icon: <Cloud size={20} className="text-purple-400" />,
      color: 'text-purple-400',
      status: data.humidity < 30 && data.temperature > 35 ? 'warning' : 'normal',
    },
    {
      label: 'Soil Saturation',
      value: `${data.soilSaturation.toFixed(0)}%`,
      icon: <Droplets size={20} className="text-green-400" />,
      color: 'text-green-400',
      status: data.soilSaturation > 75 ? 'warning' : 'normal',
    },
    {
      label: 'Seismic Activity',
      value: `${data.seismicActivity.toFixed(2)} Mag`,
      icon: <Zap size={20} className="text-red-400" />,
      color: 'text-red-400',
      status: data.seismicActivity > 5.5 ? 'critical' : data.seismicActivity > 3 ? 'warning' : 'normal',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Environmental Monitoring</h3>
        <span className="text-xs text-gray-400">
          {data.timestamp?.toLocaleTimeString() || 'Real-time'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {parameters.map((param, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              param.status === 'critical'
                ? 'bg-red-500 bg-opacity-10 border-red-500'
                : param.status === 'warning'
                ? 'bg-yellow-500 bg-opacity-10 border-yellow-500'
                : 'bg-slate-800 bg-opacity-50 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {param.icon}
              <span className="text-xs text-gray-400">{param.label}</span>
              {param.status === 'critical' && <AlertCircle size={14} className="text-red-400" />}
            </div>
            <p className={`text-lg font-bold ${param.color}`}>{param.value}</p>
          </div>
        ))}
      </div>

      {/* Dryness Index Display */}
      <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Vegetation Dryness Index</span>
          <span
            className={`px-2 py-1 rounded text-xs font-bold ${
              data.drynessIndex === 'High'
                ? 'bg-red-500 text-white'
                : data.drynessIndex === 'Medium'
                ? 'bg-yellow-500 text-black'
                : 'bg-green-500 text-white'
            }`}
          >
            {data.drynessIndex}
          </span>
        </div>
      </div>

      {/* Cyclone-specific data */}
      {data.cloudPattern !== 'none' && (
        <div className="bg-slate-800 bg-opacity-50 border border-cyan-500 rounded-lg p-3">
          <div className="text-xs text-cyan-300">Cyclone Parameters Detected</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Atmospheric Pressure:</span>
              <p className="text-cyan-300 font-bold">{data.atmosphericPressure} hPa</p>
            </div>
            <div>
              <span className="text-gray-400">Sea Surface Temp:</span>
              <p className="text-cyan-300 font-bold">{data.seaSurfaceTemp}°C</p>
            </div>
            <div>
              <span className="text-gray-400">Cloud Pattern:</span>
              <p className="text-cyan-300 font-bold capitalize">{data.cloudPattern}</p>
            </div>
            <div>
              <span className="text-gray-400">Rainfall Intensity:</span>
              <p className="text-cyan-300 font-bold">{data.rainfallIntensity} mm/h</p>
            </div>
          </div>
        </div>
      )}

      {/* Earthquake-specific data */}
      {data.seismicActivity > 4 && (
        <div className="bg-slate-800 bg-opacity-50 border border-red-500 rounded-lg p-3">
          <div className="text-xs text-red-300">Earthquake Parameters</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Depth:</span>
              <p className="text-red-300 font-bold">{data.earthquakeDepth} km</p>
            </div>
            <div>
              <span className="text-gray-400">Ground Acceleration:</span>
              <p className="text-red-300 font-bold">{data.groundAcceleration?.toFixed(2)} m/s²</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">Epicenter:</span>
              <p className="text-red-300 font-bold">
                {data.epicenterLat?.toFixed(2)}°N, {data.epicenterLng?.toFixed(2)}°E
              </p>
            </div>
          </div>
        </div>
      )}

      {/* River Level Warning */}
      {data.riverLevel === 'Critical' && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-sm text-red-300">
            River level CRITICAL - Flood risk imminent
          </span>
        </div>
      )}
    </div>
  );
}
