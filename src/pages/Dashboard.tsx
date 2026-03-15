import { Activity, MapPin, AlertTriangle, Brain, TrendingUp, Users, Zap, Shield, Image } from 'lucide-react';
import { ScenarioData, AIInsight, TrainingMetrics, ImageAnalysisResult } from '../types';
import { historicalDisasters, getTotalPopulationAffected } from '../data/historicalDisasters';

interface DashboardProps {
  scenarios: ScenarioData[];
  insights: AIInsight[];
  trainingMetrics: TrainingMetrics | null;
  historyCount: number;
  imageAnalysisHistory?: ImageAnalysisResult[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
  glowClass: string;
}

function StatCard({ title, value, subtitle, icon, colorClass, glowClass }: StatCardProps) {
  return (
    <div className={`glow-card ${glowClass} p-6 animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{value}</p>
          <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClass.replace('text-', 'bg-')}/20`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ scenarios, insights, trainingMetrics, historyCount, imageAnalysisHistory = [] }: DashboardProps) {
  const highRiskCount = scenarios.filter(s => s.riskLevel === 'High').length;
  const totalPopulationAffected = getTotalPopulationAffected();
  const highConfidenceAnalyses = imageAnalysisHistory.filter(a => a.overallConfidence > 70).length;
  
  const stats = [
    {
      title: 'Total Scenarios Generated',
      value: scenarios.length || 0,
      subtitle: `${historyCount} generation sessions`,
      icon: <Zap size={24} className="text-neon-blue" />,
      colorClass: 'text-neon-blue',
      glowClass: '',
    },
    {
      title: 'Regions Analyzed',
      value: historicalDisasters.length,
      subtitle: '8 active monitoring zones',
      icon: <MapPin size={24} className="text-neon-teal" />,
      colorClass: 'text-neon-teal',
      glowClass: 'glow-card-teal',
    },
    {
      title: 'High Risk Zones',
      value: highRiskCount || historicalDisasters.filter(d => d.damageLevel > 75).length,
      subtitle: 'Requiring immediate attention',
      icon: <AlertTriangle size={24} className="text-neon-amber" />,
      colorClass: 'text-neon-amber',
      glowClass: 'glow-card-amber',
    },
    {
      title: 'AI Model Accuracy',
      value: trainingMetrics ? `${trainingMetrics.accuracy.toFixed(1)}%` : '92.4%',
      subtitle: 'Based on historical data',
      icon: <Brain size={24} className="text-neon-blue" />,
      colorClass: 'text-neon-blue',
      glowClass: '',
    },
    {
      title: 'Image Analyses Performed',
      value: imageAnalysisHistory.length || 0,
      subtitle: `${highConfidenceAnalyses} high-confidence detections`,
      icon: <Image size={24} className="text-neon-teal" />,
      colorClass: 'text-neon-teal',
      glowClass: 'glow-card-teal',
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* TOP ROW: Overview Cards (4 cards in one row) */}
        <div className="space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-slate-400 text-sm">Real-time monitoring and analytics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Alerts Card */}
          <div className="glow-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Alerts</p>
                <p className="text-3xl font-bold mt-2 text-neon-red">
                  {scenarios.filter(s => s.riskLevel === 'High').length}
                </p>
                <p className="text-slate-500 text-sm mt-1">Requiring attention</p>
              </div>
              <div className="p-3 rounded-lg bg-neon-red/20">
                <AlertTriangle size={24} className="text-neon-red" />
              </div>
            </div>
          </div>

          {/* Risk Score Card */}
          <div className="glow-card p-6 glow-card-amber">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Risk Score</p>
                <p className="text-3xl font-bold mt-2 text-neon-amber">
                  {(historicalDisasters.reduce((a, b) => a + b.damageLevel, 0) / historicalDisasters.length).toFixed(0)}%
                </p>
                <p className="text-slate-500 text-sm mt-1">Average level</p>
              </div>
              <div className="p-3 rounded-lg bg-neon-amber/20">
                <Zap size={24} className="text-neon-amber" />
              </div>
            </div>
          </div>

          {/* Regions Monitored Card */}
          <div className="glow-card p-6 glow-card-teal">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Regions Monitored</p>
                <p className="text-3xl font-bold mt-2 text-neon-teal">
                  {historicalDisasters.length}
                </p>
                <p className="text-slate-500 text-sm mt-1">Active zones</p>
              </div>
              <div className="p-3 rounded-lg bg-neon-teal/20">
                <MapPin size={24} className="text-neon-teal" />
              </div>
            </div>
          </div>

          {/* Detection Status Card */}
          <div className="glow-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Detection Status</p>
                <p className="text-3xl font-bold mt-2 text-green-400">
                  {trainingMetrics ? `${trainingMetrics.accuracy.toFixed(0)}%` : '92%'}
                </p>
                <p className="text-slate-500 text-sm mt-1">Accuracy rate</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <Shield size={24} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* SECOND ROW: Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generate Scenario Module (Left) */}
          <div className="glow-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap size={24} className="text-neon-blue" />
              <h3 className="text-xl font-semibold text-white">Scenario Generator</h3>
            </div>
            <div className="space-y-3 h-64 flex flex-col justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-4">Total Scenarios Generated</p>
                <p className="text-4xl font-bold text-neon-blue">{scenarios.length}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Generation Sessions</p>
                <p className="text-slate-300 text-lg">{historyCount} sessions</p>
              </div>
              <button className="w-full px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-lg border border-neon-blue/30 hover:bg-neon-blue/30 transition-colors font-medium">
                Generate New Scenario
              </button>
            </div>
          </div>

          {/* Dual Disaster Detection Module (Right) */}
          <div className="glow-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Brain size={24} className="text-neon-teal" />
              <h3 className="text-xl font-semibold text-white">Detection Module</h3>
            </div>
            <div className="space-y-3 h-64 flex flex-col justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-4">High Confidence Detections</p>
                <p className="text-4xl font-bold text-neon-teal">{imageAnalysisHistory.filter(a => a.overallConfidence > 70).length}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-2">Total Analyses</p>
                <p className="text-slate-300 text-lg">{imageAnalysisHistory.length} performed</p>
              </div>
              <button className="w-full px-4 py-2 bg-neon-teal/20 text-neon-teal rounded-lg border border-neon-teal/30 hover:bg-neon-teal/30 transition-colors font-medium">
                View Full Analysis
              </button>
            </div>
          </div>
        </div>

        {/* THIRD ROW: Global Disaster Map (Full Width) */}
        <div className="glow-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={24} className="text-neon-red" />
            <h3 className="text-xl font-semibold text-white">Recent Disaster Events</h3>
          </div>
          <div className="space-y-4">
            {historicalDisasters.slice(0, 4).map((disaster) => (
              <div 
                key={disaster.id} 
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    disaster.damageLevel > 80 ? 'bg-neon-red/20' : 
                    disaster.damageLevel > 60 ? 'bg-neon-amber/20' : 'bg-neon-teal/20'
                  }`}>
                    <Activity size={20} className={
                      disaster.damageLevel > 80 ? 'text-neon-red' : 
                      disaster.damageLevel > 60 ? 'text-neon-amber' : 'text-neon-teal'
                    } />
                  </div>
                  <div>
                    <p className="font-medium text-white">{disaster.region} {disaster.disasterType}</p>
                    <p className="text-sm text-slate-400">{disaster.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{(disaster.populationAffected / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-slate-400">Affected</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  disaster.damageLevel > 80 ? 'bg-neon-red/20 text-neon-red' : 
                  disaster.damageLevel > 60 ? 'bg-neon-amber/20 text-neon-amber' : 'bg-green-500/20 text-green-400'
                }`}>
                  {disaster.damageLevel > 80 ? 'Severe' : disaster.damageLevel > 60 ? 'Moderate' : 'Low'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOURTH ROW: Analytics Charts (Two Column Layout) */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Analytics & Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1 */}
            <div className="glow-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={24} className="text-neon-amber" />
                <h3 className="text-lg font-semibold text-white">Risk Assessment</h3>
              </div>
              <div className="h-64 bg-slate-800/30 rounded-lg flex items-center justify-center">
                <p className="text-slate-400 text-center">
                  Average Damage Level: {(historicalDisasters.reduce((a, b) => a + b.damageLevel, 0) / historicalDisasters.length).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Chart 2 */}
            <div className="glow-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Users size={24} className="text-neon-teal" />
                <h3 className="text-lg font-semibold text-white">Population Impact</h3>
              </div>
              <div className="h-64 bg-slate-800/30 rounded-lg flex items-center justify-center">
                <p className="text-slate-400 text-center">
                  Total Affected: {(totalPopulationAffected / 1000000).toFixed(1)}M people
                </p>
              </div>
            </div>

            {/* AI Insights */}
            <div className="lg:col-span-2 glow-card p-6">
              <div className="flex items-center gap-2 mb-6">
                <Shield size={24} className="text-neon-blue" />
                <h3 className="text-lg font-semibold text-white">AI Insights</h3>
              </div>
              {insights.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.slice(0, 4).map((insight) => (
                    <div 
                      key={insight.id}
                      className={`p-4 rounded-lg border animate-fade-in ${
                        insight.type === 'critical' ? 'bg-neon-red/10 border-neon-red/30' :
                        insight.type === 'warning' ? 'bg-neon-amber/10 border-neon-amber/30' :
                        'bg-neon-blue/10 border-neon-blue/30'
                      }`}
                    >
                      <p className={`text-sm ${
                        insight.type === 'critical' ? 'text-neon-red' :
                        insight.type === 'warning' ? 'text-neon-amber' :
                        'text-neon-blue'
                      }`}>
                        {insight.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Brain size={48} className="text-slate-600 mb-4" />
                  <p className="text-slate-400">Generate scenarios to see AI insights</p>
                  <p className="text-sm text-slate-500 mt-2">Navigate to Generate Scenario to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
