import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { DetectionRiskLevel } from '../types';

interface TimelinePoint {
  label: string;
  time: string;
  riskLevel: DetectionRiskLevel;
  description: string;
}

interface PredictionTimelineProps {
  currentRiskLevel: DetectionRiskLevel;
  disasterType: string;
}

export default function PredictionTimeline({
  currentRiskLevel,
  disasterType,
}: PredictionTimelineProps) {
  // Generate prediction timeline based on disaster type and current risk
  const generateTimeline = (): TimelinePoint[] => {
    const baseRisk = currentRiskLevel as DetectionRiskLevel;
    
    switch (disasterType) {
      case 'Earthquake':
        return [
          {
            label: 'Now',
            time: 'Current',
            riskLevel: baseRisk,
            description: 'Main earthquake event detected',
          },
          {
            label: '+30 mins',
            time: 'Next 30 minutes',
            riskLevel: 'High Risk',
            description: 'Aftershock probability peaks',
          },
          {
            label: '+6 hours',
            time: 'Next 6 hours',
            riskLevel: 'Moderate Risk',
            description: 'Secondary aftershocks likely',
          },
          {
            label: '+24 hours',
            time: 'Next 24 hours',
            riskLevel: 'Low Risk',
            description: 'Aftershock activity declining',
          },
        ];

      case 'Cyclone':
        return [
          {
            label: 'Now',
            time: 'Current',
            riskLevel: baseRisk,
            description: 'Cyclone system approaching',
          },
          {
            label: '+6 hours',
            time: 'Next 6 hours',
            riskLevel: 'High Risk',
            description: 'Intensification phase',
          },
          {
            label: '+12 hours',
            time: 'Next 12 hours',
            riskLevel: 'Severe Risk',
            description: 'Peak intensity - maximum impact',
          },
          {
            label: '+24 hours',
            time: 'Next 24 hours',
            riskLevel: 'Moderate Risk',
            description: 'Weakening phase begins',
          },
        ];

      case 'Flood':
        return [
          {
            label: 'Now',
            time: 'Current',
            riskLevel: baseRisk,
            description: 'Rising water levels detected',
          },
          {
            label: '+3 hours',
            time: 'Next 3 hours',
            riskLevel: 'High Risk',
            description: 'Rapid water level increase',
          },
          {
            label: '+12 hours',
            time: 'Next 12 hours',
            riskLevel: 'Moderate Risk',
            description: 'Peak water levels expected',
          },
          {
            label: '+48 hours',
            time: 'Next 48 hours',
            riskLevel: 'Low Risk',
            description: 'Water levels receding',
          },
        ];

      case 'Wildfire':
        return [
          {
            label: 'Now',
            time: 'Current',
            riskLevel: baseRisk,
            description: 'Active fire spread detected',
          },
          {
            label: '+2 hours',
            time: 'Next 2 hours',
            riskLevel: 'High Risk',
            description: 'Rapid spread in dry conditions',
          },
          {
            label: '+12 hours',
            time: 'Next 12 hours',
            riskLevel: 'Moderate Risk',
            description: 'Peak fire activity',
          },
          {
            label: '+72 hours',
            time: 'Next 72 hours',
            riskLevel: 'Low Risk',
            description: 'Containment phase',
          },
        ];

      case 'Landslide':
        return [
          {
            label: 'Now',
            time: 'Current',
            riskLevel: baseRisk,
            description: 'Slope instability detected',
          },
          {
            label: '+6 hours',
            time: 'Next 6 hours',
            riskLevel: 'High Risk',
            description: 'Critical instability window',
          },
          {
            label: '+24 hours',
            time: 'Next 24 hours',
            riskLevel: 'Moderate Risk',
            description: 'Slope stabilization begins',
          },
          {
            label: '+7 days',
            time: 'Next 7 days',
            riskLevel: 'Low Risk',
            description: 'Soil conditions stabilizing',
          },
        ];

      default:
        return [
          {
            label: 'Now',
            time: 'Current',
            riskLevel: 'Low Risk',
            description: 'Monitoring conditions',
          },
          {
            label: '+6 hours',
            time: 'Next 6 hours',
            riskLevel: 'Low Risk',
            description: 'No significant changes expected',
          },
          {
            label: '+24 hours',
            time: 'Next 24 hours',
            riskLevel: 'Low Risk',
            description: 'Conditions normal',
          },
        ];
    }
  };

  const timeline = generateTimeline();

  const getRiskColorForTimeline = (riskLevel: DetectionRiskLevel): string => {
    switch (riskLevel) {
      case 'Severe Risk':
        return 'bg-red-500';
      case 'High Risk':
        return 'bg-orange-500';
      case 'Moderate Risk':
        return 'bg-yellow-500';
      case 'Low Risk':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskBgColor = (riskLevel: DetectionRiskLevel): string => {
    switch (riskLevel) {
      case 'Severe Risk':
        return 'bg-red-500 bg-opacity-10 border-red-500';
      case 'High Risk':
        return 'bg-orange-500 bg-opacity-10 border-orange-500';
      case 'Moderate Risk':
        return 'bg-yellow-500 bg-opacity-10 border-yellow-500';
      case 'Low Risk':
        return 'bg-green-500 bg-opacity-10 border-green-500';
      default:
        return 'bg-gray-500 bg-opacity-10 border-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock size={20} className="text-blue-400" />
          Prediction Timeline
        </h3>
        <span className="text-xs text-gray-400">{disasterType}</span>
      </div>

      {/* Timeline Visualization */}
      <div className="space-y-3">
        {timeline.map((point, idx) => (
          <div key={idx} className="flex gap-4">
            {/* Timeline Dot and Line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full ${getRiskColorForTimeline(point.riskLevel)} ring-2 ring-offset-2 ring-offset-slate-900 ring-slate-700`}
              />
              {idx < timeline.length - 1 && (
                <div className="w-1 h-12 bg-gradient-to-b from-slate-700 to-slate-800 my-1" />
              )}
            </div>

            {/* Timeline Content */}
            <div className={`flex-1 border rounded-lg p-3 ${getRiskBgColor(point.riskLevel)}`}>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-sm font-bold text-white">{point.label}</p>
                  <p className="text-xs text-gray-400">{point.time}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold text-white ${getRiskColorForTimeline(
                    point.riskLevel
                  )}`}
                >
                  {point.riskLevel}
                </span>
              </div>
              <p className="text-xs text-gray-300">{point.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Legend */}
      <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-3">
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
          <AlertTriangle size={14} />
          Projections based on current conditions
        </p>
        <p className="text-xs text-gray-500">
          Actual disaster progression may differ. Continuous monitoring is essential for accurate updates.
        </p>
      </div>
    </div>
  );
}
