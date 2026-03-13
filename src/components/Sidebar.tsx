import { 
  LayoutDashboard, 
  Zap, 
  Database, 
  Brain, 
  BarChart3, 
  Globe, 
  History,
  Shield,
  Activity,
  Radio,
  Image,
  Cpu,
  Radar
} from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const menuItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'aicommandcenter', label: 'AI Command Center', icon: <Cpu size={20} /> },
  { id: 'dualdisasterdetection', label: 'Dual Disaster Detection', icon: <Radar size={20} /> },
  { id: 'livemonitoring', label: 'Live Monitoring', icon: <Radio size={20} /> },
  { id: 'realtime', label: 'Real-Time Detection', icon: <Activity size={20} /> },
  { id: 'imagedetection', label: 'Image Detection', icon: <Image size={20} /> },
  { id: 'generate', label: 'Generate Scenario', icon: <Zap size={20} /> },
  { id: 'dataset', label: 'Dataset Viewer', icon: <Database size={20} /> },
  { id: 'training', label: 'AI Training', icon: <Brain size={20} /> },
  { id: 'analytics', label: 'Disaster Analytics', icon: <BarChart3 size={20} /> },
  { id: 'map', label: 'Global Disaster Map', icon: <Globe size={20} /> },
  { id: 'history', label: 'Scenario History', icon: <History size={20} /> },
];

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-slate-700/50 flex flex-col z-50">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-teal flex items-center justify-center">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white">RescueSynth</h1>
            <p className="text-xs text-slate-400">AI Disaster Intelligence</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              currentPage === item.id
                ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={`transition-transform duration-200 ${currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-700/50">
        <div className="bg-gradient-to-r from-neon-blue/10 to-neon-teal/10 rounded-lg p-4 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-green-400">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
