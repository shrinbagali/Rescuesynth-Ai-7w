import React, { useMemo } from 'react';
import { AlertTriangle, Activity } from 'lucide-react';

interface RiskScoreMeterProps {
  score: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  earthquakeScore: number;
  cycloneScore: number;
}

export default function RiskScoreMeter({
  score,
  riskLevel,
  earthquakeScore,
  cycloneScore,
}: RiskScoreMeterProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return { bg: 'from-red-600 to-red-800', text: 'text-red-600', badge: 'bg-red-100 text-red-800' };
      case 'High':
        return { bg: 'from-orange-500 to-orange-700', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-800' };
      case 'Moderate':
        return { bg: 'from-yellow-400 to-yellow-600', text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-800' };
      case 'Low':
        return { bg: 'from-green-400 to-green-600', text: 'text-green-600', badge: 'bg-green-100 text-green-800' };
      default:
        return { bg: 'from-blue-400 to-blue-600', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-800' };
    }
  };

  const colors = getRiskColor(riskLevel);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-6">
        {/* Circular Risk Meter */}
        <div className="relative w-40 h-40">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Static background */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Risk indicator arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#riskGradient)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                {riskLevel === 'Critical' && (
                  <>
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#991b1b" />
                  </>
                )}
                {riskLevel === 'High' && (
                  <>
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#b45309" />
                  </>
                )}
                {riskLevel === 'Moderate' && (
                  <>
                    <stop offset="0%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#ca8a04" />
                  </>
                )}
                {riskLevel === 'Low' && (
                  <>
                    <stop offset="0%" stopColor="#4ade80" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </>
                )}
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold">{score.toFixed(1)}</div>
            <div className={`text-sm font-semibold ${colors.text}`}>{riskLevel}</div>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className={`${colors.badge} px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2`}>
          {riskLevel === 'Critical' && <AlertTriangle size={16} />}
          {riskLevel === 'High' && <AlertTriangle size={16} />}
          {riskLevel === 'Moderate' && <Activity size={16} />}
          {riskLevel === 'Low' && <Activity size={16} />}
          Risk Level: {riskLevel}
        </div>

        {/* Individual Scores */}
        <div className="w-full space-y-3">
          {/* Earthquake Score */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">Earthquake Risk</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{earthquakeScore.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                style={{ width: `${earthquakeScore}%` }}
              />
            </div>
          </div>

          {/* Cyclone Score */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">Cyclone Risk</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">{cycloneScore.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-500"
                style={{ width: `${cycloneScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
