import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, Download, Zap, Wind, Moon, Sun } from 'lucide-react';
import { EnvironmentalReading, memoizedDetect, DualDetectionResult } from '../utils/disaster-detection';
import { RealTimeMonitoringDual } from '../components/RealTimeMonitoringDual';
import { DualDetectionDisplay } from '../components/DualDetectionDisplay';
import { DisasterChartsComponent } from '../components/DisasterChartsComponent';
import { DisasterMapComponent } from '../components/DisasterMapComponent';
import { RiskScoreMeter } from '../components/RiskScoreMeter';
import { EnhancedPredictionTimeline } from '../components/EnhancedPredictionTimeline';
import { EnhancedAlertPanel } from '../components/EnhancedAlertPanel';
import { EnhancedDisasterMap } from '../components/EnhancedDisasterMap';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

export default function DualDisasterDetection() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [readings, setReadings] = useState<EnvironmentalReading[]>([]);
  const [currentReading, setCurrentReading] = useState<EnvironmentalReading | null>(null);
  const [detectionResult, setDetectionResult] = useState<DualDetectionResult | null>(null);
  const [testMode, setTestMode] = useState<'normal' | 'earthquake' | 'cyclone' | 'both' | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Generate realistic environmental data
  const generateEnvironmentalReading = useCallback((override?: Partial<EnvironmentalReading>): EnvironmentalReading => {
    const baseReading = {
      magnitude: 4.5 + Math.sin(Date.now() / 10000) * 1.2 + (Math.random() - 0.5) * 0.3,
      groundAcceleration: Math.random() * 150 + Math.sin(Date.now() / 5000) * 50,
      epicenterDepth: 50 + Math.random() * 300,
      windSpeed: 30 + Math.cos(Date.now() / 8000) * 15 + (Math.random() - 0.5) * 10,
      atmosphericPressure: 1013 - Math.sin(Date.now() / 12000) * 10,
      rainfall: Math.max(0, Math.sin(Date.now() / 7000) * 150 + (Math.random() - 0.5) * 50),
      humidity: 40 + Math.sin(Date.now() / 6000) * 30 + (Math.random() - 0.5) * 20,
      temperature: 20 + Math.cos(Date.now() / 9000) * 8 + (Math.random() - 0.5) * 5,
      timestamp: new Date(),
    };

    // Apply test mode overrides
    if (testMode === 'earthquake') {
      baseReading.magnitude = 6.8 + Math.random() * 1.0;
      baseReading.groundAcceleration = 400 + Math.random() * 300;
      baseReading.epicenterDepth = 30 + Math.random() * 60;
    } else if (testMode === 'cyclone') {
      baseReading.windSpeed = 140 + Math.random() * 80;
      baseReading.atmosphericPressure = 920 + Math.random() * 20;
      baseReading.rainfall = 200 + Math.random() * 200;
    } else if (testMode === 'both') {
      baseReading.magnitude = 6.5 + Math.random() * 1.2;
      baseReading.groundAcceleration = 350 + Math.random() * 250;
      baseReading.windSpeed = 130 + Math.random() * 70;
      baseReading.atmosphericPressure = 925 + Math.random() * 20;
      baseReading.rainfall = 180 + Math.random() * 180;
    }

    return {
      ...baseReading,
      ...override,
    };
  }, [testMode]);

  // Monitor updates every 8 seconds
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newReading = generateEnvironmentalReading();
      setCurrentReading(newReading);
      setReadings((prev) => [...prev.slice(-99), newReading]); // Keep last 100 readings
      
      // Run detection
      const result = memoizedDetect(newReading);
      setDetectionResult(result);
    }, 8000);

    // Initial reading
    const initialReading = generateEnvironmentalReading();
    setCurrentReading(initialReading);
    setReadings([initialReading]);
    setDetectionResult(memoizedDetect(initialReading));

    return () => clearInterval(interval);
  }, [isMonitoring, testMode, generateEnvironmentalReading]);

  const handleReset = () => {
    setReadings([]);
    setCurrentReading(null);
    setDetectionResult(null);
    setTestMode(null);
    setDismissedAlerts(new Set());
  };

  const handleDownload = () => {
    if (readings.length === 0) return;

    const csvContent = [
      'Timestamp,Magnitude,Ground Acceleration (m/s²),Epicenter Depth (km),Wind Speed (km/h),Atmospheric Pressure (hPa),Rainfall (mm),Humidity (%),Temperature (°C)',
      ...readings.map((r) =>
        `${r.timestamp.toISOString()},${r.magnitude.toFixed(2)},${r.groundAcceleration.toFixed(0)},${r.epicenterDepth.toFixed(0)},${r.windSpeed.toFixed(0)},${r.atmosphericPressure.toFixed(0)},${r.rainfall.toFixed(1)},${r.humidity.toFixed(0)},${r.temperature.toFixed(1)}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dual-disaster-detection-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleDismissAlert = (type: string) => {
    setDismissedAlerts(prev => new Set(prev).add(type));
  };

  // Prepare analytics data
  const analyticsData = useMemo(() => {
    return readings.slice(-12).map((reading, idx) => ({
      time: `T${idx}`,
      seismic: reading.magnitude,
      wind: reading.windSpeed,
      risk: memoizedDetect(reading).riskScoring.overallScore,
      count: Math.random() > 0.7 ? 1 : 0,
    }));
  }, [readings]);

  if (!currentReading || !detectionResult) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${darkMode ? 'dark' : ''}`}>
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Initializing monitoring system...</p>
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-blue-200 dark:bg-blue-900/30 rounded-lg mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 text-white min-h-screen">
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header with Theme Toggle */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Disaster Command Platform</h1>
            <p className="text-gray-400">Real-time earthquake and cyclone monitoring with predictive AI analysis</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                {isMonitoring ? (
                  <>
                    <Pause size={18} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Resume
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors font-medium"
              >
                <RotateCcw size={18} />
                Reset
              </button>

              <button
                onClick={handleDownload}
                disabled={readings.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {['normal', 'earthquake', 'cyclone', 'both'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTestMode(mode as any)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    testMode === mode
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  }`}
                >
                  {mode === 'both' ? 'Both Events' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1">Readings Collected</div>
                <div className="text-2xl font-bold">{readings.length}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1">Monitoring Status</div>
                <div className="text-lg font-bold text-green-400">
                  {isMonitoring ? 'Active' : 'Paused'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1">Magnitude</div>
                <div className="text-2xl font-bold text-blue-400">
                  {currentReading.magnitude.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-400 mb-1">Wind Speed</div>
                <div className="text-2xl font-bold text-cyan-400">
                  {currentReading.windSpeed.toFixed(0)} km/h
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts Section */}
        {!dismissedAlerts.has('alerts') && detectionResult.activeAlert !== 'none' && (
          <div className="bg-red-900/20 border-2 border-red-800 rounded-lg p-4">
            <EnhancedAlertPanel
              detectionResult={detectionResult}
              onDismiss={handleDismissAlert}
            />
          </div>
        )}

        {/* Dual Disaster Detection Module */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Dual Disaster Detection</h2>
          
          {/* Risk Score Display */}
          <div className="mb-6">
            <RiskScoreMeter
              score={detectionResult.riskScoring.overallScore}
              riskLevel={detectionResult.riskScoring.riskLevel}
              earthquakeScore={detectionResult.riskScoring.earthquakeScore}
              cycloneScore={detectionResult.riskScoring.cycloneScore}
            />
          </div>

          {/* Environmental Monitoring */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Real-Time Environmental Parameters</h3>
            <RealTimeMonitoringDual reading={currentReading} isMonitoring={isMonitoring} />
          </div>

          {/* Detection Cards */}
          <div>
            <DualDetectionDisplay detectionResult={detectionResult} />
          </div>
        </div>

        {/* Global Disaster Map */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Global Disaster Map</h2>
          <EnhancedDisasterMap
            earthquakeRisk={detectionResult.riskScoring.earthquakeScore}
            cycloneRisk={detectionResult.riskScoring.cycloneScore}
          />
        </div>

        {/* Prediction Timeline */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Prediction Timeline</h2>
          <EnhancedPredictionTimeline
            predictions={detectionResult.riskScoring.predictions}
            currentScore={detectionResult.riskScoring.overallScore}
          />
        </div>

        {/* Analytics & Charts */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Analytics & Trends</h2>
          <AnalyticsDashboard data={analyticsData} />
        </div>

        {/* System Status */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4">System Status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Total Readings</span>
              <span className="font-semibold">{readings.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Active Alerts</span>
              <span className="font-semibold">{detectionResult.activeAlert !== 'none' ? 1 : 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Risk Level</span>
              <span className={`font-semibold ${
                detectionResult.riskScoring.riskLevel === 'Critical' ? 'text-red-400' :
                detectionResult.riskScoring.riskLevel === 'High' ? 'text-orange-400' :
                detectionResult.riskScoring.riskLevel === 'Moderate' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {detectionResult.riskScoring.riskLevel}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Monitoring</span>
              <span className="font-semibold">{isMonitoring ? 'Active' : 'Paused'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
