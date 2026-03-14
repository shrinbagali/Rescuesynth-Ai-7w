import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  time: string;
  seismic: number;
  wind: number;
  risk: number;
  count: number;
}

interface AnalyticsDashboardProps {
  data: DataPoint[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  const displayData = useMemo(() => {
    return data.slice(-12); // Show last 12 data points
  }, [data]);

  const stats = useMemo(() => {
    const avgRisk = (displayData.reduce((sum, d) => sum + d.risk, 0) / displayData.length).toFixed(1);
    const maxRisk = Math.max(...displayData.map(d => d.risk)).toFixed(1);
    const avgWind = (displayData.reduce((sum, d) => sum + d.wind, 0) / displayData.length).toFixed(1);
    const totalEvents = displayData.reduce((sum, d) => sum + d.count, 0);

    return { avgRisk, maxRisk, avgWind, totalEvents };
  }, [displayData]);

  return (
    <div className="w-full space-y-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Analytics Dashboard</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">Avg Risk Score</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.avgRisk}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="text-xs font-semibold text-red-900 dark:text-red-300 mb-1">Max Risk Score</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.maxRisk}</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
          <div className="text-xs font-semibold text-cyan-900 dark:text-cyan-300 mb-1">Avg Wind Speed</div>
          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.avgWind} km/h</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">Total Events</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalEvents}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Seismic Activity Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Seismic Activity Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
              <Line
                type="monotone"
                dataKey="seismic"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Wind Speed Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Wind Speed Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={displayData}>
              <defs>
                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
              <Area
                type="monotone"
                dataKey="wind"
                stroke="#06b6d4"
                fillOpacity={1}
                fill="url(#colorWind)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Score Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Overall Risk Score Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Disaster Frequency */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Detected Events by Time</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#f3f4f6',
                }}
              />
              <Bar
                dataKey="count"
                fill="#f59e0b"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
