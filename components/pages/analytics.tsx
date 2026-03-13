"use client";

import { useMemo } from "react";
import { BarChart3, PieChart, Activity, TrendingUp } from "lucide-react";
import { ScenarioData } from "@/lib/types";
import { historicalDisasters, getDisastersByYear, getDisastersByType } from "@/lib/data";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsProps {
  scenarios: ScenarioData[];
}

export function Analytics({ scenarios }: AnalyticsProps) {
  const disastersByYear = getDisastersByYear();
  const disastersByType = getDisastersByType();

  const riskDistribution = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    scenarios.forEach((s) => counts[s.riskLevel]++);
    return counts;
  }, [scenarios]);

  const priorityDistribution = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    scenarios.forEach((s) => counts[s.rescuePriority]++);
    return counts;
  }, [scenarios]);

  const chartColors = {
    blue: "rgba(59, 130, 246, 0.8)",
    teal: "rgba(20, 184, 166, 0.8)",
    amber: "rgba(245, 158, 11, 0.8)",
    red: "rgba(239, 68, 68, 0.8)",
    green: "rgba(34, 197, 94, 0.8)",
    purple: "rgba(139, 92, 246, 0.8)",
  };

  const yearChartData = {
    labels: disastersByYear.map((d) => d.year.toString()),
    datasets: [
      {
        label: "Disasters per Year",
        data: disastersByYear.map((d) => d.count),
        backgroundColor: chartColors.blue,
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const typeChartData = {
    labels: disastersByType.map((d) => d.type),
    datasets: [
      {
        data: disastersByType.map((d) => d.count),
        backgroundColor: [
          chartColors.blue,
          chartColors.teal,
          chartColors.amber,
          chartColors.red,
          chartColors.purple,
        ],
        borderWidth: 0,
      },
    ],
  };

  const riskChartData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [riskDistribution.Low, riskDistribution.Medium, riskDistribution.High],
        backgroundColor: [chartColors.green, chartColors.amber, chartColors.red],
        borderWidth: 0,
      },
    ],
  };

  const priorityChartData = {
    labels: ["Low", "Medium", "High", "Critical"],
    datasets: [
      {
        label: "Rescue Priority Distribution",
        data: [
          priorityDistribution.Low,
          priorityDistribution.Medium,
          priorityDistribution.High,
          priorityDistribution.Critical,
        ],
        backgroundColor: [
          chartColors.green,
          chartColors.blue,
          chartColors.amber,
          chartColors.red,
        ],
        borderColor: "transparent",
        borderWidth: 1,
      },
    ],
  };

  const populationImpactData = {
    labels: historicalDisasters.slice(0, 8).map((d) => d.region),
    datasets: [
      {
        label: "Population Affected (Millions)",
        data: historicalDisasters.slice(0, 8).map((d) => d.populationAffected / 1000000),
        borderColor: chartColors.teal,
        backgroundColor: "rgba(20, 184, 166, 0.2)",
        fill: true,
        tension: 0.4,
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
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(51, 65, 85, 0.5)",
        },
        ticks: {
          color: "#94a3b8",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#94a3b8",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#94a3b8",
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Historical Disaster Frequency</h3>
          </div>
          <div className="h-64">
            <Bar data={yearChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-neon-teal" />
            <h3 className="text-lg font-semibold text-white">Disaster Type Distribution</h3>
          </div>
          <div className="h-64">
            <Pie data={typeChartData} options={pieOptions} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-neon-amber" />
            <h3 className="text-lg font-semibold text-white">Risk Level Breakdown</h3>
          </div>
          {scenarios.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-slate-400">Generate scenarios to see risk distribution</p>
            </div>
          ) : (
            <div className="h-64">
              <Doughnut data={riskChartData} options={pieOptions} />
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Rescue Priority Distribution</h3>
          </div>
          {scenarios.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-slate-400">Generate scenarios to see priority distribution</p>
            </div>
          ) : (
            <div className="h-64">
              <Bar data={priorityChartData} options={chartOptions} />
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Population Impact by Region</h3>
          </div>
          <div className="h-72">
            <Line data={populationImpactData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
