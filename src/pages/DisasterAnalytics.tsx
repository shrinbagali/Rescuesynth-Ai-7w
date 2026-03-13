import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import { ScenarioData } from '../types';
import { historicalDisasters, getDisastersByYear, getDisastersByType } from '../data/historicalDisasters';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

interface DisasterAnalyticsProps {
  scenarios: ScenarioData[];
}

export default function DisasterAnalytics({ scenarios }: DisasterAnalyticsProps) {
  const disastersByYear = getDisastersByYear();
  const disastersByType = getDisastersByType();

  const riskDistribution = {
    Low: scenarios.filter(s => s.riskLevel === 'Low').length || 15,
    Medium: scenarios.filter(s => s.riskLevel === 'Medium').length || 25,
    High: scenarios.filter(s => s.riskLevel === 'High').length || 10,
  };

  const priorityDistribution = {
    Low: scenarios.filter(s => s.rescuePriority === 'Low').length || 10,
    Medium: scenarios.filter(s => s.rescuePriority === 'Medium').length || 20,
    High: scenarios.filter(s => s.rescuePriority === 'High').length || 15,
    Critical: scenarios.filter(s => s.rescuePriority === 'Critical').length || 5,
  };

  const chartColors = {
    blue: 'rgba(59, 130, 246, 0.8)',
    teal: 'rgba(20, 184, 166, 0.8)',
    amber: 'rgba(245, 158, 11, 0.8)',
    red: 'rgba(239, 68, 68, 0.8)',
    purple: 'rgba(139, 92, 246, 0.8)',
    green: 'rgba(34, 197, 94, 0.8)',
  };

  const yearlyDisasterData = {
    labels: disastersByYear.map(d => d.year.toString()),
    datasets: [
      {
        label: 'Disaster Events',
        data: disastersByYear.map(d => d.count),
        backgroundColor: chartColors.blue,
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const disasterTypeData = {
    labels: disastersByType.map(d => d.type),
    datasets: [
      {
        data: disastersByType.map(d => d.count),
        backgroundColor: [
          chartColors.blue,
          chartColors.teal,
          chartColors.amber,
          chartColors.red,
          chartColors.purple,
        ],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };

  const riskLevelData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [riskDistribution.Low, riskDistribution.Medium, riskDistribution.High],
        backgroundColor: [chartColors.green, chartColors.amber, chartColors.red],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };

  const populationImpactData = {
    labels: historicalDisasters.slice(0, 8).map(d => `${d.region} ${d.year}`),
    datasets: [
      {
        label: 'Population Affected (Millions)',
        data: historicalDisasters.slice(0, 8).map(d => d.populationAffected / 1000000),
        backgroundColor: chartColors.teal,
        borderColor: 'rgba(20, 184, 166, 1)',
        borderWidth: 1,
      },
    ],
  };

  const severityTrendData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        label: 'Average Damage Level',
        data: [85, 78, 82, 75, 79, 74],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: chartColors.blue,
        tension: 0.4,
      },
      {
        label: 'Average Rainfall (100mm)',
        data: [23, 18, 21, 15, 19, 17],
        fill: true,
        backgroundColor: 'rgba(20, 184, 166, 0.2)',
        borderColor: chartColors.teal,
        tension: 0.4,
      },
    ],
  };

  const rescuePriorityData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Scenarios by Priority',
        data: [priorityDistribution.Low, priorityDistribution.Medium, priorityDistribution.High, priorityDistribution.Critical],
        backgroundColor: [
          'rgba(100, 116, 139, 0.8)',
          chartColors.blue,
          chartColors.amber,
          chartColors.red,
        ],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          padding: 15,
          usePointStyle: true,
        },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#94a3b8',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glow-card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Historical Disaster Frequency</h3>
          </div>
          <div className="h-64">
            <Bar data={yearlyDisasterData} options={chartOptions} />
          </div>
        </div>

        <div className="glow-card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-neon-teal" />
            <h3 className="text-lg font-semibold text-white">Disaster Type Distribution</h3>
          </div>
          <div className="h-64">
            <Pie data={disasterTypeData} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glow-card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={20} className="text-neon-amber" />
            <h3 className="text-lg font-semibold text-white">Risk Level Breakdown</h3>
          </div>
          <div className="h-56">
            <Doughnut data={riskLevelData} options={pieOptions} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-green-400 text-xl font-bold">{riskDistribution.Low}</p>
              <p className="text-slate-400 text-xs">Low</p>
            </div>
            <div>
              <p className="text-neon-amber text-xl font-bold">{riskDistribution.Medium}</p>
              <p className="text-slate-400 text-xs">Medium</p>
            </div>
            <div>
              <p className="text-neon-red text-xl font-bold">{riskDistribution.High}</p>
              <p className="text-slate-400 text-xs">High</p>
            </div>
          </div>
        </div>

        <div className="glow-card p-6 animate-fade-in lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Severity Trends Over Time</h3>
          </div>
          <div className="h-64">
            <Line data={severityTrendData} options={lineOptions} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glow-card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-neon-teal" />
            <h3 className="text-lg font-semibold text-white">Population Impact by Disaster</h3>
          </div>
          <div className="h-64">
            <Bar 
              data={populationImpactData} 
              options={{
                ...chartOptions,
                indexAxis: 'y' as const,
              }} 
            />
          </div>
        </div>

        <div className="glow-card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-neon-red" />
            <h3 className="text-lg font-semibold text-white">Rescue Priority Distribution</h3>
          </div>
          <div className="h-64">
            <Doughnut data={rescuePriorityData} options={pieOptions} />
          </div>
        </div>
      </div>

      <div className="glow-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Analytics Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-neon-blue">{historicalDisasters.length}</p>
            <p className="text-slate-400 text-sm mt-1">Total Historical Events</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-neon-teal">
              {(historicalDisasters.reduce((a, b) => a + b.populationAffected, 0) / 1000000).toFixed(1)}M
            </p>
            <p className="text-slate-400 text-sm mt-1">Total Population Affected</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-neon-amber">
              {(historicalDisasters.reduce((a, b) => a + b.damageLevel, 0) / historicalDisasters.length).toFixed(1)}%
            </p>
            <p className="text-slate-400 text-sm mt-1">Avg Damage Level</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-neon-red">
              {historicalDisasters.filter(d => d.damageLevel > 80).length}
            </p>
            <p className="text-slate-400 text-sm mt-1">Severe Events</p>
          </div>
        </div>
      </div>
    </div>
  );
}
