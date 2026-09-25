import React from 'react';

interface SidebarProps {
  activeTab: 'analyzer' | 'dashboard' | 'about' | 'settings';
  setActiveTab: (tab: 'analyzer' | 'dashboard' | 'about' | 'settings') => void;
  onGoHome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onGoHome }) => {
  return (
    <aside 
      id="app-sidebar"
      className="h-screen w-64 fixed left-0 top-0 bg-[#f3f3fe] border-r border-[#c3c6d7]/30 flex flex-col py-6 px-4 shadow-sm z-40"
    >
      <div 
        className="px-4 mb-6 cursor-pointer group"
        onClick={onGoHome}
        title="Go to Home Landing Page"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            graphic_eq
          </span>
          <h1 className="font-headline-md text-2xl font-bold text-[#004ac6] group-hover:opacity-90 transition-opacity">
            VoiceDesk AI
          </h1>
        </div>
        <p className="text-[#434655] text-xs opacity-70 ml-1 mt-0.5">AI Receptionist</p>
      </div>

      <nav className="flex-grow space-y-2">
        <button
          id="nav-voice-analyzer"
          onClick={() => setActiveTab('analyzer')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left font-medium ${
            activeTab === 'analyzer'
              ? 'bg-[#57dffe] text-[#006172] shadow-sm font-semibold'
              : 'text-[#434655] hover:bg-[#e1e2ed] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined">mic_none</span>
          <span>Voice Analyzer</span>
        </button>

        <button
          id="nav-dashboard"
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left font-medium ${
            activeTab === 'dashboard'
              ? 'bg-[#57dffe] text-[#006172] shadow-sm font-semibold'
              : 'text-[#434655] hover:bg-[#e1e2ed] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === 'dashboard' ? "'FILL' 1" : "'FILL' 0" }}>
            dashboard
          </span>
          <span>Dashboard</span>
        </button>

        <button
          id="nav-about-project"
          onClick={() => setActiveTab('about')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left font-medium ${
            activeTab === 'about'
              ? 'bg-[#57dffe] text-[#006172] shadow-sm font-semibold'
              : 'text-[#434655] hover:bg-[#e1e2ed] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined">info</span>
          <span>About Project</span>
        </button>

        <button
          id="nav-settings"
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-left font-medium ${
            activeTab === 'settings'
              ? 'bg-[#57dffe] text-[#006172] shadow-sm font-semibold'
              : 'text-[#434655] hover:bg-[#e1e2ed] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </button>
      </nav>


    </aside>
  );
};
