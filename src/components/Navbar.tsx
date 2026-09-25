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
        <div className="hidden sm:flex items-center gap-3">
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
          <div className="pt-2">
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
