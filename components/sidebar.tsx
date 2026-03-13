"use client";

import {
  LayoutDashboard,
  Zap,
  Database,
  Brain,
  BarChart3,
  Globe,
  History,
  Shield,
} from "lucide-react";
import { Page } from "@/lib/types";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const menuItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "generate", label: "Generate Scenario", icon: <Zap className="w-5 h-5" /> },
  { id: "dataset", label: "Dataset Viewer", icon: <Database className="w-5 h-5" /> },
  { id: "training", label: "AI Training", icon: <Brain className="w-5 h-5" /> },
  { id: "analytics", label: "Disaster Analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { id: "map", label: "Global Disaster Map", icon: <Globe className="w-5 h-5" /> },
  { id: "history", label: "Scenario History", icon: <History className="w-5 h-5" /> },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-teal flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white">RescueSynth</h1>
          <p className="text-xs text-slate-400">AI Intelligence</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/30 shadow-glow"
                    : "text-slate-400 hover:text-white hover:bg-card-hover"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-neon-blue/10 to-neon-teal/10 border border-neon-blue/20">
          <p className="text-xs text-slate-400">AI Model Status</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white">Active & Ready</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
