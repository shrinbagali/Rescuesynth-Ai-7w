"use client";

import { History, Calendar, MapPin, AlertTriangle, Zap } from "lucide-react";
import { GenerationSession } from "@/lib/types";

interface ScenarioHistoryProps {
  sessions: GenerationSession[];
}

export function ScenarioHistory({ sessions }: ScenarioHistoryProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <History className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Scenario Generation History</h3>
          </div>

          {sessions.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No generation sessions yet.</p>
              <p className="text-sm text-slate-500 mt-1">
                Generate scenarios to see your history here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sessions.map((session, index) => (
                <div
                  key={session.id}
                  className="p-4 hover:bg-card-hover transition-colors animate-slide-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-xs font-medium rounded">
                          {session.config.disasterType}
                        </span>
                        <span className="text-sm text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(session.timestamp)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-slate-300">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-neon-teal" />
                          {session.config.region}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4 text-neon-amber" />
                          {session.scenarioCount} scenarios
                        </span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-neon-red" />
                          {session.insights.length} insights
                        </span>
                      </div>

                      {session.insights.length > 0 && (
                        <div className="mt-3 p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-slate-400 mb-1">Top Insight:</p>
                          <p className="text-sm text-slate-300">{session.insights[0].message}</p>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-500">Parameters</div>
                      <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                        <p>Rainfall: {session.config.rainfallLevel}mm</p>
                        <p>Population: {session.config.populationDensity}</p>
                        <p>Damage: {session.config.infrastructureDamage}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
