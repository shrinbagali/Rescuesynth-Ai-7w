"use client";

import { useState, useMemo } from "react";
import { Database, Download, Search, ArrowUpDown, Filter } from "lucide-react";
import { ScenarioData, RiskLevel } from "@/lib/types";

interface DatasetViewerProps {
  scenarios: ScenarioData[];
}

type SortField = "rainfallLevel" | "populationDensity" | "infrastructureDamage" | "riskLevel";
type SortDirection = "asc" | "desc";

export function DatasetViewer({ scenarios }: DatasetViewerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [sortField, setSortField] = useState<SortField>("riskLevel");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredAndSortedScenarios = useMemo(() => {
    let result = [...scenarios];

    if (searchTerm) {
      result = result.filter((s) =>
        s.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (riskFilter !== "All") {
      result = result.filter((s) => s.riskLevel === riskFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "riskLevel") {
        const riskOrder = { High: 3, Medium: 2, Low: 1 };
        comparison = riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      } else {
        comparison = a[sortField] - b[sortField];
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [scenarios, searchTerm, riskFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const exportCSV = () => {
    const headers = ["Region", "Rainfall (mm)", "Population Density", "Infrastructure Damage (%)", "Shelter Capacity (%)", "Risk Level", "Rescue Priority"];
    const rows = filteredAndSortedScenarios.map((s) => [
      s.region,
      s.rainfallLevel,
      s.populationDensity,
      s.infrastructureDamage,
      s.shelterCapacity,
      s.riskLevel,
      s.rescuePriority,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "disaster_scenarios.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRiskBadgeStyle = (risk: RiskLevel) => {
    switch (risk) {
      case "High":
        return "bg-neon-red/20 text-neon-red border-neon-red/30";
      case "Medium":
        return "bg-neon-amber/20 text-neon-amber border-neon-amber/30";
      case "Low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-neon-red/20 text-neon-red";
      case "High":
        return "bg-neon-amber/20 text-neon-amber";
      case "Medium":
        return "bg-neon-blue/20 text-neon-blue";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">
              Dataset Viewer ({filteredAndSortedScenarios.length} records)
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-neon-blue/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value as RiskLevel | "All")}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-white focus:outline-none focus:border-neon-blue/50"
              >
                <option value="All">All Risks</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>

            <button
              onClick={exportCSV}
              disabled={scenarios.length === 0}
              className="px-4 py-2 bg-neon-teal/20 text-neon-teal border border-neon-teal/30 rounded-lg text-sm font-medium hover:bg-neon-teal/30 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {scenarios.length === 0 ? (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No scenarios generated yet.</p>
            <p className="text-sm text-slate-500 mt-1">Go to Generate Scenario to create your dataset.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Region
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("rainfallLevel")}
                  >
                    <div className="flex items-center gap-1">
                      Rainfall
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("populationDensity")}
                  >
                    <div className="flex items-center gap-1">
                      Population
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("infrastructureDamage")}
                  >
                    <div className="flex items-center gap-1">
                      Damage
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Shelter
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => handleSort("riskLevel")}
                  >
                    <div className="flex items-center gap-1">
                      Risk Level
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAndSortedScenarios.slice(0, 50).map((scenario, index) => (
                  <tr
                    key={scenario.id}
                    className="hover:bg-card-hover transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 20}ms` }}
                  >
                    <td className="px-4 py-3 text-sm text-white">{scenario.region}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{scenario.rainfallLevel}mm</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{scenario.populationDensity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{scenario.infrastructureDamage}%</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{scenario.shelterCapacity}%</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium border ${getRiskBadgeStyle(
                          scenario.riskLevel
                        )}`}
                      >
                        {scenario.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeStyle(
                          scenario.rescuePriority
                        )}`}
                      >
                        {scenario.rescuePriority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAndSortedScenarios.length > 50 && (
              <div className="p-4 text-center text-sm text-slate-400 border-t border-border">
                Showing 50 of {filteredAndSortedScenarios.length} records
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
