import React, { useState } from 'react';
import { CallSessionProvider } from './context/CallSessionContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { VoiceAnalyzerView } from './components/VoiceAnalyzerView';
import { DashboardView } from './components/DashboardView';
import { AboutProjectView } from './components/AboutProjectView';
import { SettingsView } from './components/SettingsView';

export type PageView = 'home' | 'analyzer' | 'dashboard' | 'about' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CallSessionProvider>
      <div className="min-h-screen bg-[#faf8ff] font-body-md text-[#191b23] flex flex-col">
        {/* Universal Top Navigation Bar for every page */}
        <Navbar 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
        />

        {/* Content Area with top offset for fixed navbar */}
        <div className="pt-16 flex-1 flex flex-col">
          {currentPage === 'home' ? (
            <HomeView 
              onLaunchApp={() => handleNavigate('analyzer')} 
              onAnalyzeCall={() => handleNavigate('analyzer')} 
            />
          ) : (
            <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
              {/* Secondary Quick Header / Context Bar */}
              <div className="flex justify-between items-center pb-4 border-b border-[#c3c6d7]/20 mb-6">
                <button 
                  onClick={() => handleNavigate('home')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#004ac6] hover:bg-[#004ac6]/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Back to Home
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#737686] bg-[#f3f3fe] px-2.5 py-1 rounded-md border border-[#c3c6d7]/30">
                    VoiceDesk AI • Session Live
                  </span>
                  <button 
                    onClick={() => handleNavigate('settings')}
                    className="w-8 h-8 rounded-full bg-[#f3f3fe] text-[#434655] flex items-center justify-center hover:bg-[#e7e7f3] transition-colors"
                    title="Settings"
                  >
                    <span className="material-symbols-outlined text-sm">settings</span>
                  </button>
                </div>
              </div>

              {/* Active View Container */}
              <div className="flex-1">
                {currentPage === 'analyzer' && (
                  <VoiceAnalyzerView 
                    onGoHome={() => handleNavigate('home')}
                    onAnalyzeSuccess={() => handleNavigate('dashboard')}
                  />
                )}

                {currentPage === 'dashboard' && (
                  <DashboardView 
                    onNewAnalysis={() => handleNavigate('analyzer')}
                  />
                )}

                {currentPage === 'about' && (
                  <AboutProjectView />
                )}

                {currentPage === 'settings' && (
                  <SettingsView />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </CallSessionProvider>
  );
}
