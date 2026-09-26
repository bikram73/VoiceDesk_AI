import React, { useState } from 'react';
import { useCallSession } from '../context/CallSessionContext';

export interface NavbarProps {
  currentPage: 'home' | 'analyzer' | 'dashboard' | 'about' | 'settings';
  onNavigate: (page: 'home' | 'analyzer' | 'dashboard' | 'about' | 'settings') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { calls } = useCallSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: 'home' | 'analyzer' | 'dashboard' | 'about' | 'settings'; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'analyzer', label: 'Voice Analyzer', icon: 'mic' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'about', label: 'About Project', icon: 'info' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const handleItemClick = (id: 'home' | 'analyzer' | 'dashboard' | 'about' | 'settings') => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#faf8ff]/90 backdrop-blur-xl shadow-sm border-b border-[#c3c6d7]/20">
      <div className="flex justify-between items-center px-6 py-2 max-w-[1440px] mx-auto h-16">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleItemClick('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-[#004ac6]/10 flex items-center justify-center text-[#004ac6] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              graphic_eq
            </span>
          </div>
          <div>
            <span className="font-headline-md text-2xl font-bold text-[#004ac6] tracking-tight">VoiceDesk AI</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-[#006172] bg-[#57dffe]/20 px-2 py-0.5 rounded-full">
              Voice Agent
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#004ac6] text-white font-semibold shadow-sm'
                    : 'text-[#434655] hover:text-[#004ac6] hover:bg-[#e1e2ed]/50'
                }`}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.id === 'dashboard' && calls.length > 0 && (
                  <span className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white text-[#004ac6]' : 'bg-[#004ac6]/10 text-[#004ac6]'
                  }`}>
                    {calls.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right CTA Action & Session Status */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href="https://github.com/bikram73/VoiceDesk_AI"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#191b23] hover:bg-[#e1e2ed]/80 border border-[#c3c6d7]/40 transition-all shadow-xs"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current text-[#191b23]" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden lg:inline">GitHub</span>
          </a>

          {currentPage === 'home' ? (
            <button
              onClick={() => handleItemClick('analyzer')}
              className="bg-[#004ac6] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 duration-200 transition-all shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">mic</span>
              <span>Launch App</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleItemClick('analyzer')}
                className="bg-[#004ac6] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-90 active:scale-95 duration-200 transition-all shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>Analyze Call</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center md:hidden gap-2">
          {calls.length > 0 && (
            <span className="text-xs font-semibold bg-[#004ac6]/10 text-[#004ac6] px-2.5 py-1 rounded-lg">
              {calls.length} Calls
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#434655] hover:bg-[#e1e2ed] rounded-xl transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-2 pb-6 bg-[#faf8ff] border-b border-[#c3c6d7]/30 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#004ac6] text-white font-semibold'
                    : 'text-[#434655] hover:bg-[#e1e2ed]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.id === 'dashboard' && calls.length > 0 && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-[#004ac6]' : 'bg-[#004ac6]/10 text-[#004ac6]'
                  }`}>
                    {calls.length}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://github.com/bikram73/VoiceDesk_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-[#191b23] border border-[#c3c6d7]/50 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-[#f3f3fe] transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-[#191b23]" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>View GitHub Repository</span>
            </a>
            <button
              onClick={() => handleItemClick('analyzer')}
              className="w-full bg-[#004ac6] text-white py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">mic</span>
              <span>Start Voice Analysis</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
