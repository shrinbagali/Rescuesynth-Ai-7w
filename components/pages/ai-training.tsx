"use client";

import { useState, useEffect } from "react";
import { Brain, Play, CheckCircle, TrendingUp, BarChart } from "lucide-react";
import { ScenarioData, TrainingMetrics } from "@/lib/types";
import { simulateTraining } from "@/lib/scenario";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AITrainingProps {
  scenarios: ScenarioData[];
}

export function AITraining({ scenarios }: AITrainingProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [trainingComplete, setTrainingComplete] = useState(false);

  const startTraining = async () => {
    setIsTraining(true);
    setProgress(0);
    setTrainingComplete(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    const results = await simulateTraining();
    clearInterval(interval);
    setProgress(100);
    setMetrics(results);
    setIsTraining(false);
    setTrainingComplete(true);
  };

  const chartData = metrics
    ? {
        labels: metrics.featureImportance.map((f) => f.feature),
        datasets: [
          {
            label: "Feature Importance (%)",
            data: metrics.featureImportance.map((f) => f.importance),
            backgroundColor: [
              "rgba(59, 130, 246, 0.8)",
              "rgba(20, 184, 166, 0.8)",
              "rgba(245, 158, 11, 0.8)",
              "rgba(34, 197, 94, 0.8)",
              "rgba(139, 92, 246, 0.8)",
            ],
            borderColor: [
              "rgba(59, 130, 246, 1)",
              "rgba(20, 184, 166, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(34, 197, 94, 1)",
              "rgba(139, 92, 246, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

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
        max: 40,
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
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-neon-blue" />
              <div>
                <h3 className="text-lg font-semibold text-white">AI Model Training</h3>
                <p className="text-sm text-slate-400">Train rescue priority prediction model</p>
              </div>
            </div>
            <button
              onClick={startTraining}
              disabled={isTraining || scenarios.length === 0}
              className="btn-ripple px-6 py-2.5 bg-gradient-to-r from-neon-blue to-neon-teal text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
            >
              {isTraining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Training...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Training
                </>
              )}
            </button>
          </div>

          {scenarios.length === 0 && (
            <div className="p-8 text-center bg-background rounded-lg border border-border">
              <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Generate scenarios first to train the AI model.</p>
            </div>
          )}

          {(isTraining || trainingComplete) && (
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Training Progress</span>
                  <span className="text-sm text-white font-medium">{Math.min(100, Math.round(progress))}%</span>
                </div>
                <div className="h-3 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-neon-blue to-neon-teal transition-all duration-300"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>

              {trainingComplete && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Training Complete!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Accuracy", value: metrics.accuracy, color: "neon-blue" },
                { label: "Precision", value: metrics.precision, color: "neon-teal" },
                { label: "Recall", value: metrics.recall, color: "neon-amber" },
                { label: "F1 Score", value: metrics.f1Score, color: "green-500" },
              ].map((metric, index) => (
                <div
                  key={metric.label}
                  className="bg-card rounded-xl p-4 border border-border animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">{metric.label}</span>
                    <TrendingUp className={`w-4 h-4 text-${metric.color}`} />
                  </div>
                  <p className="text-2xl font-bold text-white">{metric.value.toFixed(1)}%</p>
                </div>
              ))}
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="w-5 h-5 text-neon-blue" />
                <h3 className="text-lg font-semibold text-white">Feature Importance</h3>
              </div>
              <div className="h-80">
                {chartData && <Bar data={chartData} options={chartOptions} />}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-white mb-4">Model Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neon-blue/10 rounded-lg border border-neon-blue/30">
                  <p className="text-sm text-slate-300">
                    <span className="text-neon-blue font-medium">Rainfall Level</span> is the most significant predictor
                    of disaster risk, accounting for approximately {metrics.featureImportance[0]?.importance.toFixed(1)}%
                    of the model{"'"}s decision-making.
                  </p>
                </div>
                <div className="p-4 bg-neon-teal/10 rounded-lg border border-neon-teal/30">
                  <p className="text-sm text-slate-300">
                    <span className="text-neon-teal font-medium">Infrastructure Damage</span> combined with population
                    density creates a multiplier effect on rescue priority calculations.
                  </p>
                </div>
                <div className="p-4 bg-neon-amber/10 rounded-lg border border-neon-amber/30">
                  <p className="text-sm text-slate-300">
                    The model achieved <span className="text-neon-amber font-medium">{metrics.accuracy.toFixed(1)}%
                    accuracy</span> on validation data, indicating strong predictive capability.
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm text-slate-300">
                    <span className="text-green-400 font-medium">Historical patterns</span> provide baseline context,
                    improving predictions for recurring disaster types in specific regions.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
