import { Bell, Search, User } from 'lucide-react';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
}

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard Overview',
  realtime: 'Real-Time Disaster Detection Engine',
  generate: 'Disaster Scenario Generator',
  dataset: 'Dataset Viewer',
  training: 'AI Model Training',
  analytics: 'Disaster Analytics',
  map: 'Global Disaster Intelligence Map',
  history: 'Scenario History',
};

export default function Header({ currentPage }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="h-16 bg-card border-b border-slate-700/50 flex items-center justify-between px-6">
      <div>
        <h2 className="text-xl font-semibold text-white">{pageTitles[currentPage]}</h2>
        <p className="text-sm text-slate-400">{currentDate}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search scenarios..."
            className="bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-neon-blue w-64 transition-all duration-200"
          />
        </div>
        
        <button className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
          <Bell size={20} className="text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-red rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-teal flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-400">Disaster Response</p>
          </div>
        </div>
      </div>
    </header>
  );
}
