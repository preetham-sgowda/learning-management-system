import React from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import SignInModal from './components/SignInModal';
import SignUpModal from './components/SignUpModal';
import StudentDashboard from './components/StudentDashboard';
import CourseCatalog from './components/CourseCatalog';
import PracticeSandbox from './components/PracticeSandbox';
import ResumeAIOptimizer from './components/ResumeAIOptimizer';
import Leaderboard from './components/Leaderboard';
import AIChatbotWidget from './components/AIChatbotWidget';
import Toast from './components/Toast';

const AppContent = () => {
  const { activeTab } = useApp();

  if (activeTab === 'landing') return <LandingPage />;
  if (activeTab === 'signin') return <SignInModal />;
  if (activeTab === 'signup') return <SignUpModal />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#EEEEEE] text-slate-900 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:ml-[260px] h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Main Canvas Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1440px] mx-auto">
            {activeTab === 'dashboard' && <StudentDashboard />}
            {activeTab === 'courses' && <CourseCatalog />}
            {activeTab === 'practice' && <PracticeSandbox />}
            {activeTab === 'resume-ai' && <ResumeAIOptimizer />}
            {activeTab === 'leaderboard' && <Leaderboard />}
          </div>
        </main>
      </div>

      {/* Global AI Assistant Floating Widget */}
      <AIChatbotWidget />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default AppContent;
