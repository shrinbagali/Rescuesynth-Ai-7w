import React from 'react';
import { ArrowRight, Database, Brain, AlertTriangle } from 'lucide-react';

export default function UIToLLMExplanation() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Data Pipeline: UI → LLM Analysis</h3>
      </div>

      {/* Pipeline Visualization */}
      <div className="space-y-3">
        {/* Step 1: Environmental Data */}
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 bg-opacity-20 border border-blue-500">
              <Database size={16} className="text-blue-400" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-blue-300">Step 1: Sensor Data Collection</p>
            <p className="text-xs text-gray-400 mt-1">
              Real-time environmental parameters gathered from monitoring stations: rainfall, wind speed,
              temperature, seismic activity, soil saturation, and more.
            </p>
            <div className="mt-2 p-2 bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-50 rounded text-xs text-gray-300">
              <p>Rainfall: 150mm | Wind: 95 km/h | Seismic: 5.8 | Temp: 32°C | Humidity: 45%</p>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight size={20} className="text-gray-500 rotate-90" />
        </div>

        {/* Step 2: Detection Engine */}
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 bg-opacity-20 border border-orange-500">
              <AlertTriangle size={16} className="text-orange-400" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-orange-300">Step 2: Disaster Detection</p>
            <p className="text-xs text-gray-400 mt-1">
              Detection engine analyzes parameters against disaster-specific thresholds. Compares current
              readings to known crisis patterns for Earthquakes, Cyclones, Floods, Wildfires, and Landslides.
            </p>
            <div className="mt-2 p-2 bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-50 rounded text-xs text-gray-300">
              <p>Detection: CYCLONE | Risk Level: HIGH | Confidence: 87%</p>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight size={20} className="text-gray-500 rotate-90" />
        </div>

        {/* Step 3: LLM Processing */}
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-500 bg-opacity-20 border border-purple-500">
              <Brain size={16} className="text-purple-400" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-purple-300">Step 3: LLM Analysis & Explanation</p>
            <p className="text-xs text-gray-400 mt-1">
              The LLM Simulator processes detection results with environmental context to generate
              natural language explanations. Analyzes contributing factors, amplifiers, and creates
              actionable recommendations.
            </p>
            <div className="mt-2 p-2 bg-purple-500 bg-opacity-10 border border-purple-500 border-opacity-50 rounded text-xs text-gray-300">
              <p>"A significant cyclone system is rapidly intensifying. Wind speeds exceeding 130 km/h combined with low atmospheric pressure (935 hPa) indicate major impact. Coastal surge and extreme rainfall expected..."</p>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight size={20} className="text-gray-500 rotate-90" />
        </div>

        {/* Step 4: UI Presentation */}
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-cyan-500 bg-opacity-20 border border-cyan-500">
              <AlertTriangle size={16} className="text-cyan-400" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-cyan-300">Step 4: User Interface Display</p>
            <p className="text-xs text-gray-400 mt-1">
              Results presented through comprehensive dashboards: Risk Meter shows threat level, Prediction
              Timeline forecasts event progression, and LLM Intelligence panel displays AI-generated insights
              with key factors, safeguards, and recommendations.
            </p>
            <div className="mt-2 p-2 bg-cyan-500 bg-opacity-10 border border-cyan-500 border-opacity-50 rounded text-xs text-gray-300">
              <p>Risk Meter: 78/100 CRITICAL | Timeline: +12hrs at PEAK | Alerts: 3 Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-3 space-y-2">
        <p className="text-sm font-semibold text-white mb-2">Multi-Parameter Analysis Pipeline</p>
        <ul className="space-y-1 text-xs text-gray-300">
          <li className="flex gap-2">
            <span className="text-blue-400">✓</span>
            <span>Real-time sensor data collection every 8-10 seconds</span>
          </li>
          <li className="flex gap-2">
            <span className="text-orange-400">✓</span>
            <span>Threshold-based disaster pattern recognition</span>
          </li>
          <li className="flex gap-2">
            <span className="text-purple-400">✓</span>
            <span>Natural language AI explanations from detection results</span>
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-400">✓</span>
            <span>Confidence scoring for alert prioritization</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-400">✓</span>
            <span>Timeline predictions based on disaster type</span>
          </li>
          <li className="flex gap-2">
            <span className="text-yellow-400">✓</span>
            <span>Actionable recommendations for emergency response</span>
          </li>
        </ul>
      </div>

      {/* Technical Note */}
      <div className="bg-slate-800 bg-opacity-30 border border-slate-700 rounded-lg p-3 text-xs text-gray-400">
        <p className="font-semibold text-gray-300 mb-1">Client-Side Processing</p>
        <p>
          All analysis happens locally in the browser. No external APIs required. The LLM simulator generates
          contextually appropriate explanations based on disaster type and current environmental conditions.
        </p>
      </div>
    </div>
  );
}
