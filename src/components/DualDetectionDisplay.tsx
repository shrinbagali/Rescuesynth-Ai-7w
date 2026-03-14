import React from 'react';
import { DualDetectionResult } from '../utils/disaster-detection';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface DualDetectionDisplayProps {
  detectionResult: DualDetectionResult;
}

export const DualDetectionDisplay: React.FC<DualDetectionDisplayProps> = ({ detectionResult }) => {
  const { earthquake, cyclone } = detectionResult;

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Severe':
        return 'from-red-600 to-red-700 border-red-700';
      case 'High':
        return 'from-orange-500 to-orange-600 border-orange-600';
      case 'Moderate':
        return 'from-yellow-500 to-yellow-600 border-yellow-600';
      default:
        return 'from-green-500 to-green-600 border-green-600';
    }
  };

  const getRiskBgColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Severe':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'High':
        return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800';
      case 'Moderate':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
    }
  };

  const DetectionCard = ({
    title,
    data,
    icon: Icon,
  }: {
    title: string;
    data: any;
    icon: React.ReactNode;
  }) => (
    <div
      className={`p-6 rounded-lg border-2 transition-all ${
        data.detected ? getRiskBgColor(data.riskLevel) : 'bg-card border-border'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-muted">{Icon}</div>
          <h4 className="text-lg font-semibold">{title}</h4>
        </div>
        {data.detected && (
          <div className="animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
        )}
      </div>

      {data.detected ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getRiskColor(data.riskLevel)}`}>
                {data.riskLevel}
              </div>
              <span className="text-xs text-muted-foreground">
                {(data.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-black/20 p-3 rounded border border-border">
            <p className="text-sm leading-relaxed text-foreground">{data.explanation}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              Triggered By
            </p>
            <div className="flex flex-wrap gap-2">
              {data.triggeredBy.map((trigger: string, idx: number) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded bg-muted/50 text-foreground flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" />
                  {trigger}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-muted-foreground">{title} levels within safe range</p>
          <p className="text-xs text-muted-foreground mt-2">{data.explanation}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {detectionResult.activeAlert !== 'none' && (
        <div className="animate-pulse">
          <div className="p-4 rounded-lg border-2 border-red-500 bg-red-50 dark:bg-red-950/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Active Alert:{' '}
                {detectionResult.activeAlert === 'both'
                  ? 'Earthquake & Cyclone'
                  : detectionResult.activeAlert.charAt(0).toUpperCase() +
                    detectionResult.activeAlert.slice(1)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <DetectionCard
          title="Earthquake Detection"
          data={earthquake}
          icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
        />
        <DetectionCard
          title="Cyclone Detection"
          data={cyclone}
          icon={<TrendingUp className="w-5 h-5 text-cyan-600" />}
        />
      </div>
    </div>
  );
};
