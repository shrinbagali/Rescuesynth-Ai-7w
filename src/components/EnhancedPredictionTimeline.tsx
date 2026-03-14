import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Prediction } from '../lib/disaster-detection';

interface PredictionTimelineProps {
  predictions: Prediction[];
  currentScore: number;
}

export default function EnhancedPredictionTimeline({
  predictions,
  currentScore,
}: PredictionTimelineProps) {
  const getTrendIcon = (current: number, predicted: number) => {
    const diff = predicted - current;
    if (diff > 5) return <TrendingUp className="text-red-500" size={18} />;
    if (diff < -5) return <TrendingDown className="text-green-500" size={18} />;
    return <Minus className="text-gray-500" size={18} />;
  };

  const getTrendColor = (score: number) => {
    if (score >= 75) return 'from-red-600 to-red-800';
    if (score >= 50) return 'from-orange-500 to-orange-700';
    if (score >= 25) return 'from-yellow-400 to-yellow-600';
    return 'from-green-400 to-green-600';
  };

  return (
    <div className="w-full space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Prediction Timeline</h3>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {/* Current State */}
        <div className="flex-shrink-0 w-32">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">NOW</div>
            <div className={`text-3xl font-bold bg-gradient-to-br ${getTrendColor(currentScore)} bg-clip-text text-transparent`}>
              {currentScore.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Current Risk</div>
          </div>
        </div>

        {/* Predictions */}
        {predictions.map((pred, idx) => (
          <div key={idx} className="flex-shrink-0 w-32">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              {/* Timeframe */}
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">{pred.timeframe}</div>

              {/* Score */}
              <div className={`text-3xl font-bold bg-gradient-to-br ${getTrendColor(pred.riskScore)} bg-clip-text text-transparent mb-2`}>
                {pred.riskScore.toFixed(1)}
              </div>

              {/* Trend */}
              <div className="flex items-center justify-center mb-3">
                {getTrendIcon(currentScore, pred.riskScore)}
              </div>

              {/* Expected Values */}
              <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                {pred.expectedMagnitude !== undefined && (
                  <div>Mag: <span className="font-semibold">{pred.expectedMagnitude.toFixed(1)}</span></div>
                )}
                {pred.expectedWindSpeed !== undefined && (
                  <div>Wind: <span className="font-semibold">{pred.expectedWindSpeed.toFixed(0)} km/h</span></div>
                )}
              </div>

              {/* Description */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                {pred.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-red-500" />
          <span>Risk Increasing</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown size={14} className="text-green-500" />
          <span>Risk Decreasing</span>
        </div>
        <div className="flex items-center gap-2">
          <Minus size={14} className="text-gray-500" />
          <span>Risk Stable</span>
        </div>
      </div>
    </div>
  );
}
