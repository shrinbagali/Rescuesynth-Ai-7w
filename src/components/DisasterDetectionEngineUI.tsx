import React from 'react';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { DisasterType, DetectionRiskLevel } from '../types';

export interface DetectionEngineResult {
  disasterDetected: boolean;
  disasterType: DisasterType | 'No Disaster Detected';
  riskLevel: DetectionRiskLevel;
  confidence: number;
  reasoning: string;
}

interface DisasterDetectionEngineUIProps {
  detectionResult: DetectionEngineResult;
  isUpdating?: boolean;
}

export default function DisasterDetectionEngineUI({
  detectionResult,
  isUpdating = false,
}: DisasterDetectionEngineUIProps) {
  const getRiskColor = (riskLevel: DetectionRiskLevel): string => {
    switch (riskLevel) {
      case 'Severe Risk':
        return 'text-red-500 bg-red-500 bg-opacity-10 border-red-500';
      case 'High Risk':
        return 'text-orange-400 bg-orange-400 bg-opacity-10 border-orange-400';
      case 'Moderate Risk':
        return 'text-yellow-400 bg-yellow-400 bg-opacity-10 border-yellow-400';
      case 'Low Risk':
        return 'text-green-400 bg-green-400 bg-opacity-10 border-green-400';
      default:
        return 'text-gray-400 bg-gray-400 bg-opacity-10 border-gray-400';
    }
  };

  const getDisasterColor = (disasterType: string): string => {
    switch (disasterType) {
      case 'Earthquake':
        return 'text-red-400';
      case 'Cyclone':
        return 'text-cyan-400';
      case 'Flood':
        return 'text-blue-400';
      case 'Wildfire':
        return 'text-orange-400';
      case 'Landslide':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getDisasterIcon = (disasterType: string) => {
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
        return '✓';
    }
  };

  const riskColors = getRiskColor(detectionResult.riskLevel);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Disaster Detection Engine</h3>
        {isUpdating && (
          <Activity size={16} className="text-cyan-400 animate-spin" />
        )}
      </div>

      {/* Main Detection Result */}
      <div className={`border rounded-lg p-4 transition-all duration-300 ${riskColors}`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">{getDisasterIcon(detectionResult.disasterType)}</div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-1">Detection Status</p>
            <p className={`text-xl font-bold mb-2 ${getDisasterColor(detectionResult.disasterType)}`}>
              {detectionResult.disasterType}
            </p>
            <p className="text-xs text-gray-300">{detectionResult.reasoning}</p>
          </div>
        </div>
      </div>

      {/* Detection Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Risk Level */}
        <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Risk Level</p>
          <p className={`text-sm font-bold ${getRiskColor(detectionResult.riskLevel).split(' ')[0]}`}>
            {detectionResult.riskLevel}
          </p>
        </div>

        {/* Confidence Score */}
        <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Confidence</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-cyan-400">
              {(detectionResult.confidence * 100).toFixed(0)}%
            </p>
            <div className="flex-1 bg-slate-700 rounded h-2">
              <div
                className="bg-cyan-500 h-full rounded transition-all duration-300"
                style={{ width: `${detectionResult.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Detection Indicators */}
      <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-3 space-y-2">
        <p className="text-xs text-gray-400 mb-2">Multi-Parameter Analysis</p>

        {/* Active Indicators */}
        {detectionResult.disasterDetected ? (
          <>
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-red-300">Active threat detected</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Activity size={14} className="text-yellow-500" />
              <span className="text-yellow-300">Parameters critical</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle size={14} className="text-orange-500" />
              <span className="text-orange-300">Threshold exceeded</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-green-300">All parameters normal</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-green-300">No threats detected</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-green-300">Monitoring active</span>
            </div>
          </>
        )}
      </div>

      {/* Real-time Status */}
      <div className="text-xs text-gray-400 text-center">
        {isUpdating ? 'Analyzing data...' : 'Engine ready'}
      </div>
    </div>
  );
}
