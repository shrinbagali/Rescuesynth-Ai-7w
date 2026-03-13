"use client";

import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  glowColor?: "blue" | "teal" | "amber" | "red";
}

const glowStyles = {
  blue: "hover:shadow-glow border-neon-blue/30",
  teal: "hover:shadow-glow-teal border-neon-teal/30",
  amber: "hover:shadow-glow-amber border-neon-amber/30",
  red: "hover:shadow-glow-red border-neon-red/30",
};

const iconBgStyles = {
  blue: "bg-neon-blue/20 text-neon-blue",
  teal: "bg-neon-teal/20 text-neon-teal",
  amber: "bg-neon-amber/20 text-neon-amber",
  red: "bg-neon-red/20 text-neon-red",
};

export function StatsCard({ title, value, icon: Icon, trend, glowColor = "blue" }: StatsCardProps) {
  return (
    <div
      className={`bg-card rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1 card-glow ${glowStyles[glowColor]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgStyles[glowColor]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
