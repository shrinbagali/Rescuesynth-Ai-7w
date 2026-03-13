import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Download, Save, AlertTriangle } from 'lucide-react';
import DisasterImageViewer from '../components/DisasterImageViewer';
import ImagePatternAnalysis from '../components/ImagePatternAnalysis';
import AIExplanationPanel from '../components/AIExplanationPanel';
import ImageDetectionAlerts from '../components/ImageDetectionAlerts';
import { DisasterType, EnvironmentalInputs, DetectionRiskLevel, ImageAnalysisResult } from '../types';
import { analyzeImagePattern, DetectedPattern } from '../utils/disasterPatternDetector';
import { generateDisasterExplanation, DisasterExplanation } from '../utils/generateDisasterExplanation';

interface ImageDetectionProps {
  onAnalysisComplete?: (result: ImageAnalysisResult) => void;
  analysisHistory?: ImageAnalysisResult[];
}

const REGIONS: EnvironmentalInputs['region'][] = [
  'Kerala Coastal Region',
  'Assam Flood Plains',
  'Odisha Cyclone Belt',
  'Uttarakhand Himalayan Zone',
  'Himachal Mountain Region',
  'Maharashtra Urban Region',
  'Bengaluru Urban Region',
];

export default function ImageDetection({
  onAnalysisComplete,
  analysisHistory = [],
}: ImageDetectionProps) {
  const [selectedDisasterType, setSelectedDisasterType] = useState<DisasterType>('Cyclone');
  const [selectedRegion, setSelectedRegion] = useState<EnvironmentalInputs['region']>('Odisha Cyclone Belt');
  const [intensity, setIntensity] = useState(0.6);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Environmental inputs
  const [environmentalInputs, setEnvironmentalInputs] = useState<EnvironmentalInputs>({
    region: selectedRegion,
    rainfallIntensity: 75,
    waterLevel: 'Medium',
    windSpeed: 120,
    seismicActivity: 4.5,
    temperature: 28,
    soilSaturation: 'Medium',
    vegetationDryness: 'Low',
  });

  // Analysis results
  const [patterns, setPatterns] = useState<DetectedPattern[]>([]);
  const [primaryDisasterType, setPrimaryDisasterType] = useState<DisasterType | 'No Disaster Detected'>(
    'No Disaster Detected'
  );
  const [confidence, setConfidence] = useState(0);
  const [riskLevel, setRiskLevel] = useState<DetectionRiskLevel>('Low Risk');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<DisasterExplanation | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Get active alerts (not dismissed)
  const activeAlerts = analysisHistory.filter(a => !dismissedAlerts.has(a.id));

  // Calculate risk level based on confidence
  const calculateRiskLevel = (conf: number): DetectionRiskLevel => {
    if (conf > 80) return 'Severe Risk';
    if (conf > 60) return 'High Risk';
    if (conf > 40) return 'Moderate Risk';
    return 'Low Risk';
  };

  // Analyze the image
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Get canvas context
    if (!canvasRef.current) {
      setIsAnalyzing(false);
      return;
    }

    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      setIsAnalyzing(false);
      return;
    }

    try {
      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Analyze pattern
      const analysisResult = analyzeImagePattern(imageData, environmentalInputs);

      // Update states
      setPatterns(analysisResult.detectedPatterns);
      setPrimaryDisasterType(analysisResult.primaryDisasterType);
      setConfidence(analysisResult.overallConfidence);
      setRecommendations(analysisResult.recommendations);

      const detectedRiskLevel = calculateRiskLevel(analysisResult.overallConfidence);
      setRiskLevel(detectedRiskLevel);

      // Generate explanation
      const exp = generateDisasterExplanation(
        analysisResult.primaryDisasterType,
        analysisResult.overallConfidence,
        analysisResult.detectedPatterns,
        environmentalInputs,
        detectedRiskLevel
      );
      setExplanation(exp);

      // Callback with results
      if (onAnalysisComplete) {
        const result: ImageAnalysisResult = {
          id: `analysis-${Date.now()}`,
          timestamp: new Date(),
          disasterType: analysisResult.primaryDisasterType,
          region: environmentalInputs.region,
          detectedPatterns: analysisResult.detectedPatterns,
          overallConfidence: analysisResult.overallConfidence,
          riskLevel: detectedRiskLevel,
          recommendations: analysisResult.recommendations,
          explanation: exp.narrative,
        };
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Reset analysis
  const handleReset = () => {
    setPatterns([]);
    setPrimaryDisasterType('No Disaster Detected');
    setConfidence(0);
    setRecommendations([]);
    setExplanation(null);
    setRiskLevel('Low Risk');
    setIntensity(0.6);
  };

  // Update environmental inputs
  const updateEnvironmental = (key: keyof EnvironmentalInputs, value: any) => {
    setEnvironmentalInputs(prev => ({ ...prev, [key]: value }));
  };

  // Dismiss alert
  const handleDismissAlert = (id: string) => {
    setDismissedAlerts(prev => new Set(prev).add(id));
  };

  // Download analysis report
  const handleDownload = () => {
    const report = `
IMAGE-BASED DISASTER DETECTION REPORT
Generated: ${new Date().toISOString()}

DETECTION RESULTS
================
Disaster Type: ${primaryDisasterType}
Overall Confidence: ${confidence}%
Risk Level: ${riskLevel}
Region: ${environmentalInputs.region}

DETECTED PATTERNS
================
${patterns.map(p => `- ${p.pattern}: ${p.confidence}% confidence\n  ${p.description}`).join('\n')}

ENVIRONMENTAL CONDITIONS
=======================
Temperature: ${environmentalInputs.temperature}°C
Wind Speed: ${environmentalInputs.windSpeed} km/h
Rainfall Intensity: ${environmentalInputs.rainfallIntensity} mm/h
Water Level: ${environmentalInputs.waterLevel}
Seismic Activity: ${environmentalInputs.seismicActivity}
Soil Saturation: ${environmentalInputs.soilSaturation}
Vegetation Dryness: ${environmentalInputs.vegetationDryness}

AI ANALYSIS NARRATIVE
====================
${explanation?.narrative}

RECOMMENDATIONS
===============
${recommendations.map(r => `- ${r}`).join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disaster-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Alert Notifications */}
      <ImageDetectionAlerts 
        recentAnalyses={activeAlerts}
        onDismiss={handleDismissAlert}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Image-Based Disaster Detection</h1>
        <p className="text-slate-400 mt-2">
          Analyze satellite imagery using AI pattern recognition to detect and assess disaster risks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Disaster Type Selection */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Disaster Type</h3>
            <div className="space-y-2">
              {(['Cyclone', 'Earthquake', 'Flood', 'Wildfire', 'Landslide'] as DisasterType[]).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedDisasterType(type);
                    handleReset();
                  }}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all text-left ${
                    selectedDisasterType === type
                      ? 'bg-neon-blue text-white shadow-lg shadow-neon-blue/50'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Region Selection */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Region</h3>
            <select
              value={selectedRegion}
              onChange={e => {
                setSelectedRegion(e.target.value as EnvironmentalInputs['region']);
                updateEnvironmental('region', e.target.value);
                handleReset();
              }}
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-neon-blue"
            >
              {REGIONS.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Intensity Control */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Intensity</h3>
              <span className="text-sm font-mono text-neon-teal">{Math.round(intensity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={intensity}
              onChange={e => {
                setIntensity(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-neon-blue"
            />
            <p className="text-xs text-slate-400 mt-3">Adjust the disaster intensity for simulation</p>
          </div>

          {/* Environmental Parameters */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Environmental Inputs</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Temperature: {environmentalInputs.temperature}°C
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={environmentalInputs.temperature}
                  onChange={e => updateEnvironmental('temperature', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg accent-neon-teal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Wind Speed: {environmentalInputs.windSpeed} km/h
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={environmentalInputs.windSpeed}
                  onChange={e => updateEnvironmental('windSpeed', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg accent-neon-teal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rainfall: {environmentalInputs.rainfallIntensity} mm/h
                </label>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={environmentalInputs.rainfallIntensity}
                  onChange={e => updateEnvironmental('rainfallIntensity', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg accent-neon-teal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Seismic Activity: {environmentalInputs.seismicActivity}
                </label>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.1"
                  value={environmentalInputs.seismicActivity}
                  onChange={e => updateEnvironmental('seismicActivity', parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-900 rounded-lg accent-neon-teal"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-neon-blue to-neon-teal text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-blue/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play size={18} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>

            <button
              onClick={handleReset}
              className="w-full bg-slate-900 text-slate-300 font-semibold py-2 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Reset
            </button>

            {confidence > 0 && (
              <button
                onClick={handleDownload}
                className="w-full bg-slate-900 text-slate-300 font-semibold py-2 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download Report
              </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Viewer */}
          <DisasterImageViewer
            disasterType={selectedDisasterType}
            intensity={intensity}
            width={500}
            height={400}
            className="mx-auto"
          />

          {/* Hidden canvas for image analysis */}
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            style={{ display: 'none' }}
          />

          {/* Pattern Analysis Results */}
          {confidence > 0 && (
            <ImagePatternAnalysis
              patterns={patterns}
              primaryDisasterType={primaryDisasterType}
              confidence={confidence}
              riskLevel={riskLevel}
              recommendations={recommendations}
            />
          )}

          {/* AI Explanation */}
          {explanation && confidence > 0 && (
            <AIExplanationPanel
              explanation={explanation}
              isLoading={isAnalyzing}
            />
          )}
        </div>
      </div>

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Save size={20} className="text-neon-blue" />
            Recent Analyses ({analysisHistory.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisHistory.slice(0, 6).map(analysis => (
              <div key={analysis.id} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{analysis.disasterType}</h4>
                  <span className="text-xs font-mono text-neon-teal">{analysis.overallConfidence}%</span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{analysis.region}</p>
                <p className="text-xs text-slate-300">{analysis.riskLevel}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
