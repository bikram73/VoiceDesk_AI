import React, { useState } from 'react';
import { CallSessionProvider } from './context/CallSessionContext';
import { HomeView } from './components/HomeView';
import { Sidebar } from './components/Sidebar';
import { VoiceAnalyzerView } from './components/VoiceAnalyzerView';
import { DashboardView } from './components/DashboardView';
import { AboutProjectView } from './components/AboutProjectView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  const [mode, setMode] = useState<'home' | 'app'>('home');
  const [activeTab, setActiveTab] = useState<'analyzer' | 'dashboard' | 'about' | 'settings'>('analyzer');

  const handleLaunchApp = () => {
    setMode('app');
    setActiveTab('analyzer');
  };

  const handleAnalyzeCall = () => {
    setMode('app');
    setActiveTab('analyzer');
  };

  const handleGoHome = () => {
    setMode('home');
  };

  return (
    <CallSessionProvider>
      <div className="min-h-screen bg-[#faf8ff] font-body-md text-[#191b23]">
        {mode === 'home' ? (
          <HomeView 
            onLaunchApp={handleLaunchApp} 
            onAnalyzeCall={handleAnalyzeCall} 
          />
        ) : (
          <div className="flex min-h-screen">
            {/* Sidebar Navigation */}
            <Sidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onGoHome={handleGoHome}
            />

            {/* Main Application Area */}
            <div className="flex-1 ml-64 p-8 overflow-x-hidden min-h-screen flex flex-col">
              {/* Top Bar inside App mode for quick navigation */}
              <div className="flex justify-between items-center pb-6 border-b border-[#c3c6d7]/20 mb-6">
                <button 
                  onClick={handleGoHome}
                  className="flex items-center gap-2 text-xs font-semibold text-[#004ac6] hover:bg-[#004ac6]/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Home Landing Page
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#737686] bg-[#f3f3fe] px-2.5 py-1 rounded-md border border-[#c3c6d7]/30">
                    VoiceDesk AI v2.4
                  </span>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="w-8 h-8 rounded-full bg-[#f3f3fe] text-[#434655] flex items-center justify-center hover:bg-[#e7e7f3] transition-colors"
                    title="Settings"
                  >
                    <span className="material-symbols-outlined text-sm">settings</span>
                  </button>
                </div>
              </div>

              {/* Active View Container */}
              <div className="flex-1">
                {activeTab === 'analyzer' && (
                  <VoiceAnalyzerView 
                    onGoHome={handleGoHome}
                    onAnalyzeWithGemini={() => setActiveTab('dashboard')}
                  />
                )}

                {activeTab === 'dashboard' && (
                  <DashboardView 
                    onNewAnalysis={() => setActiveTab('analyzer')}
                  />
                )}

                {activeTab === 'about' && (
                  <AboutProjectView />
                )}

                {activeTab === 'settings' && (
                  <SettingsView />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </CallSessionProvider>
  );
}


