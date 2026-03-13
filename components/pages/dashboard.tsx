"use client";

import { Zap, Map, AlertTriangle, Target, TrendingUp, Users, Activity } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { ScenarioData, AIInsight } from "@/lib/types";
import { historicalDisasters, getTotalPopulationAffected } from "@/lib/data";

interface DashboardProps {
  scenarios: ScenarioData[];
  insights: AIInsight[];
}

export function Dashboard({ scenarios, insights }: DashboardProps) {
  const highRiskZones = scenarios.filter((s) => s.riskLevel === "High").length;
  const modelAccuracy = 92.4;
  const totalPopulation = getTotalPopulationAffected();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Scenarios Generated"
          value={scenarios.length}
          icon={Zap}
          trend={{ value: 12, isPositive: true }}
          glowColor="blue"
        />
        <StatsCard
          title="Regions Analyzed"
          value={historicalDisasters.length}
          icon={Map}
          trend={{ value: 8, isPositive: true }}
          glowColor="teal"
        />
        <StatsCard
          title="High Risk Zones"
          value={highRiskZones}
          icon={AlertTriangle}
          trend={{ value: 3, isPositive: false }}
          glowColor="amber"
        />
        <StatsCard
          title="AI Model Accuracy"
          value={`${modelAccuracy}%`}
          icon={Target}
          trend={{ value: 2.1, isPositive: true }}
          glowColor="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-neon-blue" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {scenarios.slice(0, 5).map((scenario, index) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-3 bg-background rounded-lg border border-border animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      scenario.riskLevel === "High"
                        ? "bg-neon-red"
                        : scenario.riskLevel === "Medium"
                        ? "bg-neon-amber"
                        : "bg-green-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm text-white">{scenario.region}</p>
                    <p className="text-xs text-slate-400">
                      Rainfall: {scenario.rainfallLevel}mm | Population: {scenario.populationDensity.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    scenario.riskLevel === "High"
                      ? "bg-neon-red/20 text-neon-red"
                      : scenario.riskLevel === "Medium"
                      ? "bg-neon-amber/20 text-neon-amber"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {scenario.riskLevel}
                </span>
              </div>
            ))}
            {scenarios.length === 0 && (
              <p className="text-slate-400 text-center py-8">
                No scenarios generated yet. Go to Generate Scenario to create your first dataset.
              </p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-neon-teal" />
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Total Population Affected</span>
                <Users className="w-4 h-4 text-neon-blue" />
              </div>
              <p className="text-2xl font-bold text-white">{(totalPopulation / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Critical Scenarios</span>
                <AlertTriangle className="w-4 h-4 text-neon-red" />
              </div>
              <p className="text-2xl font-bold text-white">
                {scenarios.filter((s) => s.rescuePriority === "Critical").length}
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">AI Insights Generated</span>
                <Activity className="w-4 h-4 text-neon-teal" />
              </div>
              <p className="text-2xl font-bold text-white">{insights.length}</p>
            </div>
          </div>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-white mb-4">Latest AI Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.slice(0, 3).map((insight, index) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border animate-fade-in ${
                  insight.type === "critical"
                    ? "bg-neon-red/10 border-neon-red/30"
                    : insight.type === "warning"
                    ? "bg-neon-amber/10 border-neon-amber/30"
                    : "bg-neon-blue/10 border-neon-blue/30"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <p className="text-sm text-slate-300">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
