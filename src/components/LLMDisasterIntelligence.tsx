import React from 'react';
import { Brain, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { LLMExplanation } from '../utils/llmSimulator';

interface LLMDisasterIntelligenceProps {
  explanation: LLMExplanation | null;
  isLoading?: boolean;
}

export default function LLMDisasterIntelligence({
  explanation,
  isLoading = false,
}: LLMDisasterIntelligenceProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Brain size={20} className="text-purple-400" />
          LLM Disaster Intelligence
        </h3>
        {isLoading && <span className="text-xs text-purple-400 animate-pulse">Analyzing...</span>}
      </div>

      {explanation ? (
        <div className="space-y-4">
          {/* Executive Summary */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 bg-opacity-20 border border-purple-500 rounded-lg p-4">
            <p className="text-sm text-purple-300 leading-relaxed">{explanation.summary}</p>
          </div>

          {/* Key Factors */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
              <AlertCircle size={16} />
              Key Contributing Factors
            </h4>
            <div className="space-y-2">
              {explanation.keyFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 text-xs bg-slate-800 bg-opacity-30 border border-slate-700 rounded p-2"
                >
                  <span className="text-cyan-400 font-bold">•</span>
                  <span className="text-gray-300">{factor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Amplifiers */}
          {explanation.riskAmplifiers.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                <AlertCircle size={16} />
                Risk Amplifiers
              </h4>
              <div className="space-y-2">
                {explanation.riskAmplifiers.map((amplifier, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 text-xs bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-50 rounded p-2"
                  >
                    <span className="text-orange-400 font-bold">⚠</span>
                    <span className="text-orange-300">{amplifier}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safeguards */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-green-400 flex items-center gap-2">
              <Shield size={16} />
              Active Safeguards
            </h4>
            <div className="space-y-2">
              {explanation.safeguards.map((safeguard, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 text-xs bg-green-500 bg-opacity-10 border border-green-500 border-opacity-50 rounded p-2"
                >
                  <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-green-300">{safeguard}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
              <AlertCircle size={16} />
              Recommendations
            </h4>
            <div className="space-y-2">
              {explanation.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 text-xs bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-50 rounded p-2"
                >
                  <span className="text-yellow-400 font-bold">{idx + 1}.</span>
                  <span className="text-yellow-300">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Warning */}
          <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-3 flex gap-3">
            <Clock size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-blue-300 font-semibold mb-1">Timeline Alert</p>
              <p className="text-xs text-blue-200">{explanation.timelineWarning}</p>
            </div>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-slate-700">
            Analysis generated: {explanation.timestamp?.toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-8 text-center">
          <Brain size={32} className="text-purple-400 mx-auto mb-2 opacity-50" />
          <p className="text-sm text-gray-400">No disaster analysis available</p>
          <p className="text-xs text-gray-500 mt-1">Waiting for detection event...</p>
        </div>
      )}
    </div>
  );
}
