import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Download, Zap, Wind } from 'lucide-react';
import { EnvironmentalReading, memoizedDetect, DualDetectionResult } from '../../lib/disaster-detection';
import { RealTimeMonitoringDual } from '../components/RealTimeMonitoringDual';
import { DualDetectionDisplay } from '../components/DualDetectionDisplay';
import { DisasterChartsComponent } from '../components/DisasterChartsComponent';
import { DisasterMapComponent } from '../components/DisasterMapComponent';

export default function DualDisasterDetection() {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [readings, setReadings] = useState<EnvironmentalReading[]>([]);
  const [currentReading, setCurrentReading] = useState<EnvironmentalReading | null>(null);
  const [detectionResult, setDetectionResult] = useState<DualDetectionResult | null>(null);
  const [testMode, setTestMode] = useState<'normal' | 'earthquake' | 'cyclone' | 'both' | null>(null);

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

  if (!currentReading || !detectionResult) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Initializing monitoring system...</p>
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-primary/20 rounded-lg mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Controls */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dual Disaster Detection</h1>
        <p className="text-muted-foreground">Real-time earthquake and cyclone monitoring with AI-powered analysis</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            {isMonitoring ? (
              <>
                <Pause className="w-4 h-4" />
                Pause Monitoring
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Resume Monitoring
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          <button
            onClick={handleDownload}
            disabled={readings.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setTestMode(testMode === 'earthquake' ? null : 'earthquake')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                testMode === 'earthquake'
                  ? 'bg-purple-500 text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <Zap className="w-4 h-4" />
              Earthquake Test
            </button>

            <button
              onClick={() => setTestMode(testMode === 'cyclone' ? null : 'cyclone')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                testMode === 'cyclone'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
            >
              <Wind className="w-4 h-4" />
              Cyclone Test
            </button>

            {(testMode === 'earthquake' || testMode === 'cyclone') && (
              <button
                onClick={() => setTestMode('both')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  testMode === 'both'
                    ? 'bg-red-500 text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Both Disasters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Monitoring */}
      <section>
        <RealTimeMonitoringDual reading={currentReading} isMonitoring={isMonitoring} />
      </section>

      {/* Dual Detection Display */}
      <section>
        <DualDetectionDisplay detectionResult={detectionResult} />
      </section>

      {/* Charts and Visualizations */}
      <section>
        <DisasterChartsComponent readings={readings} />
      </section>

      {/* Disaster Map */}
      <section>
        <DisasterMapComponent detectionResult={detectionResult} />
      </section>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4 p-4 rounded-lg bg-gradient-to-r from-muted to-muted/50 border border-border">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase">Readings Collected</p>
          <p className="text-3xl font-bold text-foreground mt-2">{readings.length}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase">Duration</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {Math.floor((readings.length - 1) * 8 / 60)}m {((readings.length - 1) * 8) % 60}s
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase">Earthquakes Detected</p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
            {readings.filter((r) => memoizedDetect(r).earthquake.detected).length}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase">Cyclones Detected</p>
          <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">
            {readings.filter((r) => memoizedDetect(r).cyclone.detected).length}
          </p>
        </div>
      </div>
    </div>
  );
}
