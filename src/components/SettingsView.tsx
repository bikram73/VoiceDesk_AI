import React, { useState, useEffect } from 'react';
import { useCallSession } from '../context/CallSessionContext';

interface AppSettings {
  model: string;
  temperature: string;
  thinkingMode: boolean;
  systemPrompt: string;
  maxTokens: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
  autoRecord: boolean;
  sampleRate: string;
  telephonyProvider: string;
  webhookUrl: string;
  googleCalendar: boolean;
  hubspotCrm: boolean;
  salesforceCrm: boolean;
  zendeskSupport: boolean;
  zapierSync: boolean;
  emailAlerts: boolean;
  urgentSmsAlerts: boolean;
  sentimentAlertThreshold: number;
  soundAlerts: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  model: 'neural-voice-pro',
  temperature: '0.3',
  thinkingMode: true,
  systemPrompt: 'You are an elite, polite enterprise AI Receptionist and Speech Analyzer for incoming customer telephony calls. Extract actionable caller metadata, intent, sentiment, diarized segments, and next steps with high precision.',
  maxTokens: 4096,
  noiseSuppression: true,
  echoCancellation: true,
  autoRecord: true,
  sampleRate: '16000',
  telephonyProvider: 'twilio',
  webhookUrl: 'https://api.voicedesk.ai/v1/telephony/webhook',
  googleCalendar: true,
  hubspotCrm: true,
  salesforceCrm: false,
  zendeskSupport: false,
  zapierSync: true,
  emailAlerts: true,
  urgentSmsAlerts: true,
  sentimentAlertThreshold: 30,
  soundAlerts: true,
};

const SETTINGS_STORAGE_KEY = 'voicedesk_settings_v1';

export const SettingsView: React.FC = () => {
  const { calls, clearSessionHistory, loadSampleCalls } = useCallSession();
  const [activeTab, setActiveTab] = useState<'ai' | 'audio' | 'integrations' | 'storage' | 'notifications' | 'account'>('ai');
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [savedStatus, setSavedStatus] = useState(false);
  const [clearedMessage, setClearedMessage] = useState(false);
  const [loadedDemoMessage, setLoadedDemoMessage] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [webhookTesting, setWebhookTesting] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; latency: number } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings to localStorage:', e);
    }
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    } catch {
      // ignore
    }
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleClearData = () => {
    clearSessionHistory();
    setClearedMessage(true);
    setTimeout(() => setClearedMessage(false), 3000);
  };

  const handleLoadDemoCalls = () => {
    loadSampleCalls();
    setLoadedDemoMessage(true);
    setTimeout(() => setLoadedDemoMessage(false), 3000);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('vd_live_key_902183921098231092');
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2500);
  };

  const handleTestWebhook = () => {
    setWebhookTesting(true);
    setWebhookTestResult(null);
    setTimeout(() => {
      setWebhookTesting(false);
      setWebhookTestResult({
        success: true,
        latency: Math.floor(45 + Math.random() * 35),
      });
      setTimeout(() => setWebhookTestResult(null), 5000);
    }, 900);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(calls, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `voicedesk_calls_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    if (calls.length === 0) return;
    const headers = ['ID', 'Caller Name', 'Company', 'Phone', 'Sentiment Score', 'Urgency', 'Intent', 'Call Duration', 'Timestamp'];
    const rows = calls.map(c => [
      c.id,
      `"${c.caller_name || ''}"`,
      `"${c.company_name || ''}"`,
      `"${c.phone_number || ''}"`,
      c.sentiment_score ?? '',
      c.urgency_level || '',
      `"${c.primary_intent || ''}"`,
      c.call_duration_seconds || '',
      c.timestamp || '',
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `voicedesk_calls_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8ff] text-[#191b23] space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-3xl font-bold text-[#191b23]">System Settings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              ● All Systems Operational
            </span>
          </div>
          <p className="font-body-md text-sm text-[#434655] mt-1">Configure AI engine models, audio streams, CRM integrations, alert triggers, and browser storage persistence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-[#c3c6d7]/50 text-xs font-semibold text-[#434655] hover:bg-[#f3f3fe] transition-colors"
          >
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            className="ai-gradient-bg text-white px-6 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">
              {savedStatus ? 'check_circle' : 'save'}
            </span>
            {savedStatus ? 'Saved to Browser!' : 'Save Preferences'}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#c3c6d7]/30 space-x-2 sm:space-x-6 text-sm font-semibold overflow-x-auto pb-1">
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
          Audio &amp; Telephony
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
          onClick={() => setActiveTab('notifications')}
          className={`pb-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'notifications' ? 'border-[#004ac6] text-[#004ac6]' : 'border-transparent text-[#434655] hover:text-[#191b23]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">notifications_active</span>
          Alerts &amp; Escalation
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
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#c3c6d7]/30 shadow-sm space-y-6">
        {/* Tab 1: AI Model */}
        {activeTab === 'ai' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-lg text-[#191b23]">AI Reception &amp; Intelligence Engine</h3>
              <p className="text-xs text-[#434655] mt-1">Configure the underlying Google Gemini multimodal reasoning pipeline and prompt hyperparameters.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Primary Model Engine</label>
                <select 
                  value={settings.model} 
                  onChange={(e) => updateSetting('model', e.target.value)}
                  className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#004ac6]"
                >
                  <option value="neural-voice-pro">Gemini 3.8 Flash (Recommended - Multimodal &amp; Diarization)</option>
                  <option value="neural-voice-flash">Gemini 3.5 Flash (Ultra-Low Latency Telephony)</option>
                  <option value="neural-voice-ultra">Gemini 3.5 Pro (Deep Structured Reasoning)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Max Generation Tokens</label>
                <select 
                  value={settings.maxTokens} 
                  onChange={(e) => updateSetting('maxTokens', Number(e.target.value))}
                  className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#004ac6]"
                >
                  <option value={2048}>2,048 Tokens (Fast Telephony Response)</option>
                  <option value={4096}>4,096 Tokens (Standard Analysis)</option>
                  <option value={8192}>8,192 Tokens (Detailed Diarization &amp; Action Items)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#434655]">
                <span>Temperature / Creativity Control</span>
                <span className="font-mono text-[#004ac6] font-bold">{settings.temperature}</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="1.0" 
                step="0.05" 
                value={settings.temperature} 
                onChange={(e) => updateSetting('temperature', e.target.value)}
                className="w-full accent-[#004ac6]" 
              />
              <div className="flex justify-between text-[11px] text-[#747688]">
                <span>0.0 (Deterministic / Strict Structured Output)</span>
                <span>0.5 (Balanced)</span>
                <span>1.0 (Creative Context Exploration)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Extended Thinking / Reasoning Mode</p>
                <p className="text-xs text-[#434655]">Enable multi-step intent verification and sentiment cross-checking before returning output.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.thinkingMode} 
                onChange={(e) => updateSetting('thinkingMode', e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">System Prompt Guidance</label>
              <textarea 
                rows={3}
                value={settings.systemPrompt} 
                onChange={(e) => updateSetting('systemPrompt', e.target.value)}
                className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-xs font-mono text-[#191b23] focus:outline-none focus:border-[#004ac6] leading-relaxed" 
              />
            </div>
          </div>
        )}

        {/* Tab 2: Audio & Telephony */}
        {activeTab === 'audio' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-lg text-[#191b23]">Real-time Audio &amp; Telephony Stream</h3>
              <p className="text-xs text-[#434655] mt-1">Configure audio ingest codecs, noise filters, and VoIP telephony SIP connectors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Telephony SIP / WebRTC Provider</label>
                <select 
                  value={settings.telephonyProvider} 
                  onChange={(e) => updateSetting('telephonyProvider', e.target.value)}
                  className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#004ac6]"
                >
                  <option value="twilio">Twilio Voice / SIP Trunk</option>
                  <option value="vonage">Vonage (Nexmo) WebRTC</option>
                  <option value="genesys">Genesys Cloud Audio Connector</option>
                  <option value="plivo">Plivo SIP Ingestion</option>
                  <option value="custom">Custom WebRTC / Browser Stream</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Audio Sampling Rate</label>
                <select 
                  value={settings.sampleRate} 
                  onChange={(e) => updateSetting('sampleRate', e.target.value)}
                  className="w-full p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-sm font-medium focus:outline-none focus:border-[#004ac6]"
                >
                  <option value="8000">8,000 Hz (PSTN / Standard Telephony)</option>
                  <option value="16000">16,000 Hz (HD Voice &amp; AI Speech Standard)</option>
                  <option value="44100">44,100 Hz (High Fidelity Studio)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Background Noise Suppression</p>
                <p className="text-xs text-[#434655]">Removes background HVAC hum, keyboard clatter, and ambient office noise before AI tokenization.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.noiseSuppression} 
                onChange={(e) => updateSetting('noiseSuppression', e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Acoustic Echo Cancellation (AEC)</p>
                <p className="text-xs text-[#434655]">Eliminates speaker feedback and acoustic loopback during live microphone input.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.echoCancellation} 
                onChange={(e) => updateSetting('echoCancellation', e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Auto-Start Recording on Mic Access</p>
                <p className="text-xs text-[#434655]">Immediately begin audio stream buffer once microphone permission is granted.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.autoRecord} 
                onChange={(e) => updateSetting('autoRecord', e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>
          </div>
        )}

        {/* Tab 3: Integrations & Webhooks */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-[#191b23]">Connected Platforms &amp; Webhooks</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Prototype UI
                </span>
              </div>
              <p className="text-xs text-[#434655] mt-1">Configure prototype webhook URLs and simulated CRM dispatch connectors.</p>
            </div>

            <div className="space-y-3">
              {/* Google Calendar */}
              <div className="p-4 border border-[#c3c6d7]/30 rounded-xl flex items-center justify-between hover:bg-[#faf8ff] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">calendar_today</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#191b23]">Google Calendar Sync</p>
                    <p className="text-xs text-[#434655]">Auto-book appointments when caller intent includes meeting requests.</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('googleCalendar', !settings.googleCalendar)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.googleCalendar 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {settings.googleCalendar ? '● ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* HubSpot */}
              <div className="p-4 border border-[#c3c6d7]/30 rounded-xl flex items-center justify-between hover:bg-[#faf8ff] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">hub</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#191b23]">HubSpot CRM</p>
                    <p className="text-xs text-[#434655]">Create/update contact lead cards and attach AI call summaries.</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('hubspotCrm', !settings.hubspotCrm)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.hubspotCrm 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {settings.hubspotCrm ? '● ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Salesforce */}
              <div className="p-4 border border-[#c3c6d7]/30 rounded-xl flex items-center justify-between hover:bg-[#faf8ff] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">cloud</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#191b23]">Salesforce Sales Cloud</p>
                    <p className="text-xs text-[#434655]">Sync call transcripts and urgent action items directly into CRM opportunities.</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('salesforceCrm', !settings.salesforceCrm)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.salesforceCrm 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {settings.salesforceCrm ? '● ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Zendesk */}
              <div className="p-4 border border-[#c3c6d7]/30 rounded-xl flex items-center justify-between hover:bg-[#faf8ff] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#191b23]">Zendesk Support Suite</p>
                    <p className="text-xs text-[#434655]">Auto-generate support tickets for negative sentiment or billing complaint calls.</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('zendeskSupport', !settings.zendeskSupport)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.zendeskSupport 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {settings.zendeskSupport ? '● ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Zapier */}
              <div className="p-4 border border-[#c3c6d7]/30 rounded-xl flex items-center justify-between hover:bg-[#faf8ff] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#191b23]">Zapier Webhooks</p>
                    <p className="text-xs text-[#434655]">Trigger custom multi-step Zaps (Slack notifications, Google Sheets rows, Asana tasks).</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting('zapierSync', !settings.zapierSync)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    settings.zapierSync 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {settings.zapierSync ? '● ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            {/* Webhook URL & Ping test */}
            <div className="space-y-3 pt-3 border-t border-[#c3c6d7]/30">
              <label className="text-xs font-bold uppercase tracking-wider text-[#434655]">Outbound Event Webhook URL (Prototype)</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  value={settings.webhookUrl} 
                  onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                  className="flex-1 p-3 bg-[#f3f3fe] border border-[#c3c6d7]/40 rounded-xl text-xs font-mono focus:outline-none focus:border-[#004ac6]" 
                />
                <button
                  onClick={handleTestWebhook}
                  disabled={webhookTesting}
                  className="px-4 py-2.5 bg-[#191b23] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span className="material-symbols-outlined text-sm">
                    {webhookTesting ? 'sync' : 'send'}
                  </span>
                  {webhookTesting ? 'Testing...' : 'Test Ping'}
                </button>
              </div>
              {webhookTestResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-base">check_circle</span>
                    <span>Simulated Webhook endpoint ping OK</span>
                  </div>
                  <span className="font-mono font-bold">{webhookTestResult.latency} ms</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Alerts & Escalation */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-lg text-[#191b23]">Alerts &amp; Escalation Thresholds</h3>
              <p className="text-xs text-[#434655] mt-1">Configure automated notifications and SMS alerts when high-risk sentiment or urgent calls are detected.</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Urgent SMS Escalation</p>
                <p className="text-xs text-[#434655]">Send immediate SMS dispatch to manager when a call is flagged with 'Urgent' priority.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.urgentSmsAlerts} 
                onChange={(e) => updateSetting('urgentSmsAlerts', e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Daily Digest &amp; Email Summaries</p>
                <p className="text-xs text-[#434655]">Receive structured executive summaries and top customer pain points every morning.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.emailAlerts} 
                onChange={(e) => updateSetting('emailAlerts', e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30">
              <div>
                <p className="font-bold text-sm text-[#191b23]">Audible Alert Chime in Dashboard</p>
                <p className="text-xs text-[#434655]">Play an alert chime when a caller expresses negative sentiment.</p>
              </div>
              <input 
                type="checkbox" 
                checked={settings.soundAlerts} 
                onChange={(e) => updateSetting('soundAlerts', e.target.checked)}
                className="w-5 h-5 accent-[#004ac6] cursor-pointer" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#434655]">
                <span>Sentiment Escalation Trigger Level</span>
                <span className="font-mono text-red-600 font-bold">&lt; {settings.sentimentAlertThreshold}% Sentiment</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="60" 
                step="5" 
                value={settings.sentimentAlertThreshold} 
                onChange={(e) => updateSetting('sentimentAlertThreshold', Number(e.target.value))}
                className="w-full accent-red-600" 
              />
              <p className="text-[11px] text-[#747688]">Calls scoring below {settings.sentimentAlertThreshold}% sentiment will trigger immediate supervisor review tags.</p>
            </div>
          </div>
        )}

        {/* Tab 5: Storage */}
        {activeTab === 'storage' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-lg text-[#191b23]">Browser LocalStorage &amp; Data Control</h3>
              <p className="text-xs text-[#434655] mt-1">All call analysis results, transcripts, entity extractions, and summaries are preserved locally in your browser storage (LocalStorage). No external database retains your confidential audio data without your permission.</p>
            </div>

            <div className="p-4 bg-[#f3f3fe] rounded-xl border border-[#c3c6d7]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
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

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#434655]">Storage Actions &amp; Backup</h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleExportJSON}
                  disabled={calls.length === 0}
                  className="px-4 py-2.5 bg-white border border-[#c3c6d7]/40 text-[#191b23] rounded-xl text-xs font-semibold hover:bg-[#f3f3fe] disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base text-[#004ac6]">download</span>
                  Export All (JSON)
                </button>

                <button
                  onClick={handleExportCSV}
                  disabled={calls.length === 0}
                  className="px-4 py-2.5 bg-white border border-[#c3c6d7]/40 text-[#191b23] rounded-xl text-xs font-semibold hover:bg-[#f3f3fe] disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-base text-emerald-600">table_view</span>
                  Export Calls (CSV)
                </button>

                <button
                  onClick={handleLoadDemoCalls}
                  className="px-4 py-2.5 bg-[#004ac6]/10 text-[#004ac6] border border-[#004ac6]/20 rounded-xl text-xs font-semibold hover:bg-[#004ac6]/20 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">dataset</span>
                  {loadedDemoMessage ? 'Demo Data Loaded!' : 'Populate 5 Demo Sample Calls'}
                </button>

                <button
                  onClick={handleClearData}
                  disabled={calls.length === 0}
                  className="px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold hover:bg-red-100 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">delete_sweep</span>
                  {clearedMessage ? 'Storage Wiped!' : 'Wipe Browser LocalStorage'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Account */}
        {activeTab === 'account' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-bold text-lg text-[#191b23]">Account Subscription &amp; API Configuration</h3>
              <p className="text-xs text-[#434655] mt-1">Manage API pipeline configurations, deployment tiers, and server-side model credentials.</p>
            </div>

            <div className="p-6 bg-[#f3f3fe] rounded-2xl border border-[#004ac6]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="px-2.5 py-1 bg-[#004ac6] text-white rounded-md text-[10px] font-bold uppercase tracking-wider">Current Plan</span>
                <h4 className="font-bold text-xl text-[#191b23] mt-2">Enterprise Pro Tier (2026)</h4>
                <p className="text-xs text-[#434655]">Multimodal Audio Intelligence • Google Gemini 3.8 Flash Core</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                  ACTIVE &amp; READY
                </span>
              </div>
            </div>

            <div className="p-5 bg-white border border-[#c3c6d7]/40 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#004ac6]">shield</span>
                  <span className="font-bold text-sm text-[#191b23]">Gemini API Key Security</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  Protected Server-Side
                </span>
              </div>
              <p className="text-xs text-[#434655] leading-relaxed">
                Your Google Gemini API credential is securely stored in backend environment variables (<code className="bg-[#f3f3fe] px-1.5 py-0.5 rounded font-mono text-[11px]">process.env.GEMINI_API_KEY</code>) and proxied through <code className="bg-[#f3f3fe] px-1.5 py-0.5 rounded font-mono text-[11px]">/api/analyze</code>. No raw secrets are bundled into client-side JavaScript.
              </p>
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
