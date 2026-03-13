import { useState, useEffect } from 'react';
import { Brain, Play, CheckCircle, Loader2, BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ScenarioData, TrainingMetrics } from '../types';
import { simulateTraining } from '../utils/scenarioGenerator';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AITrainingProps {
  scenarios: ScenarioData[];
  onTrainingComplete: (metrics: TrainingMetrics) => void;
  trainingMetrics: TrainingMetrics | null;
}

export default function AITraining({ scenarios, onTrainingComplete, trainingMetrics }: AITrainingProps) {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStage, setTrainingStage] = useState('');

  const stages = [
    'Initializing model...',
    'Loading dataset...',
    'Preprocessing features...',
    'Training neural network...',
    'Validating model...',
    'Optimizing parameters...',
    'Finalizing model...',
  ];

  const startTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    for (let i = 0; i < stages.length; i++) {
      setTrainingStage(stages[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setTrainingProgress(((i + 1) / stages.length) * 100);
    }
    
    const metrics = await simulateTraining();
    onTrainingComplete(metrics);
    setIsTraining(false);
    setTrainingStage('Training complete!');
  };

  const featureImportanceData = trainingMetrics ? {
    labels: trainingMetrics.featureImportance.map(f => f.feature),
    datasets: [
      {
        label: 'Feature Importance (%)',
        data: trainingMetrics.featureImportance.map(f => f.importance),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  const metricsDonutData = trainingMetrics ? {
    labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score'],
    datasets: [
      {
        data: [
          trainingMetrics.accuracy,
          trainingMetrics.precision,
          trainingMetrics.recall,
          trainingMetrics.f1Score,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  } : null;

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

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#94a3b8',
          padding: 20,
        },
      },
    },
  };

  if (scenarios.length === 0) {
    return (
      <div className="glow-card p-12 text-center">
        <Brain size={64} className="mx-auto text-slate-600 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Training Data Available</h3>
        <p className="text-slate-400 mb-4">Generate scenarios first to train the AI model</p>
        <p className="text-sm text-slate-500">Navigate to "Generate Scenario" to create training data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Brain size={24} className="text-neon-blue" />
            <div>
              <h3 className="text-lg font-semibold text-white">AI Model Training</h3>
              <p className="text-sm text-slate-400">
                Training on {scenarios.length} scenario records
              </p>
            </div>
          </div>
          
          <button
            onClick={startTraining}
            disabled={isTraining}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {isTraining ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Play size={20} />
                Start Training
              </>
            )}
          </button>
        </div>

        {(isTraining || trainingMetrics) && (
          <div className="space-y-4">
            <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-gradient-to-r from-neon-blue to-neon-teal transition-all duration-300 rounded-full"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">{trainingStage}</span>
              <span className="text-neon-blue font-medium">{Math.round(trainingProgress)}%</span>
            </div>
          </div>
        )}
      </div>

      {trainingMetrics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glow-card p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-neon-blue/20 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-neon-blue">
                  {trainingMetrics.accuracy.toFixed(1)}%
                </span>
              </div>
              <p className="text-slate-400">Accuracy</p>
            </div>
            
            <div className="glow-card p-6 text-center glow-card-teal">
              <div className="w-16 h-16 mx-auto rounded-full bg-neon-teal/20 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-neon-teal">
                  {trainingMetrics.precision.toFixed(1)}%
                </span>
              </div>
              <p className="text-slate-400">Precision</p>
            </div>
            
            <div className="glow-card p-6 text-center glow-card-amber">
              <div className="w-16 h-16 mx-auto rounded-full bg-neon-amber/20 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-neon-amber">
                  {trainingMetrics.recall.toFixed(1)}%
                </span>
              </div>
              <p className="text-slate-400">Recall</p>
            </div>
            
            <div className="glow-card p-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-neon-purple/20 flex items-center justify-center mb-3">
                <span className="text-2xl font-bold text-neon-purple">
                  {trainingMetrics.f1Score.toFixed(1)}%
                </span>
              </div>
              <p className="text-slate-400">F1 Score</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glow-card p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 size={20} className="text-neon-blue" />
                <h3 className="text-lg font-semibold text-white">Feature Importance</h3>
              </div>
              <div className="h-64">
                {featureImportanceData && (
                  <Bar data={featureImportanceData} options={chartOptions} />
                )}
              </div>
            </div>
            
            <div className="glow-card p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle size={20} className="text-neon-teal" />
                <h3 className="text-lg font-semibold text-white">Model Metrics</h3>
              </div>
              <div className="h-64">
                {metricsDonutData && (
                  <Doughnut data={metricsDonutData} options={donutOptions} />
                )}
              </div>
            </div>
          </div>

          <div className="glow-card p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">Model Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-neon-blue font-medium mb-2">Primary Risk Factors</p>
                <p className="text-slate-400 text-sm">
                  Rainfall level and infrastructure damage are the strongest predictors of 
                  rescue priority, accounting for over 50% of the model's decision weight.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-neon-teal font-medium mb-2">Model Performance</p>
                <p className="text-slate-400 text-sm">
                  The model achieves {trainingMetrics.accuracy.toFixed(1)}% accuracy on validation data,
                  with balanced precision-recall trade-off suitable for emergency response planning.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-neon-amber font-medium mb-2">Population Impact</p>
                <p className="text-slate-400 text-sm">
                  Population density contributes {trainingMetrics.featureImportance[1]?.importance.toFixed(1)}% 
                  to predictions, crucial for resource allocation in dense urban areas.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-neon-purple font-medium mb-2">Historical Patterns</p>
                <p className="text-slate-400 text-sm">
                  Historical disaster data improves prediction accuracy by incorporating 
                  regional vulnerability patterns and seasonal trends.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
