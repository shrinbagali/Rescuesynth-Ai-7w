import React, { useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { EnvironmentalReading } from '../utils/disaster-detection';

interface DisasterChartsComponentProps {
  readings: EnvironmentalReading[];
}

export const DisasterChartsComponent: React.FC<DisasterChartsComponentProps> = ({ readings }) => {
  const chartData = useMemo(() => {
    return readings.slice(-12).map((reading) => ({
      time: reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      magnitude: parseFloat(reading.magnitude.toFixed(2)),
      windSpeed: Math.round(reading.windSpeed),
      pressure: Math.round(reading.atmosphericPressure),
      rainfall: parseFloat(reading.rainfall.toFixed(1)),
    }));
  }, [readings]);

  const riskData = useMemo(() => {
    return readings.slice(-6).map((reading) => {
      const earthquakeRisk = reading.magnitude > 5.5 ? (reading.magnitude - 5.5) * 10 : 0;
      const cycloneRisk = reading.windSpeed > 120 ? (reading.windSpeed - 120) / 2 : 0;
      return {
        time: reading.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        earthquake: Math.min(100, earthquakeRisk),
        cyclone: Math.min(100, cycloneRisk),
      };
    });
  }, [readings]);

  const tooltipStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: '#fff',
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Seismic Activity Chart */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <h4 className="text-sm font-semibold mb-4 text-foreground">Seismic Activity Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="time" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="magnitude"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 4 }}
                activeDot={{ r: 6 }}
                name="Magnitude"
              />
              <Line
                type="monotone"
                dataKey="pressure"
                stroke="#06b6d4"
                strokeWidth={2}
                yAxisId="right"
                name="Pressure"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Wind Speed Trend Chart */}
        <div className="p-4 rounded-lg bg-card border border-border">
          <h4 className="text-sm font-semibold mb-4 text-foreground">Wind Speed Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis dataKey="time" stroke="#888" style={{ fontSize: '12px' }} />
              <YAxis stroke="#888" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="windSpeed"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorWind)"
                name="Wind Speed (km/h)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Probability Indicator */}
      <div className="p-4 rounded-lg bg-card border border-border">
        <h4 className="text-sm font-semibold mb-4 text-foreground">Risk Probability Index</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis dataKey="time" stroke="#888" style={{ fontSize: '12px' }} />
            <YAxis stroke="#888" style={{ fontSize: '12px' }} label={{ value: 'Risk %', angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="earthquake" fill="#a855f7" name="Earthquake Risk" radius={[4, 4, 0, 0]} />
            <Bar dataKey="cyclone" fill="#06b6d4" name="Cyclone Risk" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Environmental Parameters Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Latest Magnitude</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-400 mt-2">
            {chartData.length > 0 ? chartData[chartData.length - 1].magnitude : '0.00'}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Peak Wind Speed</p>
          <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-400 mt-2">
            {chartData.length > 0 ? Math.max(...chartData.map((d) => d.windSpeed)) : '0'} km/h
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Min Pressure</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-2">
            {chartData.length > 0 ? Math.min(...chartData.map((d) => d.pressure)) : '1013'} hPa
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20 border border-teal-200 dark:border-teal-800">
          <p className="text-xs text-muted-foreground font-semibold uppercase">Max Rainfall</p>
          <p className="text-2xl font-bold text-teal-700 dark:text-teal-400 mt-2">
            {chartData.length > 0 ? Math.max(...chartData.map((d) => d.rainfall)) : '0'} mm
          </p>
        </div>
      </div>
    </div>
  );
};
