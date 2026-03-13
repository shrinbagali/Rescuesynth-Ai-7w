import { useState, useMemo } from 'react';
import { Database, Search, ArrowUpDown, Filter, Download } from 'lucide-react';
import { ScenarioData, RiskLevel, RescuePriority } from '../types';

interface DatasetViewerProps {
  scenarios: ScenarioData[];
}

type SortField = 'rainfallLevel' | 'populationDensity' | 'infrastructureDamage' | 'riskLevel' | 'rescuePriority';
type SortDirection = 'asc' | 'desc';

const riskLevelOrder: Record<RiskLevel, number> = { Low: 1, Medium: 2, High: 3 };
const priorityOrder: Record<RescuePriority, number> = { Low: 1, Medium: 2, High: 3, Critical: 4 };

export default function DatasetViewer({ scenarios }: DatasetViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('riskLevel');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterRisk, setFilterRisk] = useState<RiskLevel | 'All'>('All');

  const filteredAndSortedScenarios = useMemo(() => {
    let result = [...scenarios];
    
    if (searchTerm) {
      result = result.filter(s => 
        s.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRisk !== 'All') {
      result = result.filter(s => s.riskLevel === filterRisk);
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'riskLevel') {
        comparison = riskLevelOrder[a.riskLevel] - riskLevelOrder[b.riskLevel];
      } else if (sortField === 'rescuePriority') {
        comparison = priorityOrder[a.rescuePriority] - priorityOrder[b.rescuePriority];
      } else {
        comparison = a[sortField] - b[sortField];
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [scenarios, searchTerm, sortField, sortDirection, filterRisk]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getRiskBadgeClass = (risk: RiskLevel) => {
    switch (risk) {
      case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium': return 'bg-neon-amber/20 text-neon-amber border-neon-amber/30';
      case 'High': return 'bg-neon-red/20 text-neon-red border-neon-red/30';
    }
  };

  const getPriorityBadgeClass = (priority: RescuePriority) => {
    switch (priority) {
      case 'Low': return 'bg-slate-600/20 text-slate-400 border-slate-500/30';
      case 'Medium': return 'bg-neon-blue/20 text-neon-blue border-neon-blue/30';
      case 'High': return 'bg-neon-amber/20 text-neon-amber border-neon-amber/30';
      case 'Critical': return 'bg-neon-red/20 text-neon-red border-neon-red/30';
    }
  };

  const exportToCSV = () => {
    const headers = ['Region', 'Rainfall (mm)', 'Population Density', 'Infrastructure Damage (%)', 'Shelter Capacity (%)', 'Risk Level', 'Rescue Priority'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedScenarios.map(s => 
        [s.region, s.rainfallLevel, s.populationDensity, s.infrastructureDamage, s.shelterCapacity, s.riskLevel, s.rescuePriority].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'disaster_scenarios.csv';
    a.click();
  };

  if (scenarios.length === 0) {
    return (
      <div className="glow-card p-12 text-center">
        <Database size={64} className="mx-auto text-slate-600 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Dataset Available</h3>
        <p className="text-slate-400 mb-4">Generate scenarios first to view the dataset</p>
        <p className="text-sm text-slate-500">Navigate to "Generate Scenario" to create disaster simulation data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glow-card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Database size={20} className="text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">
              Generated Dataset
            </h3>
            <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue text-sm rounded-lg">
              {filteredAndSortedScenarios.length} records
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-slate-400" />
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value as RiskLevel | 'All')}
                className="select-field"
              >
                <option value="All">All Risk Levels</option>
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
            
            <button onClick={exportToCSV} className="btn-secondary flex items-center gap-2">
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-4 text-slate-400 font-medium">Region</th>
                <th 
                  className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('rainfallLevel')}
                >
                  <div className="flex items-center gap-2">
                    Rainfall (mm)
                    <ArrowUpDown size={14} className={sortField === 'rainfallLevel' ? 'text-neon-blue' : ''} />
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('populationDensity')}
                >
                  <div className="flex items-center gap-2">
                    Population
                    <ArrowUpDown size={14} className={sortField === 'populationDensity' ? 'text-neon-blue' : ''} />
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('infrastructureDamage')}
                >
                  <div className="flex items-center gap-2">
                    Damage (%)
                    <ArrowUpDown size={14} className={sortField === 'infrastructureDamage' ? 'text-neon-blue' : ''} />
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('riskLevel')}
                >
                  <div className="flex items-center gap-2">
                    Risk Level
                    <ArrowUpDown size={14} className={sortField === 'riskLevel' ? 'text-neon-blue' : ''} />
                  </div>
                </th>
                <th 
                  className="text-left py-4 px-4 text-slate-400 font-medium cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('rescuePriority')}
                >
                  <div className="flex items-center gap-2">
                    Rescue Priority
                    <ArrowUpDown size={14} className={sortField === 'rescuePriority' ? 'text-neon-blue' : ''} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedScenarios.slice(0, 50).map((scenario, index) => (
                <tr 
                  key={scenario.id}
                  className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <td className="py-4 px-4 text-white font-medium">{scenario.region}</td>
                  <td className="py-4 px-4 text-slate-300">{scenario.rainfallLevel}</td>
                  <td className="py-4 px-4 text-slate-300">{scenario.populationDensity}</td>
                  <td className="py-4 px-4 text-slate-300">{scenario.infrastructureDamage}%</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskBadgeClass(scenario.riskLevel)}`}>
                      {scenario.riskLevel}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityBadgeClass(scenario.rescuePriority)}`}>
                      {scenario.rescuePriority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedScenarios.length > 50 && (
          <div className="mt-4 text-center text-slate-400 text-sm">
            Showing 50 of {filteredAndSortedScenarios.length} records
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glow-card p-4">
          <p className="text-slate-400 text-sm">Total Records</p>
          <p className="text-2xl font-bold text-white">{scenarios.length}</p>
        </div>
        <div className="glow-card p-4 glow-card-teal">
          <p className="text-slate-400 text-sm">Low Risk</p>
          <p className="text-2xl font-bold text-green-400">
            {scenarios.filter(s => s.riskLevel === 'Low').length}
          </p>
        </div>
        <div className="glow-card p-4 glow-card-amber">
          <p className="text-slate-400 text-sm">Medium Risk</p>
          <p className="text-2xl font-bold text-neon-amber">
            {scenarios.filter(s => s.riskLevel === 'Medium').length}
          </p>
        </div>
        <div className="glow-card p-4 glow-card-red">
          <p className="text-slate-400 text-sm">High Risk</p>
          <p className="text-2xl font-bold text-neon-red">
            {scenarios.filter(s => s.riskLevel === 'High').length}
          </p>
        </div>
      </div>
    </div>
  );
}
