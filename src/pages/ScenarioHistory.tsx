import { History, Clock, MapPin, FileText, Trash2 } from 'lucide-react';

interface ScenarioHistoryProps {
  history: {
    id: string;
    timestamp: Date;
    config: string;
    scenarioCount: number;
  }[];
}

export default function ScenarioHistory({ history }: ScenarioHistoryProps) {
  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (history.length === 0) {
    return (
      <div className="glow-card p-12 text-center">
        <History size={64} className="mx-auto text-slate-600 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Scenario History</h3>
        <p className="text-slate-400 mb-4">Generated scenarios will appear here</p>
        <p className="text-sm text-slate-500">Navigate to "Generate Scenario" to create your first scenario</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glow-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History size={20} className="text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Scenario Generation History</h3>
          </div>
          <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-sm rounded-lg">
            {history.length} sessions
          </span>
        </div>

        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all duration-200 animate-fade-in group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-neon-blue/20 flex items-center justify-center">
                  <FileText size={24} className="text-neon-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-neon-teal" />
                    <span className="font-medium text-white">{item.config}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock size={14} />
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{item.scenarioCount}</p>
                  <p className="text-sm text-slate-400">scenarios</p>
                </div>
                
                <button className="p-2 rounded-lg hover:bg-neon-red/20 text-slate-400 hover:text-neon-red transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glow-card p-6 text-center">
          <p className="text-3xl font-bold text-neon-blue">
            {history.reduce((sum, item) => sum + item.scenarioCount, 0)}
          </p>
          <p className="text-slate-400 mt-2">Total Scenarios Generated</p>
        </div>
        <div className="glow-card p-6 text-center glow-card-teal">
          <p className="text-3xl font-bold text-neon-teal">{history.length}</p>
          <p className="text-slate-400 mt-2">Generation Sessions</p>
        </div>
        <div className="glow-card p-6 text-center glow-card-amber">
          <p className="text-3xl font-bold text-neon-amber">
            {history.length > 0 
              ? Math.round(history.reduce((sum, item) => sum + item.scenarioCount, 0) / history.length)
              : 0
            }
          </p>
          <p className="text-slate-400 mt-2">Avg per Session</p>
        </div>
      </div>
    </div>
  );
}
