"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Dashboard } from "@/components/pages/dashboard";
import { GenerateScenario } from "@/components/pages/generate-scenario";
import { DatasetViewer } from "@/components/pages/dataset-viewer";
import { AITraining } from "@/components/pages/ai-training";
import { Analytics } from "@/components/pages/analytics";
import { DisasterMap } from "@/components/pages/disaster-map";
import { ScenarioHistory } from "@/components/pages/scenario-history";
import { Page, ScenarioData, AIInsight, ScenarioConfig, GenerationSession } from "@/lib/types";

const pageConfig: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Overview of disaster intelligence" },
  generate: { title: "Generate Scenario", subtitle: "Create synthetic disaster scenarios" },
  dataset: { title: "Dataset Viewer", subtitle: "Browse and export scenario data" },
  training: { title: "AI Training", subtitle: "Train rescue priority prediction model" },
  analytics: { title: "Disaster Analytics", subtitle: "Visualize disaster patterns and trends" },
  map: { title: "Global Disaster Map", subtitle: "Interactive disaster event visualization" },
  history: { title: "Scenario History", subtitle: "View past generation sessions" },
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [sessions, setSessions] = useState<GenerationSession[]>([]);

  const handleGenerate = (
    newScenarios: ScenarioData[],
    newInsights: AIInsight[],
    config: ScenarioConfig
  ) => {
    setScenarios(newScenarios);
    setInsights(newInsights);

    const session: GenerationSession = {
      id: `session-${Date.now()}`,
      timestamp: new Date(),
      config,
      scenarioCount: newScenarios.length,
      insights: newInsights,
    };
    setSessions((prev) => [session, ...prev]);

    setCurrentPage("dataset");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard scenarios={scenarios} insights={insights} />;
      case "generate":
        return <GenerateScenario onGenerate={handleGenerate} />;
      case "dataset":
        return <DatasetViewer scenarios={scenarios} />;
      case "training":
        return <AITraining scenarios={scenarios} />;
      case "analytics":
        return <Analytics scenarios={scenarios} />;
      case "map":
        return <DisasterMap />;
      case "history":
        return <ScenarioHistory sessions={sessions} />;
      default:
        return <Dashboard scenarios={scenarios} insights={insights} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header
          title={pageConfig[currentPage].title}
          subtitle={pageConfig[currentPage].subtitle}
        />
        <main className="flex-1 overflow-auto">{renderPage()}</main>
      </div>
    </div>
  );
}
