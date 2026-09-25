import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ai' | 'audio' | 'integrations' | 'account'>('ai');
  const [model, setModel] = useState('gemini-1.5-pro');
  const [temperature, setTemperature] = useState('0.3');
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.voicedesk.ai/v1/telephony/webhook');
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8ff] text-[#191b23] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-[#191b23]">System Settings</h1>
          <p className="font-body-md text-sm text-[#434655] mt-1">Configure AI engine models, audio streams, and CRM integrations.</p>
        </div>
        <button 
          onClick={handleSave}
          className="ai-gradient-bg text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-sm">save</span>
          {savedStatus ? 'Saved Changes!' : 'Save Preferences'}
        </button>
      </header>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#c3c6d7]/30 space-x-6 text-sm font-semibold">
        <button 
          onClick={() => setActiveTab('ai')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ai' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">psychology</span>
          AI Model Engine
        </button>

        <button 
          onClick={() => setActiveTab('audio')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audio' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">graphic_eq</span>
          Audio Stream Processing
        </button>

        <button 
          onClick={() => setActiveTab('integrations')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'integrations' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">extension</span>
          Integrations &amp; Webhooks
        </button>

        <button 
          onClick={() => setActiveTab('account')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'account' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">manage_accounts</span>
          Account &amp; API Keys
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-2xl p-8 border border-[#c3c6d7]/30 shadow-sm space-y-6">
        {activeTab === 'ai' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-bold text-lg text-[#191b23]">Gemini AI Engine Parameters</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Select Primary Model</label>
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#004ac6]"
              >
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended - Multimodal &amp; Diarization)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-Low Latency Telephony)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Experimental Audio Stream)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#434655]">
                <span>Temperature / Creativity</span>
                <span className="font-mono text-[#004ac6]">{temperature}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={temperature} 
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full accent-[#004ac6] cursor-pointer" 
              />
              <p className="text-xs text-[#737686]">Lower values yield more factual, deterministic summaries.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">System Instruction Prompt</label>
              <textarea 
                rows={4}
                defaultValue="You are VoiceDesk AI, an expert receptionist. Analyze incoming telephonic audio streams. Extract caller identity, main intent, key action items, and sentiment index. Maintain professional tone."
                className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-xs font-mono focus:outline-none focus:border-[#004ac6]"
              />
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-bold text-lg text-[#191b23]">Audio Hardware &amp; Stream Config</h3>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Neural Noise Suppression</p>
                <p className="text-xs text-[#434655]">Filter ambient office background noise and phone static.</p>
              </div>
              <input 
                type="checkbox" 
                checked={noiseSuppression} 
                onChange={(e) => setNoiseSuppression(e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Auto-Record Incoming Trunk Calls</p>
                <p className="text-xs text-[#434655]">Start real-time recording immediately upon call pick-up.</p>
              </div>
              <input 
                type="checkbox" 
                checked={autoRecord} 
                onChange={(e) => setAutoRecord(e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Target Audio Format</label>
              <select className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-sm font-medium">
                <option>WAV 16-bit PCM (44.1 kHz)</option>
                <option>Opus / WebRTC Stream (Low Latency)</option>
                <option>MP3 High Bitrate (320 kbps)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-bold text-lg text-[#191b23]">Connected Platforms &amp; Webhooks</h3>

            <div className="space-y-4">
              <div className="p-4 border border-[#c3c6d7]/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#57dffe]/20 text-[#006172] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#191b23]">Google Calendar Sync</p>
                    <p className="text-xs text-[#434655]">Auto-book appointment slots from voice intent.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">CONNECTED</span>
              </div>

              <div className="p-4 border border-[#c3c6d7]/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">hub</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#191b23]">HubSpot CRM</p>
                    <p className="text-xs text-[#434655]">Create contact cards and attach call summaries.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">CONNECTED</span>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Outbound Event Webhook URL</label>
                <input 
                  type="text" 
                  value={webhookUrl} 
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-xs font-mono focus:outline-none focus:border-[#004ac6]" 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-bold text-lg text-[#191b23]">Account Subscription &amp; API Keys</h3>

            <div className="p-6 bg-[#f3f3fe] rounded-2xl border border-[#004ac6]/20 flex justify-between items-center">
              <div>
                <span className="px-2.5 py-1 bg-[#004ac6] text-white rounded-md text-[10px] font-bold uppercase tracking-wider">Current Plan</span>
                <h4 className="font-bold text-xl text-[#191b23] mt-2">Enterprise Pro Tier</h4>
                <p className="text-xs text-[#434655]">Unlimited Real-time Telephony Streams • Gemini 1.5 Pro Included</p>
              </div>
              <button className="px-4 py-2 border border-[#004ac6] text-[#004ac6] rounded-xl font-bold text-xs hover:bg-[#004ac6]/10">
                Manage Billing
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">VoiceDesk Secret Key</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value="vd_live_key_902183921098231092" 
                  readOnly
                  className="flex-1 p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-xs font-mono"
                />
                <button className="px-4 py-3 bg-[#191b23] text-white rounded-xl text-xs font-bold hover:bg-black">
                  Reveal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-6 mt-12 bg-[#e1e2ed] flex flex-col md:flex-row justify-between items-center px-6 rounded-xl">
        <p className="text-[#434655] font-body-sm text-xs">© 2024 VoiceDesk AI. Powered by Neural Core.</p>
        <div className="flex gap-6 mt-2 md:mt-0">
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Privacy Policy</a>
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Terms of Service</a>
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};
