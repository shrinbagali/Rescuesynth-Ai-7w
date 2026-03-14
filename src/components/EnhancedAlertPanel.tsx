import React from 'react';
import { AlertTriangle, AlertCircle, Wind, Zap, X } from 'lucide-react';
import { DualDetectionResult } from '../lib/disaster-detection';

interface EnhancedAlertPanelProps {
  detectionResult: DualDetectionResult;
  onDismiss?: (type: string) => void;
}

export default function EnhancedAlertPanel({
  detectionResult,
  onDismiss,
}: EnhancedAlertPanelProps) {
  const { earthquake, cyclone, activeAlert, riskScoring } = detectionResult;

  if (activeAlert === 'none') {
    return (
      <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-semibold text-green-700 dark:text-green-300">All Clear</span>
          <span className="text-sm text-green-600 dark:text-green-400">No significant disasters detected</span>
        </div>
      </div>
    );
  }

  const createAlertCard = (
    type: 'earthquake' | 'cyclone',
    detected: boolean,
    title: string,
    icon: React.ReactNode,
    details: string[]
  ) => {
    if (!detected) return null;

    const detection = type === 'earthquake' ? earthquake : cyclone;
    
    const getBgColor = () => {
      if (detection.riskLevel === 'Severe') return 'from-red-600 to-red-800';
      if (detection.riskLevel === 'High') return 'from-orange-500 to-orange-700';
      if (detection.riskLevel === 'Moderate') return 'from-yellow-500 to-yellow-600';
      return 'from-blue-500 to-blue-600';
    };

    const getBadgeColor = () => {
      if (detection.riskLevel === 'Severe') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      if (detection.riskLevel === 'High') return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      if (detection.riskLevel === 'Moderate') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    };

    return (
      <div key={type} className={`bg-gradient-to-br ${getBgColor()} rounded-lg p-4 text-white shadow-lg animate-pulse`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <div className="mt-1">{icon}</div>
            <div className="flex-1">
              <div className="font-bold text-lg flex items-center gap-2">
                {title}
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getBadgeColor()}`}>
                  {detection.riskLevel} Risk
                </span>
              </div>

              <div className="text-xs opacity-90 mt-2 space-y-1">
                {details.map((detail, idx) => (
                  <div key={idx}>• {detail}</div>
                ))}
              </div>

              <div className="mt-3 text-sm italic opacity-95">
                {detection.explanation}
              </div>
            </div>
          </div>
          <button
            onClick={() => onDismiss?.(type)}
            className="flex-shrink-0 opacity-75 hover:opacity-100 transition-opacity"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  };

  const earthquakeDetails = [
    `Magnitude: ${earthquake.magnitude.toFixed(2)}`,
    `Confidence: ${(earthquake.confidence * 100).toFixed(0)}%`,
    `Level: ${earthquake.riskLevel}`,
  ];

  const cycloneDetails = [
    `Wind Speed: ${cyclone.windSpeed.toFixed(0)} km/h`,
    `Pressure: ${cyclone.pressure.toFixed(0)} hPa`,
    `Confidence: ${(cyclone.confidence * 100).toFixed(0)}%`,
  ];

  return (
    <div className="w-full space-y-3">
      {/* AI Explanation Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <h3 className="font-bold text-purple-900 dark:text-purple-200 mb-2">AI Risk Assessment</h3>
        <p className="text-sm text-purple-800 dark:text-purple-300 leading-relaxed">
          {riskScoring.aiExplanation}
        </p>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {createAlertCard(
          'earthquake',
          earthquake.detected,
          'Earthquake Detected',
          <Zap size={24} />,
          earthquakeDetails
        )}
        {createAlertCard(
          'cyclone',
          cyclone.detected,
          'Cyclone Detected',
          <Wind size={24} />,
          cycloneDetails
        )}
      </div>

      {/* Action Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
          <AlertCircle size={18} />
          Recommended Actions
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          {activeAlert === 'earthquake' || activeAlert === 'both' ? (
            <li>• Activate seismic alert protocols</li>
          ) : null}
          {activeAlert === 'cyclone' || activeAlert === 'both' ? (
            <li>• Trigger cyclone warning systems</li>
          ) : null}
          <li>• Notify emergency response teams immediately</li>
          <li>• Initiate evacuation procedures in affected regions</li>
          <li>• Deploy monitoring resources to high-risk areas</li>
        </ul>
      </div>
    </div>
  );
}
