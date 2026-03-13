"use client";

import { useState } from "react";
import { Zap, CloudRain, Users, Building, Home, Loader2, Lightbulb } from "lucide-react";
import { DisasterType, Region, ScenarioConfig, ScenarioData, AIInsight } from "@/lib/types";
import { generateScenarioData, generateAIInsights } from "@/lib/scenario";

const disasterTypes: DisasterType[] = ["Flood", "Cyclone", "Earthquake", "Wildfire", "Landslide"];
const regions: Region[] = [
  "Kerala Coastal Region",
  "Assam Flood Plains",
  "Odisha Cyclone Belt",
  "Uttarakhand Himalayan Zone",
  "Maharashtra Urban Zone",
  "Bengaluru Urban Region",
  "Mumbai Metropolitan Area",
  "Himachal Landslide Region",
];

interface GenerateScenarioProps {
  onGenerate: (scenarios: ScenarioData[], insights: AIInsight[], config: ScenarioConfig) => void;
}

export function GenerateScenario({ onGenerate }: GenerateScenarioProps) {
  const [config, setConfig] = useState<ScenarioConfig>({
    disasterType: "Flood",
    region: "Kerala Coastal Region",
    rainfallLevel: 1500,
    populationDensity: 5000,
    infrastructureDamage: 50,
    shelterCapacity: 60,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenarioCount, setScenarioCount] = useState(100);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const scenarios = generateScenarioData(config, scenarioCount);
    const insights = generateAIInsights(scenarios, config);
    onGenerate(scenarios, insights, config);
    setIsGenerating(false);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-xl p-6 border border-border mb-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-blue" />
            Scenario Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Disaster Type</label>
              <select
                value={config.disasterType}
                onChange={(e) => setConfig({ ...config, disasterType: e.target.value as DisasterType })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20"
              >
                {disasterTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Region</label>
              <select
                value={config.region}
                onChange={(e) => setConfig({ ...config, region: e.target.value as Region })}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                <CloudRain className="w-4 h-4 inline mr-2" />
                Rainfall Level (mm): {config.rainfallLevel}
              </label>
              <input
                type="range"
                min="100"
                max="3000"
                value={config.rainfallLevel}
                onChange={(e) => setConfig({ ...config, rainfallLevel: parseInt(e.target.value) })}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-neon-blue"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>100mm</span>
                <span>3000mm</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Population Density (per sq km): {config.populationDensity}
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                value={config.populationDensity}
                onChange={(e) => setConfig({ ...config, populationDensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-neon-teal"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>500</span>
                <span>10,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Infrastructure Damage (%): {config.infrastructureDamage}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.infrastructureDamage}
                onChange={(e) => setConfig({ ...config, infrastructureDamage: parseInt(e.target.value) })}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-neon-amber"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                <Home className="w-4 h-4 inline mr-2" />
                Shelter Capacity (%): {config.shelterCapacity}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.shelterCapacity}
                onChange={(e) => setConfig({ ...config, shelterCapacity: parseInt(e.target.value) })}
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Number of Scenarios to Generate
                </label>
                <input
                  type="number"
                  min="50"
                  max="200"
                  value={scenarioCount}
                  onChange={(e) => setScenarioCount(Math.min(200, Math.max(50, parseInt(e.target.value) || 50)))}
                  className="w-32 px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-neon-blue/50"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-ripple px-8 py-3 bg-gradient-to-r from-neon-blue to-neon-teal text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Scenarios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-neon-amber" />
            Configuration Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-sm text-slate-300">
                <span className="text-neon-blue font-medium">Flood Scenarios:</span> Set rainfall above 1500mm for realistic flood simulations in coastal regions.
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-sm text-slate-300">
                <span className="text-neon-teal font-medium">Urban Areas:</span> Higher population density increases rescue priority and resource allocation needs.
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-sm text-slate-300">
                <span className="text-neon-amber font-medium">Infrastructure:</span> Damage above 70% triggers critical alerts and emergency response protocols.
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-sm text-slate-300">
                <span className="text-green-400 font-medium">Shelter Capacity:</span> Low capacity values indicate need for additional temporary shelters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
