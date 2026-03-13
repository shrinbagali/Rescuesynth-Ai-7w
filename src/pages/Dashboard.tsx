import { Activity, MapPin, AlertTriangle, Brain, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import { ScenarioData, AIInsight, TrainingMetrics } from '../types';
import { historicalDisasters, getTotalPopulationAffected } from '../data/historicalDisasters';

interface DashboardProps {
  scenarios: ScenarioData[];
  insights: AIInsight[];
  trainingMetrics: TrainingMetrics | null;
  historyCount: number;
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

export default function Dashboard({ scenarios, insights, trainingMetrics, historyCount }: DashboardProps) {
  const highRiskCount = scenarios.filter(s => s.riskLevel === 'High').length;
  const totalPopulationAffected = getTotalPopulationAffected();
  
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
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Disaster Events</h3>
            <span className="text-sm text-slate-400">Last 5 years</span>
          </div>
          <div className="space-y-4">
            {historicalDisasters.slice(0, 5).map((disaster) => (
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

        <div className="glow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">AI Insights</h3>
            <Shield size={20} className="text-neon-blue" />
          </div>
          {insights.length > 0 ? (
            <div className="space-y-4">
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
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Brain size={48} className="text-slate-600 mb-4" />
              <p className="text-slate-400">Generate scenarios to see AI insights</p>
              <p className="text-sm text-slate-500 mt-2">Navigate to Generate Scenario to begin</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glow-card p-6 glow-card-teal">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-teal/20 rounded-lg">
              <Users size={24} className="text-neon-teal" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Population Affected</p>
              <p className="text-2xl font-bold text-white">
                {(totalPopulationAffected / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>
        
        <div className="glow-card p-6 glow-card-amber">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-amber/20 rounded-lg">
              <TrendingUp size={24} className="text-neon-amber" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Avg Damage Level</p>
              <p className="text-2xl font-bold text-white">
                {(historicalDisasters.reduce((a, b) => a + b.damageLevel, 0) / historicalDisasters.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="glow-card p-6 glow-card-red">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-neon-red/20 rounded-lg">
              <AlertTriangle size={24} className="text-neon-red" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Critical Events (5yr)</p>
              <p className="text-2xl font-bold text-white">
                {historicalDisasters.filter(d => d.damageLevel > 80).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
