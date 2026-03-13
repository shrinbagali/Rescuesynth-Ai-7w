import { useState } from 'react';
import { Zap, Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { DisasterType, Region, ScenarioData, ScenarioConfig, AIInsight } from '../types';
import { generateScenarioData, generateAIInsights } from '../utils/scenarioGenerator';

interface GenerateScenarioProps {
  onScenariosGenerated: (scenarios: ScenarioData[], insights: AIInsight[]) => void;
}

const disasterTypes: DisasterType[] = ['Flood', 'Cyclone', 'Earthquake', 'Wildfire', 'Landslide'];

const regions: Region[] = [
  'Kerala Coastal Region',
  'Assam Flood Plains',
  'Odisha Cyclone Belt',
  'Uttarakhand Himalayan Zone',
  'Maharashtra Urban Zone',
  'Bengaluru Urban Region',
  'Mumbai Metropolitan Area',
  'Himachal Landslide Region',
];

export default function GenerateScenario({ onScenariosGenerated }: GenerateScenarioProps) {
  const [config, setConfig] = useState<ScenarioConfig>({
    disasterType: 'Flood',
    region: 'Kerala Coastal Region',
    rainfallLevel: 1500,
    populationDensity: 5000,
    infrastructureDamage: 50,
    shelterCapacity: 60,
  });
  const [scenarioCount, setScenarioCount] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScenarios, setGeneratedScenarios] = useState<ScenarioData[]>([]);
  const [generatedInsights, setGeneratedInsights] = useState<AIInsight[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowSuccess(false);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const scenarios = generateScenarioData(config, scenarioCount);
    const insights = generateAIInsights(scenarios, config);
    
    setGeneratedScenarios(scenarios);
    setGeneratedInsights(insights);
    onScenariosGenerated(scenarios, insights);
    setIsGenerating(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="glow-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-neon-blue" />
            Scenario Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Disaster Type
              </label>
              <select
                value={config.disasterType}
                onChange={(e) => setConfig({ ...config, disasterType: e.target.value as DisasterType })}
                className="select-field w-full"
              >
                {disasterTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Region Selection
              </label>
              <select
                value={config.region}
                onChange={(e) => setConfig({ ...config, region: e.target.value as Region })}
                className="select-field w-full"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Rainfall Level (mm)
              </label>
              <input
                type="range"
                min="100"
                max="3000"
                value={config.rainfallLevel}
                onChange={(e) => setConfig({ ...config, rainfallLevel: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>100mm</span>
                <span className="text-neon-blue font-medium">{config.rainfallLevel}mm</span>
                <span>3000mm</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Population Density (per sq km)
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                value={config.populationDensity}
                onChange={(e) => setConfig({ ...config, populationDensity: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-teal"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>100</span>
                <span className="text-neon-teal font-medium">{config.populationDensity}</span>
                <span>10,000</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Infrastructure Damage (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.infrastructureDamage}
                onChange={(e) => setConfig({ ...config, infrastructureDamage: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-amber"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>0%</span>
                <span className="text-neon-amber font-medium">{config.infrastructureDamage}%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Shelter Capacity (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.shelterCapacity}
                onChange={(e) => setConfig({ ...config, shelterCapacity: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>0%</span>
                <span className="text-green-400 font-medium">{config.shelterCapacity}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Number of Scenarios to Generate
                </label>
                <select
                  value={scenarioCount}
                  onChange={(e) => setScenarioCount(parseInt(e.target.value))}
                  className="select-field"
                >
                  <option value={50}>50 scenarios</option>
                  <option value={100}>100 scenarios</option>
                  <option value={150}>150 scenarios</option>
                  <option value={200}>200 scenarios</option>
                </select>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Generate Scenario
                  </>
                )}
              </button>
            </div>
          </div>
          
          {showSuccess && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 animate-fade-in">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-green-400">
                Successfully generated {generatedScenarios.length} scenarios with {generatedInsights.length} AI insights!
              </span>
            </div>
          )}
        </div>

        {generatedScenarios.length > 0 && (
          <div className="glow-card p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">Generation Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400">
                  {generatedScenarios.filter(s => s.riskLevel === 'Low').length}
                </p>
                <p className="text-sm text-slate-400">Low Risk</p>
              </div>
              <div className="bg-neon-amber/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-neon-amber">
                  {generatedScenarios.filter(s => s.riskLevel === 'Medium').length}
                </p>
                <p className="text-sm text-slate-400">Medium Risk</p>
              </div>
              <div className="bg-neon-red/10 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-neon-red">
                  {generatedScenarios.filter(s => s.riskLevel === 'High').length}
                </p>
                <p className="text-sm text-slate-400">High Risk</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="glow-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Configuration</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Type</span>
              <span className="text-white font-medium">{config.disasterType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Region</span>
              <span className="text-white font-medium text-right text-sm">{config.region}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Rainfall</span>
              <span className="text-neon-blue font-medium">{config.rainfallLevel}mm</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Population</span>
              <span className="text-neon-teal font-medium">{config.populationDensity}/km²</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-700">
              <span className="text-slate-400">Damage</span>
              <span className="text-neon-amber font-medium">{config.infrastructureDamage}%</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Shelter</span>
              <span className="text-green-400 font-medium">{config.shelterCapacity}%</span>
            </div>
          </div>
        </div>

        {generatedInsights.length > 0 && (
          <div className="glow-card p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {generatedInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`p-3 rounded-lg border ${
                    insight.type === 'critical' ? 'bg-neon-red/10 border-neon-red/30' :
                    insight.type === 'warning' ? 'bg-neon-amber/10 border-neon-amber/30' :
                    'bg-neon-blue/10 border-neon-blue/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {insight.type === 'critical' ? (
                      <AlertTriangle size={16} className="text-neon-red mt-0.5 flex-shrink-0" />
                    ) : insight.type === 'warning' ? (
                      <AlertTriangle size={16} className="text-neon-amber mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info size={16} className="text-neon-blue mt-0.5 flex-shrink-0" />
                    )}
                    <p className={`text-sm ${
                      insight.type === 'critical' ? 'text-neon-red' :
                      insight.type === 'warning' ? 'text-neon-amber' :
                      'text-neon-blue'
                    }`}>
                      {insight.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
