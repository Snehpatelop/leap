import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { AuthPage } from '@/components/AuthPage';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/views/DashboardView';
import { StudyPlanView } from '@/components/views/StudyPlanView';
import { ProgressView } from '@/components/views/ProgressView';
import { CommunityView } from '@/components/views/CommunityView';
import { Toaster } from '@/components/ui/sonner';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">L</span>
          </div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-gray-50">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'study' && <StudyPlanView />}
          {activeTab === 'progress' && <ProgressView />}
          {activeTab === 'community' && <CommunityView />}
        </main>
      </div>
    </DataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
