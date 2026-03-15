import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, Download, Zap, Wind, Moon, Sun, Bell } from 'lucide-react';
import { EnvironmentalReading, memoizedDetect, DualDetectionResult } from '../utils/disaster-detection';
import { Notification, createNotification, RISK_THRESHOLDS, getNotificationType } from '../utils/notifications';
import { RealTimeMonitoringDual } from '../components/RealTimeMonitoringDual';
import { DualDetectionDisplay } from '../components/DualDetectionDisplay';
import { DisasterChartsComponent } from '../components/DisasterChartsComponent';
import { DisasterMapComponent } from '../components/DisasterMapComponent';
import { RiskScoreMeter } from '../components/RiskScoreMeter';
import { EnhancedPredictionTimeline } from '../components/EnhancedPredictionTimeline';
import { EnhancedAlertPanel } from '../components/EnhancedAlertPanel';
import { EnhancedDisasterMap } from '../components/EnhancedDisasterMap';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { NotificationPanel } from '../components/NotificationPanel';

// Initialize with default reading and detection result
const getInitialReading = (): EnvironmentalReading => ({
  magnitude: 4.5,
  groundAcceleration: 50,
  epicenterDepth: 50,
  windSpeed: 30,
  atmosphericPressure: 1013,
  rainfall: 0,
  humidity: 60,
  temperature: 20,
  timestamp: new Date(),
});

export default function DualDisasterDetection() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [readings, setReadings] = useState<EnvironmentalReading[]>([getInitialReading()]);
  const [currentReading, setCurrentReading] = useState<EnvironmentalReading>(getInitialReading());
  const [detectionResult, setDetectionResult] = useState<DualDetectionResult | null>(() => memoizedDetect(getInitialReading()));
  const [testMode, setTestMode] = useState<'normal' | 'earthquake' | 'cyclone' | 'both' | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [lastNotificationScore, setLastNotificationScore] = useState<number>(0);

  // Add notification handler first (before useEffect)
  const handleAddNotification = useCallback((notif: Notification) => {
    setNotifications((prev) => [notif, ...prev.slice(0, 19)]);
  }, []);

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

  // Monitor updates every 8 seconds (or faster in simulation mode)
  useEffect(() => {
    if (!isMonitoring && !isSimulating) return;

    const interval = setInterval(() => {
      const newReading = generateEnvironmentalReading();
      setCurrentReading(newReading);
      setReadings((prev) => [...prev.slice(-99), newReading]); // Keep last 100 readings
      
      // Run detection
      const result = memoizedDetect(newReading);
      setDetectionResult(result);

      // Check for notification triggers
      const riskScore = result.riskScoring.overallScore;
      const crossedThreshold =
        (lastNotificationScore < RISK_THRESHOLDS.CRITICAL && riskScore >= RISK_THRESHOLDS.CRITICAL) ||
        (lastNotificationScore < RISK_THRESHOLDS.HIGH && riskScore >= RISK_THRESHOLDS.HIGH && lastNotificationScore < RISK_THRESHOLDS.CRITICAL);

      if (crossedThreshold) {
        const disasterType = result.activeAlert === 'earthquake' ? 'Earthquake' : result.activeAlert === 'cyclone' ? 'Cyclone' : 'Dual Event';
        const notifType = getNotificationType(riskScore);
        const message = `Risk score reached ${riskScore.toFixed(0)} - ${result.riskScoring.riskLevel}`;
        
        const notif = createNotification(
          `${disasterType} Alert`,
          message,
          notifType,
          disasterType,
          'Global',
          result.riskScoring.riskLevel
        );
        handleAddNotification(notif);
        setLastNotificationScore(riskScore);
      }
    }, isSimulating ? 2000 : 8000); // Faster updates in simulation mode

    // Initial reading
    const initialReading = generateEnvironmentalReading();
    setCurrentReading(initialReading);
    setReadings([initialReading]);
    const initialResult = memoizedDetect(initialReading);
    setDetectionResult(initialResult);

    return () => clearInterval(interval);
  }, [isMonitoring, isSimulating, testMode, generateEnvironmentalReading, lastNotificationScore, handleAddNotification]);

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleReset = () => {
    setReadings([]);
    setCurrentReading(null);
    setDetectionResult(null);
    setTestMode(null);
    setDismissedAlerts(new Set());
    setNotifications([]);
    setIsMonitoring(false);
    setIsSimulating(false);
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



  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 text-white min-h-screen">
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header with Theme Toggle and Notification Bell */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">AI Disaster Command Platform</h1>
            <p className="text-gray-400">Real-time earthquake and cyclone monitoring with predictive AI analysis</p>
          </div>
          <div className="flex gap-2">
            <button
              className="relative p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              title="Notifications"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {notifications.length > 9 ? '9+' : notifications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  isSimulating
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-violet-600 text-white hover:bg-violet-700'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Pause size={18} />
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Start Simulation
                  </>
                )}
              </button>

              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                {isMonitoring ? (
                  <>
                    <Pause size={18} />
                    Pause Monitoring
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Resume Monitoring
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
        {!dismissedAlerts.has('alerts') && detectionResult && detectionResult.activeAlert !== 'none' && (
          <div className="bg-red-900/20 border-2 border-red-800 rounded-lg p-4">
            <EnhancedAlertPanel
              detectionResult={detectionResult}
              onDismiss={handleDismissAlert}
            />
          </div>
        )}

        {/* Dual Disaster Detection Module */}
        <div className="space-y-6">
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

        {/* Notification Panel */}
        {notifications.length > 0 && (
          <NotificationPanel
            notifications={notifications}
            onDismiss={handleDismissNotification}
            onClearAll={handleClearAllNotifications}
            unreadCount={notifications.filter((n) => !n.read).length}
          />
        )}
      </div>
    </div>
  );
}
