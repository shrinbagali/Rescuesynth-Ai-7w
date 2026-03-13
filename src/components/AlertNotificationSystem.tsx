import React from 'react';
import { AlertTriangle, Bell, X, CheckCircle } from 'lucide-react';
import { DisasterAlert } from '../types';

interface AlertNotificationSystemProps {
  alerts: DisasterAlert[];
  onDismiss: (id: string) => void;
}

export default function AlertNotificationSystem({
  alerts,
  onDismiss,
}: AlertNotificationSystemProps) {
  const getAlertColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'Severe Risk':
        return 'bg-red-900 border-red-500 text-red-100';
      case 'High Risk':
        return 'bg-orange-900 border-orange-500 text-orange-100';
      case 'Moderate Risk':
        return 'bg-yellow-900 border-yellow-500 text-yellow-100';
      default:
        return 'bg-green-900 border-green-500 text-green-100';
    }
  };

  const getAlertIcon = (disasterType: string) => {
    switch (disasterType) {
      case 'Earthquake':
        return '⚡';
      case 'Cyclone':
        return '🌪️';
      case 'Flood':
        return '💧';
      case 'Wildfire':
        return '🔥';
      case 'Landslide':
        return '⛰️';
      default:
        return '⚠️';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-4 text-center">
        <Bell size={24} className="text-gray-400 mx-auto mb-2 opacity-50" />
        <p className="text-sm text-gray-400">No active disaster alerts</p>
        <p className="text-xs text-gray-500 mt-1">System monitoring active</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
        <span className="px-2 py-1 bg-red-500 bg-opacity-20 border border-red-500 rounded text-xs font-bold text-red-400">
          {alerts.length}
        </span>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-lg p-3 transition-all duration-300 ${getAlertColor(alert.riskLevel)}`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Icon and Content */}
              <div className="flex gap-2 flex-1">
                <span className="text-2xl flex-shrink-0">{getAlertIcon(alert.disasterType)}</span>
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm">{alert.disasterType} Alert</p>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        alert.riskLevel === 'Severe Risk'
                          ? 'bg-red-600'
                          : alert.riskLevel === 'High Risk'
                          ? 'bg-orange-600'
                          : alert.riskLevel === 'Moderate Risk'
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                    >
                      {alert.riskLevel}
                    </span>
                  </div>

                  {/* Region and Time */}
                  <p className="text-xs opacity-75 mt-1">{alert.region}</p>
                  <p className="text-xs opacity-50">
                    {alert.timestamp.toLocaleTimeString()} - {alert.timestamp.toLocaleDateString()}
                  </p>

                  {/* Environmental Snapshot */}
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="opacity-50">Wind</p>
                      <p className="font-bold">{alert.environmentalData.windSpeed} km/h</p>
                    </div>
                    <div>
                      <p className="opacity-50">Rainfall</p>
                      <p className="font-bold">{alert.environmentalData.rainfall} mm</p>
                    </div>
                    <div>
                      <p className="opacity-50">Seismic</p>
                      <p className="font-bold">{alert.environmentalData.seismicActivity}</p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <p className="text-xs mt-2 opacity-75 italic">"{alert.recommendation}"</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => onDismiss(alert.id)}
                className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-30 rounded transition-colors"
                title="Dismiss alert"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Summary */}
      <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-3 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-green-400" />
          <span>All alerts are being monitored. Response teams are on standby.</span>
        </div>
      </div>
    </div>
  );
}
