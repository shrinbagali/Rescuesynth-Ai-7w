import React from 'react';
import { MessageCircle, AlertTriangle, Clock, Shield, TrendingDown } from 'lucide-react';
import { DisasterExplanation } from '../utils/generateDisasterExplanation';

interface AIExplanationPanelProps {
  explanation: DisasterExplanation;
  isLoading?: boolean;
}

export default function AIExplanationPanel({
  explanation,
  isLoading = false,
}: AIExplanationPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-slate-600 border-t-neon-blue rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400">Analyzing satellite imagery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Narrative Section */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-neon-blue" />
          AI Analysis Narrative
        </h3>
        <p className="text-slate-200 leading-relaxed text-sm">
          {explanation.narrative}
        </p>
      </div>

      {/* Key Factors */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingDown size={20} className="text-neon-teal" />
          Key Factors
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {explanation.keyFactors.map((factor, index) => (
            <div key={index} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-sm text-slate-300">{factor}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Factors */}
      {explanation.riskFactors.length > 0 && (
        <div className="bg-red-950/30 border border-red-900/30 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-red-300 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Risk Amplifiers
          </h4>
          <div className="space-y-2">
            {explanation.riskFactors.map((factor, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-red-200">{factor}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safeguards */}
      {explanation.safeguards.length > 0 && (
        <div className="bg-green-950/30 border border-green-900/30 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
            <Shield size={20} />
            Recommended Safeguards
          </h4>
          <div className="space-y-2">
            {explanation.safeguards.map((safeguard, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-sm text-green-200">{safeguard}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Clock size={20} className="text-neon-blue" />
          Expected Timeline
        </h4>
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <p className="text-slate-200 text-sm">{explanation.timeline}</p>
        </div>
      </div>
    </div>
  );
}
