import React from 'react';
import { AlertCircle, TrendingUp, CheckCircle, Activity } from 'lucide-react';
import { DetectedPattern } from '../utils/disasterPatternDetector';
import { DisasterType, DetectionRiskLevel } from '../types';

interface ImagePatternAnalysisProps {
  patterns: DetectedPattern[];
  primaryDisasterType: DisasterType | 'No Disaster Detected';
  confidence: number;
  riskLevel: DetectionRiskLevel;
  recommendations: string[];
}

export default function ImagePatternAnalysis({
  patterns,
  primaryDisasterType,
  confidence,
  riskLevel,
  recommendations,
}: ImagePatternAnalysisProps) {
  const getConfidenceColor = (conf: number): string => {
    if (conf > 80) return 'text-red-500';
    if (conf > 60) return 'text-orange-500';
    if (conf > 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getConfidenceLabel = (conf: number): string => {
    if (conf > 80) return 'Critical';
    if (conf > 60) return 'High';
    if (conf > 40) return 'Moderate';
    return 'Low';
  };

  const getRiskColor = (risk: DetectionRiskLevel): string => {
    switch (risk) {
      case 'Severe Risk':
        return 'from-red-600 to-red-800 border-red-500';
      case 'High Risk':
        return 'from-orange-600 to-orange-800 border-orange-500';
      case 'Moderate Risk':
        return 'from-yellow-600 to-yellow-800 border-yellow-500';
      case 'Low Risk':
        return 'from-green-600 to-green-800 border-green-500';
    }
  };

  const getRiskLabel = (risk: DetectionRiskLevel): string => {
    switch (risk) {
      case 'Severe Risk':
        return '🚨 CRITICAL ALERT';
      case 'High Risk':
        return '⚠️ HIGH RISK';
      case 'Moderate Risk':
        return '⚠️ MODERATE RISK';
      case 'Low Risk':
        return '✓ LOW RISK';
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Detection Result */}
      <div className={`rounded-lg border bg-gradient-to-r ${getRiskColor(riskLevel)} p-6`}>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              {primaryDisasterType === 'No Disaster Detected' ? (
                <>
                  <CheckCircle size={28} />
                  No Threat Detected
                </>
              ) : (
                <>
                  <AlertCircle size={28} />
                  {getRiskLabel(riskLevel)}
                </>
              )}
            </h3>
            <p className="text-slate-200 mt-2">
              {primaryDisasterType === 'No Disaster Detected'
                ? 'Environmental conditions remain within normal parameters'
                : `Detected: ${primaryDisasterType} with ${getConfidenceLabel(confidence)} confidence`}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getConfidenceColor(confidence)}`}>
              {Math.round(confidence)}%
            </div>
            <p className="text-sm text-slate-300 mt-1">Detection Confidence</p>
          </div>
        </div>
      </div>

      {/* Detected Patterns */}
      {patterns.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-neon-blue" />
            Detected Patterns
          </h4>
          <div className="space-y-3">
            {patterns.map((pattern, index) => (
              <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h5 className="font-semibold text-white capitalize">
                      {pattern.pattern.replace(/_/g, ' ')}
                    </h5>
                    <p className="text-sm text-slate-400 mt-1">{pattern.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-neon-teal">
                      {Math.round(pattern.confidence)}%
                    </div>
                    <p className="text-xs text-slate-500">confidence</p>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-neon-blue to-neon-teal h-full transition-all duration-500"
                    style={{ width: `${pattern.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && primaryDisasterType !== 'No Disaster Detected' && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={20} className="text-neon-blue" />
            Recommended Actions
          </h4>
          <div className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 text-slate-200">
                <div className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
