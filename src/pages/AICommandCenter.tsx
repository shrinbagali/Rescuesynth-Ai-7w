import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, Pause } from 'lucide-react';
import EnvironmentalMonitoring from '../components/EnvironmentalMonitoring';
import DisasterDetectionEngineUI from '../components/DisasterDetectionEngineUI';
import RiskMeterWidget from '../components/RiskMeterWidget';
import LLMDisasterIntelligence from '../components/LLMDisasterIntelligence';
import PredictionTimeline from '../components/PredictionTimeline';
import SeismicDataset from '../components/SeismicDataset';
import AlertNotificationSystem from '../components/AlertNotificationSystem';
import UIToLLMExplanation from '../components/UIToLLMExplanation';
import { MonitoringEnvironmentalData, DisasterAlert } from '../types';
import { generateEnvironmentalReading, generateExtremeWeatherConditions } from '../utils/environmentalDataGenerator';
import { detectDisaster } from '../utils/disasterDetectionEngine';
import { generateLLMExplanation, LLMExplanation } from '../utils/llmSimulator';

interface CommandCenterState {
  currentEnvironment: MonitoringEnvironmentalData;
  detectionResult: ReturnType<typeof detectDisaster>;
  llmExplanation: LLMExplanation | null;
  alerts: DisasterAlert[];
  isMonitoring: boolean;
  selectedRegion: string;
  showLLMFlow: boolean;
}

export default function AICommandCenter() {
  const [state, setState] = useState<CommandCenterState>({
    currentEnvironment: generateEnvironmentalReading('Japan Seismic Zone'),
    detectionResult: {
      disasterDetected: false,
      disasterType: 'No Disaster Detected',
      riskLevel: 'Low Risk',
      confidence: 0.95,
      reasoning: 'All environmental parameters within normal safe ranges.',
    },
    llmExplanation: null,
    alerts: [],
    isMonitoring: true,
    selectedRegion: 'Japan Seismic Zone',
    showLLMFlow: false,
  });

  // Monitoring loop
  useEffect(() => {
    if (!state.isMonitoring) return;

    const interval = setInterval(() => {
      setState((prev) => {
        // Generate new environmental data
        const newEnvironment = generateEnvironmentalReading(prev.selectedRegion, prev.currentEnvironment);

        // Run detection
        const detectionResult = detectDisaster(newEnvironment);

        // Generate LLM explanation if disaster detected
        let llmExplanation = prev.llmExplanation;
        if (detectionResult.disasterDetected) {
          llmExplanation = generateLLMExplanation(
            detectionResult.disasterType as any,
            prev.selectedRegion,
            newEnvironment,
            detectionResult.riskLevel
          );

          // Create alert if not already present
          const existingAlert = prev.alerts.find((a) => a.disasterType === detectionResult.disasterType);
          if (!existingAlert) {
            const newAlert: DisasterAlert = {
              id: `alert-${Date.now()}`,
              disasterType: detectionResult.disasterType as any,
              region: prev.selectedRegion as any,
              riskLevel: detectionResult.riskLevel,
              environmentalData: newEnvironment,
              timestamp: new Date(),
              recommendation: llmExplanation.recommendations[0] || 'Continue monitoring',
              isActive: true,
            };

            return {
              ...prev,
              currentEnvironment: newEnvironment,
              detectionResult,
              llmExplanation,
              alerts: [newAlert, ...prev.alerts].slice(0, 5), // Keep last 5 alerts
            };
          }
        }

        return {
          ...prev,
          currentEnvironment: newEnvironment,
          detectionResult,
          llmExplanation,
        };
      });
    }, 8000); // Update every 8 seconds as per spec

    return () => clearInterval(interval);
  }, [state.isMonitoring]);

  const handleTriggerDisaster = (disasterType: 'Earthquake' | 'Cyclone' | 'Flood' | 'Wildfire' | 'Landslide') => {
    const extremeData = generateExtremeWeatherConditions(disasterType);
    const detectionResult = detectDisaster(extremeData);

    const llmExplanation = generateLLMExplanation(
      disasterType,
      state.selectedRegion,
      extremeData,
      detectionResult.riskLevel
    );

    const newAlert: DisasterAlert = {
      id: `alert-${Date.now()}`,
      disasterType,
      region: state.selectedRegion as any,
      riskLevel: detectionResult.riskLevel,
      environmentalData: extremeData,
      timestamp: new Date(),
      recommendation: llmExplanation.recommendations[0],
      isActive: true,
    };

    setState((prev) => ({
      ...prev,
      currentEnvironment: extremeData,
      detectionResult,
      llmExplanation,
      alerts: [newAlert, ...prev.alerts].slice(0, 5),
    }));
  };

  const handleDismissAlert = (id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((a) => a.id !== id),
    }));
  };

  const disasterTypes: Array<'Earthquake' | 'Cyclone' | 'Flood' | 'Wildfire' | 'Landslide'> = [
    'Earthquake',
    'Cyclone',
    'Flood',
    'Wildfire',
    'Landslide',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Disaster Command Center</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time monitoring and AI-powered disaster prediction</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setState((prev) => ({ ...prev, isMonitoring: !prev.isMonitoring }))}
            className={`px-4 py-2 rounded flex items-center gap-2 transition-all ${
              state.isMonitoring
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            {state.isMonitoring ? <Pause size={16} /> : <Play size={16} />}
            {state.isMonitoring ? 'Monitoring' : 'Paused'}
          </button>

          <button
            onClick={() => setState((prev) => ({ ...prev, showLLMFlow: !prev.showLLMFlow }))}
            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 flex items-center gap-2 transition-all"
          >
            {state.showLLMFlow ? 'Hide' : 'Show'} Pipeline
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Monitoring & Detection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Environmental Data */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <EnvironmentalMonitoring data={state.currentEnvironment} region={state.selectedRegion} />
          </div>

          {/* Detection Engine */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <DisasterDetectionEngineUI
              detectionResult={state.detectionResult}
              isUpdating={state.isMonitoring}
            />
          </div>

          {/* Test Disaster Buttons */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Test Disaster Scenarios</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {disasterTypes.map((disasterType) => (
                <button
                  key={disasterType}
                  onClick={() => handleTriggerDisaster(disasterType)}
                  className={`py-2 px-3 rounded text-xs font-bold transition-all hover:opacity-80 ${
                    disasterType === 'Earthquake'
                      ? 'bg-red-600'
                      : disasterType === 'Cyclone'
                      ? 'bg-cyan-600'
                      : disasterType === 'Flood'
                      ? 'bg-blue-600'
                      : disasterType === 'Wildfire'
                      ? 'bg-orange-600'
                      : 'bg-yellow-600'
                  }`}
                >
                  {disasterType}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">Click to simulate extreme weather conditions</p>
          </div>
        </div>

        {/* Right Column - Risk & Timeline */}
        <div className="space-y-6">
          {/* Risk Meter */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <RiskMeterWidget
              riskLevel={state.detectionResult.riskLevel}
              confidence={state.detectionResult.confidence}
              disasterType={state.detectionResult.disasterType}
            />
          </div>

          {/* Prediction Timeline */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <PredictionTimeline
              currentRiskLevel={state.detectionResult.riskLevel}
              disasterType={state.detectionResult.disasterType as any}
            />
          </div>
        </div>
      </div>

      {/* Middle Section - LLM Intelligence & Dataset */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LLM Intelligence */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <LLMDisasterIntelligence
            explanation={state.llmExplanation}
            isLoading={state.isMonitoring && state.detectionResult.disasterDetected}
          />
        </div>

        {/* Seismic Dataset */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <SeismicDataset />
        </div>
      </div>

      {/* Alert System */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <AlertNotificationSystem alerts={state.alerts} onDismiss={handleDismissAlert} />
      </div>

      {/* UI to LLM Pipeline (Conditional) */}
      {state.showLLMFlow && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <UIToLLMExplanation />
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 pt-4 border-t border-slate-700">
        <p>AI Command Center • All processing is client-side • No external APIs • Real-time updates every 8-10 seconds</p>
      </div>
    </div>
  );
}
