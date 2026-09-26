import React, { useState } from 'react';
import { useCallSession } from '../context/CallSessionContext';

export const SettingsView: React.FC = () => {
  const { calls, clearSessionHistory, loadSampleCalls } = useCallSession();
  const [activeTab, setActiveTab] = useState<'ai' | 'audio' | 'integrations' | 'storage' | 'account'>('ai');
  const [model, setModel] = useState('neural-voice-pro');
  const [temperature, setTemperature] = useState('0.3');
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.voicedesk.ai/v1/telephony/webhook');
  const [savedStatus, setSavedStatus] = useState(false);
  const [clearedMessage, setClearedMessage] = useState(false);

  const handleSave = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleClearData = () => {
    clearSessionHistory();
    setClearedMessage(true);
    setTimeout(() => setClearedMessage(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8ff] text-[#191b23] space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-headline-lg text-3xl font-bold text-[#191b23]">System Settings</h1>
          <p className="font-body-md text-sm text-[#434655] mt-1">Configure AI engine models, audio streams, CRM integrations, and browser storage persistence.</p>
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
      <div className="flex border-b border-[#c3c6d7]/30 space-x-6 text-sm font-semibold overflow-x-auto">
        <button 
          onClick={() => setActiveTab('ai')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'ai' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">psychology</span>
          AI Model Engine
        </button>

        <button 
          onClick={() => setActiveTab('audio')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'audio' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">graphic_eq</span>
          Audio Stream
        </button>

        <button 
          onClick={() => setActiveTab('integrations')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'integrations' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">extension</span>
          Integrations &amp; Webhooks
        </button>

        <button 
          onClick={() => setActiveTab('storage')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'storage' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">database</span>
          Browser Storage &amp; Cache
        </button>

        <button 
          onClick={() => setActiveTab('account')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
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
            <h3 className="font-bold text-lg text-[#191b23]">AI Reception Engine Parameters</h3>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Select Primary Model</label>
              <select 
                value={model} 
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#004ac6]"
              >
                <option value="neural-voice-pro">Neural Voice Pro (Recommended - Multimodal &amp; Diarization)</option>
                <option value="neural-voice-flash">Neural Voice Flash (Ultra-Low Latency Telephony)</option>
                <option value="neural-voice-ultra">Neural Voice Ultra (High Precision Audio Stream)</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#434655]">
                <span>Temperature / Creativity</span>
                <span className="font-mono text-[#004ac6]">{temperature}</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.0" 
                step="0.1" 
                value={temperature} 
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full accent-[#004ac6]" 
              />
            </div>
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-bold text-lg text-[#191b23]">Real-time Audio Ingestion</h3>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Background Noise Suppression</p>
                <p className="text-xs text-[#434655]">Filters HVAC hum and office ambient audio.</p>
              </div>
              <input 
                type="checkbox" 
                checked={noiseSuppression} 
                onChange={(e) => setNoiseSuppression(e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Auto-Start Recording on Mic Access</p>
                <p className="text-xs text-[#434655]">Immediately begin stream buffering once microphone is granted.</p>
              </div>
              <input 
                type="checkbox" 
                checked={autoRecord} 
                onChange={(e) => setAutoRecord(e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
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

        {activeTab === 'storage' && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="font-bold text-lg text-[#191b23]">Browser LocalStorage &amp; Cache Control</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              All call analysis results, transcripts, entity extractions, and summaries are preserved locally in your browser storage (LocalStorage). No external server retains your confidential audio data without your permission.
            </p>

            <div className="p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Persisted Call Records</p>
                <p className="text-xs text-[#434655]">
                  Currently storing <strong className="text-[#004ac6] font-mono">{calls.length}</strong> analysis items in browser storage.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                {calls.length > 0 ? 'SYNCHRONIZED' : 'CLEAN / EMPTY'}
              </span>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleClearData}
                className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">delete_sweep</span>
                {clearedMessage ? 'Storage Cleared!' : 'Wipe Browser LocalStorage'}
              </button>

              <button
                onClick={loadSampleCalls}
                className="px-4 py-2.5 bg-[#004ac6]/10 text-[#004ac6] border border-[#004ac6]/20 rounded-xl text-xs font-semibold hover:bg-[#004ac6]/20 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">dataset</span>
                Populate 5 Demo Sample Calls
              </button>
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
                <p className="text-xs text-[#434655]">Unlimited Real-time Telephony Streams • Neural Voice Pro Included</p>
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
        <p className="text-[#434655] font-body-sm text-xs">© 2026 VoiceDesk AI. Powered by Neural Core.</p>
        <div className="flex gap-6 mt-2 md:mt-0">
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Privacy Policy</a>
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Terms of Service</a>
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};
