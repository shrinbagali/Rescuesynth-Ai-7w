import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import GenerateScenario from './pages/GenerateScenario';
import DatasetViewer from './pages/DatasetViewer';
import AITraining from './pages/AITraining';
import DisasterAnalytics from './pages/DisasterAnalytics';
import DisasterMap from './pages/DisasterMap';
import ScenarioHistory from './pages/ScenarioHistory';
import { Page, ScenarioData, AIInsight, TrainingMetrics } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [scenarios, setScenarios] = useState<ScenarioData[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics | null>(null);
  const [scenarioHistory, setScenarioHistory] = useState<{
    id: string;
    timestamp: Date;
    config: string;
    scenarioCount: number;
  }[]>([]);

  const handleScenariosGenerated = (newScenarios: ScenarioData[], newInsights: AIInsight[]) => {
    setScenarios(newScenarios);
    setInsights(newInsights);
    setScenarioHistory(prev => [
      {
        id: `history-${Date.now()}`,
        timestamp: new Date(),
        config: newScenarios[0]?.region || 'Unknown',
        scenarioCount: newScenarios.length,
      },
      ...prev,
    ]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            scenarios={scenarios} 
            insights={insights}
            trainingMetrics={trainingMetrics}
            historyCount={scenarioHistory.length}
          />
        );
      case 'generate':
        return <GenerateScenario onScenariosGenerated={handleScenariosGenerated} />;
      case 'dataset':
        return <DatasetViewer scenarios={scenarios} />;
      case 'training':
        return (
          <AITraining 
            scenarios={scenarios} 
            onTrainingComplete={setTrainingMetrics}
            trainingMetrics={trainingMetrics}
          />
        );
      case 'analytics':
        return <DisasterAnalytics scenarios={scenarios} />;
      case 'map':
        return <DisasterMap />;
      case 'history':
        return <ScenarioHistory history={scenarioHistory} />;
      default:
        return <Dashboard scenarios={scenarios} insights={insights} trainingMetrics={trainingMetrics} historyCount={scenarioHistory.length} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="ml-64">
        <Header currentPage={currentPage} />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
