import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DetectionRiskLevel } from '../types';

interface RiskMeterWidgetProps {
  riskLevel: DetectionRiskLevel;
  confidence: number;
  disasterType: string;
}

export default function RiskMeterWidget({
  riskLevel,
  confidence,
  disasterType,
}: RiskMeterWidgetProps) {
  const getRiskScore = (): number => {
    switch (riskLevel) {
      case 'Severe Risk':
        return 100;
      case 'High Risk':
        return 75;
      case 'Moderate Risk':
        return 50;
      case 'Low Risk':
        return 25;
      default:
        return 0;
    }
  };

  const getRiskColor = (): string => {
    const score = getRiskScore();
    if (score >= 75) return 'from-red-600 to-red-500';
    if (score >= 50) return 'from-orange-600 to-orange-500';
    if (score >= 25) return 'from-yellow-600 to-yellow-500';
    return 'from-green-600 to-green-500';
  };

  const getStatusText = (): string => {
    const score = getRiskScore();
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 25) return 'MODERATE';
    return 'LOW';
  };

  const riskScore = getRiskScore();
  const displayScore = Math.round(riskScore * (confidence / 1));
  const gradientColor = getRiskColor();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Risk Meter</h3>
        <span className="text-xs text-gray-400">{disasterType}</span>
      </div>

      {/* Circular Risk Meter */}
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Risk arc */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={displayScore >= 75 ? '#ef4444' : displayScore >= 50 ? '#f97316' : displayScore >= 25 ? '#eab308' : '#22c55e'}
            strokeWidth="3"
            strokeDasharray={`${(displayScore / 100) * 282.7} 282.7`}
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Tick marks */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const angle = (tick / 100) * 360 * (Math.PI / 180);
            const x1 = 50 + 40 * Math.cos(angle);
            const y1 = 50 + 40 * Math.sin(angle);
            const x2 = 50 + 45 * Math.cos(angle);
            const y2 = 50 + 45 * Math.sin(angle);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#64748b"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-white">{displayScore}</p>
          <p className="text-xs text-gray-400">/100</p>
        </div>
      </div>

      {/* Status Display */}
      <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-400 mb-2">Current Status</p>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${gradientColor} text-white text-sm font-bold`}
        >
          <AlertTriangle size={16} />
          {getStatusText()}
        </div>
      </div>

      {/* Metrics Breakdown */}
      <div className="space-y-2">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Risk Level Baseline</span>
            <span className="text-xs text-white font-bold">{riskScore}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded h-2">
            <div
              className="bg-gradient-to-r from-yellow-500 to-red-500 h-full rounded transition-all duration-300"
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Detection Confidence</span>
            <span className="text-xs text-cyan-300 font-bold">{(confidence * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded transition-all duration-300"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Weighted Risk Score</span>
            <span className="text-xs text-orange-300 font-bold">{displayScore}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded transition-all duration-300"
              style={{ width: `${displayScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Risk Zones Legend */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded p-2 text-center">
          <p className="text-green-400 font-bold">0-25</p>
          <p className="text-gray-400 text-xs mt-1">Low</p>
        </div>
        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded p-2 text-center">
          <p className="text-yellow-400 font-bold">25-50</p>
          <p className="text-gray-400 text-xs mt-1">Moderate</p>
        </div>
        <div className="bg-orange-500 bg-opacity-20 border border-orange-500 rounded p-2 text-center">
          <p className="text-orange-400 font-bold">50-75</p>
          <p className="text-gray-400 text-xs mt-1">High</p>
        </div>
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-2 text-center">
          <p className="text-red-400 font-bold">75-100</p>
          <p className="text-gray-400 text-xs mt-1">Critical</p>
        </div>
      </div>
    </div>
  );
}
