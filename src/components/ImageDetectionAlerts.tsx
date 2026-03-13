import React from 'react';
import { AlertTriangle, CheckCircle, Bell, Zap, X } from 'lucide-react';
import { ImageAnalysisResult, DetectionRiskLevel } from '../types';

interface ImageDetectionAlertsProps {
  recentAnalyses: ImageAnalysisResult[];
  onDismiss?: (id: string) => void;
}

export default function ImageDetectionAlerts({
  recentAnalyses,
  onDismiss,
}: ImageDetectionAlertsProps) {
  // Filter for high-confidence detections that should trigger alerts
  const alerts = recentAnalyses.filter(
    a => a.overallConfidence > 70 && a.disasterType !== 'No Disaster Detected'
  );

  if (alerts.length === 0) {
    return null;
  }

  const getRiskColor = (risk: DetectionRiskLevel): string => {
    switch (risk) {
      case 'Severe Risk':
        return 'from-red-600 to-red-800 border-red-500/50';
      case 'High Risk':
        return 'from-orange-600 to-orange-800 border-orange-500/50';
      case 'Moderate Risk':
        return 'from-yellow-600 to-yellow-800 border-yellow-500/50';
      case 'Low Risk':
        return 'from-green-600 to-green-800 border-green-500/50';
    }
  };

  const getIcon = (risk: DetectionRiskLevel) => {
    if (risk === 'Severe Risk' || risk === 'High Risk') {
      return <AlertTriangle size={20} className="text-white" />;
    }
    return <CheckCircle size={20} className="text-white" />;
  };

  return (
    <div className="fixed top-6 right-6 z-40 max-w-md space-y-3">
      {alerts.slice(0, 3).map(alert => (
        <div
          key={alert.id}
          className={`bg-gradient-to-r ${getRiskColor(alert.riskLevel)} border rounded-lg p-4 shadow-lg animate-slide-in`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon(alert.riskLevel)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm">
                {alert.disasterType} Detected
              </h3>
              <p className="text-white/90 text-xs mt-1">
                Region: {alert.region}
              </p>
              <p className="text-white/80 text-xs mt-1">
                Confidence: {Math.round(alert.overallConfidence)}% | {alert.riskLevel}
              </p>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.id)}
                className="flex-shrink-0 text-white hover:bg-white/20 p-1 rounded transition-colors"
                aria-label="Dismiss alert"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
