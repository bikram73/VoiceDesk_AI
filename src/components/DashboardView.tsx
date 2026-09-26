import React, { useState } from 'react';
import { useCallSession } from '../context/CallSessionContext';
import { CallAnalysis } from '../types';

interface DashboardViewProps {
  onNewAnalysis: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNewAnalysis }) => {
  const { calls, activeCall, setActiveCall, deleteCall, clearSessionHistory, loadSampleCalls, storageStats, stats } = useCallSession();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntentFilter, setSelectedIntentFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [copiedTranscript, setCopiedTranscript] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filtered Calls list
  const filteredCalls = calls.filter((c) => {
    const matchesSearch = 
      c.caller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.short_summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIntent = selectedIntentFilter === 'ALL' || c.intent === selectedIntentFilter;
    const matchesPriority = selectedPriorityFilter === 'ALL' || c.priority === selectedPriorityFilter;

    return matchesSearch && matchesIntent && matchesPriority;
  });

  // Copy active call transcript to clipboard
  const handleCopyTranscript = () => {
    if (!activeCall) return;
    const fullText = activeCall.transcript
      .map((t) => `[${t.timestamp || '00:00'}] ${t.speaker}: ${t.text}`)
      .join('\n');
    navigator.clipboard.writeText(fullText);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  // Export session data as JSON file
  const handleExportJSON = () => {
    if (calls.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(calls, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `voicedesk_storage_calls_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export session data as CSV file
  const handleExportCSV = () => {
    if (calls.length === 0) return;
    const headers = ["ID", "Caller Name", "Company", "Phone", "Email", "Intent", "Priority", "Sentiment", "Service", "Appointment Date", "Time", "Next Action", "Short Summary"];
    const rows = calls.map(c => [
      c.id,
      `"${c.caller_name}"`,
      `"${c.company_name}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      `"${c.intent}"`,
      `"${c.priority}"`,
      `"${c.sentiment}"`,
      `"${c.service}"`,
      `"${c.appointment_date}"`,
      `"${c.meeting_time}"`,
      `"${c.next_action}"`,
      `"${c.short_summary.replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `voicedesk_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Get Priority Badge Color
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Low':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get Sentiment Badge Color
  const getSentimentBadgeClass = (sentiment: string) => {
    switch (sentiment) {
      case 'Happy':
      case 'Interested':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Angry':
      case 'Frustrated':
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Neutral':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8ff] text-[#191b23] space-y-8">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-headline-lg text-3xl font-bold text-[#191b23]">Results Dashboard</h1>
            {calls.length > 0 ? (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LOCAL STORAGE ACTIVE ({calls.length} SAVED {calls.length === 1 ? 'CALL' : 'CALLS'})
              </span>
            ) : (
              <span className="px-3 py-1 bg-[#57dffe]/20 text-[#006172] rounded-full text-xs font-semibold flex items-center gap-1.5 border border-[#57dffe]/40">
                <span className="w-2 h-2 rounded-full bg-[#00687a]"></span>
                LOCAL STORAGE READY (0 SAVED)
              </span>
            )}
          </div>
          <p className="font-body-md text-sm text-[#434655] mt-1">
            Real-time telephonic intelligence, structured parameters &amp; smart summaries stored securely in your browser cache/localStorage.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {calls.length > 0 && (
            <>
              <button 
                onClick={handleExportCSV}
                className="bg-white text-[#191b23] border border-[#c3c6d7] px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#f3f3fe] transition-all flex items-center gap-1.5 shadow-xs"
                title="Export all saved records as CSV"
              >
                <span className="material-symbols-outlined text-base">download</span>
                CSV
              </button>
              <button 
                onClick={handleExportJSON}
                className="bg-white text-[#191b23] border border-[#c3c6d7] px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#f3f3fe] transition-all flex items-center gap-1.5 shadow-xs"
                title="Export all saved records as JSON"
              >
                <span className="material-symbols-outlined text-base">code</span>
                JSON
              </button>
              {showClearConfirm ? (
                <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
                  <span className="text-[11px] text-red-700 px-2 font-medium">Clear all?</span>
                  <button
                    onClick={() => {
                      clearSessionHistory();
                      setShowClearConfirm(false);
                    }}
                    className="bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="bg-white text-red-600 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  title="Clear all saved calls from localStorage"
                >
                  <span className="material-symbols-outlined text-sm">delete_sweep</span>
                  Clear Storage
                </button>
              )}
            </>
          )}

          <button 
            onClick={onNewAnalysis}
            className="ai-gradient-bg text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            Run Voice Analyzer
          </button>
        </div>
      </header>

      {/* Top Summary Stats Grid (6 Cards based on PRD requirements) */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Stat 1 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Calls</span>
            <span className="material-symbols-outlined text-lg text-[#004ac6]">call</span>
          </div>
          <div className="text-2xl font-bold font-headline-md text-[#191b23]">{stats.totalCalls}</div>
          <div className="text-[11px] text-[#434655] font-medium">In LocalStorage</div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-[10px] font-bold uppercase tracking-wider">High Priority</span>
            <span className="material-symbols-outlined text-lg text-[#ba1a1a]">warning</span>
          </div>
          <div className="text-2xl font-bold font-headline-md text-[#ba1a1a]">{stats.highPriorityCalls}</div>
          <div className="text-[11px] text-[#ba1a1a] font-semibold">Immediate Action</div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Appointments</span>
            <span className="material-symbols-outlined text-lg text-[#00687a]">event_available</span>
          </div>
          <div className="text-2xl font-bold font-headline-md text-[#191b23]">{stats.appointmentRequests}</div>
          <div className="text-[11px] text-[#00687a] font-semibold">Requested Slots</div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Complaints</span>
            <span className="material-symbols-outlined text-lg text-red-600">report_problem</span>
          </div>
          <div className="text-2xl font-bold font-headline-md text-[#191b23]">{stats.complaints}</div>
          <div className="text-[11px] text-red-600 font-semibold">Requires Review</div>
        </div>

        {/* Stat 5 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sales Leads</span>
            <span className="material-symbols-outlined text-lg text-indigo-600">payments</span>
          </div>
          <div className="text-2xl font-bold font-headline-md text-[#191b23]">{stats.salesInquiries}</div>
          <div className="text-[11px] text-indigo-600 font-semibold">Sales Pipeline</div>
        </div>

        {/* Stat 6 */}
        <div className="bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs space-y-1">
          <div className="flex justify-between items-center text-[#434655]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Support Calls</span>
            <span className="material-symbols-outlined text-lg text-[#2563eb]">support_agent</span>
          </div>
          <div className="text-2xl font-bold font-headline-md text-[#191b23]">{stats.supportRequests}</div>
          <div className="text-[11px] text-[#434655]">Technical / Inquiries</div>
        </div>
      </section>

      {/* Main Analysis View for Selected Active Call OR Initial Empty State */}
      {calls.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 md:p-14 border border-[#c3c6d7]/30 shadow-sm text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              analytics
            </span>
          </div>
          
          <div className="max-w-lg space-y-2">
            <h2 className="text-2xl font-bold text-[#191b23]">No Call Analyses in Browser Storage</h2>
            <p className="text-sm text-[#434655] leading-relaxed">
              When you record a call, upload audio, or analyze a transcript, the structured results, summaries, and action recommendations will automatically be saved in your browser&apos;s local storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNewAnalysis}
              className="ai-gradient-bg text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-base">mic</span>
              <span>Open Voice Analyzer</span>
            </button>

            <button
              onClick={loadSampleCalls}
              className="bg-[#f3f3fe] text-[#004ac6] border border-[#004ac6]/20 hover:bg-[#e7e7f3] px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-base">dataset</span>
              <span>Load 5 Demo Sample Calls</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#c3c6d7]/20 flex items-center gap-2 text-xs text-[#737686]">
            <span className="material-symbols-outlined text-base text-emerald-600">lock</span>
            <span>All processed data stays strictly in your browser (LocalStorage / Cache)</span>
          </div>
        </div>
      ) : activeCall ? (
        <div className="space-y-6">
          {/* Active Call Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#dbe1ff] text-[#004ac6] flex items-center justify-center font-bold text-xl flex-shrink-0">
                {activeCall.caller_name.split(' ').map(n => n[0]).join('') || 'US'}
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-bold text-xl text-[#191b23]">{activeCall.caller_name}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadgeClass(activeCall.priority)}`}>
                    {activeCall.priority} Priority
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#004ac6]/10 text-[#004ac6] rounded-full text-xs font-semibold border border-[#004ac6]/20">
                    {activeCall.intent}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSentimentBadgeClass(activeCall.sentiment)}`}>
                    Sentiment: {activeCall.sentiment} ({activeCall.sentiment_score}%)
                  </span>
                </div>
                <p className="text-xs text-[#434655] mt-1">
                  {activeCall.company_name && activeCall.company_name !== 'N/A' && <span className="font-semibold text-[#191b23] mr-2">{activeCall.company_name} •</span>}
                  <span>{activeCall.phone || 'No phone'}</span> • <span>{activeCall.email || 'No email'}</span> • <span>Duration: {activeCall.duration}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs font-mono text-[#737686] bg-[#f3f3fe] px-2.5 py-1 rounded-md border border-[#c3c6d7]/30">
                {activeCall.id}
              </span>
              <button 
                onClick={() => deleteCall(activeCall.id)}
                className="p-2 text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors text-xs flex items-center gap-1 font-semibold"
                title="Delete Call from Session & LocalStorage"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Remove
              </button>
            </div>
          </div>

          {/* Extracted Structured Details Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#c3c6d7]/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">Requested Service</span>
              <p className="text-sm font-semibold text-[#191b23]">{activeCall.service || 'General Inquiry'}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#c3c6d7]/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">Appointment Request</span>
              <p className="text-sm font-semibold text-[#00687a]">
                {activeCall.appointment_date && activeCall.appointment_date !== 'N/A' 
                  ? `${activeCall.appointment_date} ${activeCall.meeting_time && activeCall.meeting_time !== 'N/A' ? `@ ${activeCall.meeting_time}` : ''}` 
                  : 'No appointment requested'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#c3c6d7]/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">Callback Requested</span>
              <p className="text-sm font-semibold text-[#191b23]">
                {activeCall.callback_requested ? 'Yes - Immediate Callback Needed' : 'No Callback Requested'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#c3c6d7]/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">Products/Topics Mentioned</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeCall.products_mentioned && activeCall.products_mentioned.length > 0 ? (
                  activeCall.products_mentioned.map((p, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#f3f3fe] text-[#004ac6] rounded text-[10px] font-semibold border border-[#c3c6d7]/30">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-[#737686]">None mentioned</span>
                )}
              </div>
            </div>
          </section>

          {/* AI Executive Summary & Action Recommendation */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Short & Detailed Summaries */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#c3c6d7]/20">
                <span className="material-symbols-outlined text-[#004ac6]">auto_awesome</span>
                <h3 className="font-bold text-base text-[#191b23]">AI Call Summary</h3>
              </div>
              
              <div className="space-y-3">
                <div className="bg-[#f3f3fe] p-3.5 rounded-xl border border-[#c3c6d7]/30">
                  <span className="text-[10px] font-bold text-[#004ac6] uppercase tracking-wider block mb-1">Executive Highlight</span>
                  <p className="text-sm font-medium text-[#191b23] leading-relaxed">{activeCall.short_summary}</p>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider block mb-1">Comprehensive Overview</span>
                  <p className="text-xs text-[#434655] leading-relaxed whitespace-pre-line">{activeCall.detailed_summary}</p>
                </div>
              </div>
            </div>

            {/* Next Action & Workflow Automation */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d7]/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ba1a1a]">task_alt</span>
                    <h3 className="font-bold text-base text-[#191b23]">Recommended Next Action</h3>
                  </div>
                  <span className="text-[11px] bg-red-50 text-[#ba1a1a] font-bold px-2 py-0.5 rounded-full border border-red-200">
                    Actionable Item
                  </span>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100 space-y-2">
                  <p className="text-sm font-semibold text-[#191b23] flex items-start gap-2">
                    <span className="material-symbols-outlined text-base text-[#004ac6] mt-0.5">arrow_right_alt</span>
                    {activeCall.next_action}
                  </p>
                  <p className="text-xs text-[#434655] pl-6">
                    {activeCall.follow_up_needed ? 'Follow-up flag is TRUE. Ticket created for team response.' : 'Standard resolution complete. No urgent ticket required.'}
                  </p>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="pt-4 border-t border-[#c3c6d7]/20 flex flex-wrap gap-2">
                <button 
                  onClick={() => alert(`Initiating CRM Dispatch for ${activeCall.caller_name} (${activeCall.phone})`)}
                  className="px-3.5 py-2 bg-[#004ac6] text-white text-xs font-semibold rounded-xl hover:bg-[#003da6] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  Dispatch to CRM
                </button>
                <button 
                  onClick={() => alert(`Email follow-up queued to ${activeCall.email}`)}
                  className="px-3.5 py-2 bg-[#f3f3fe] text-[#004ac6] text-xs font-semibold rounded-xl hover:bg-[#e7e7f3] transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  Send Email Note
                </button>
              </div>
            </div>
          </section>

          {/* Full Conversation Transcript with Timestamp Viewer */}
          <section className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#c3c6d7]/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#004ac6]">forum</span>
                <h3 className="font-bold text-base text-[#191b23]">Dialogue &amp; Speaker Breakdown</h3>
              </div>

              <button 
                onClick={handleCopyTranscript}
                className="text-xs text-[#004ac6] font-semibold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                {copiedTranscript ? 'Copied to Clipboard!' : 'Copy Transcript'}
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {activeCall.transcript && activeCall.transcript.length > 0 ? (
                activeCall.transcript.map((line, idx) => {
                  const isCaller = line.speaker.toLowerCase().includes('caller') || line.speaker.toLowerCase().includes('customer') || line.speaker.toLowerCase().includes('client');
                  return (
                    <div 
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                        isCaller 
                          ? 'bg-[#faf8ff] border-[#c3c6d7]/30 text-[#191b23]' 
                          : 'bg-[#f3f3fe] border-[#004ac6]/20 text-[#004ac6]'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[#737686] bg-white px-2 py-0.5 rounded border border-[#c3c6d7]/30 mt-0.5 flex-shrink-0">
                        {line.timestamp || `00:${idx < 10 ? '0' + idx * 5 : idx * 5}`}
                      </span>
                      <div>
                        <span className={`font-bold text-[11px] block mb-0.5 ${isCaller ? 'text-[#191b23]' : 'text-[#004ac6]'}`}>
                          {line.speaker}:
                        </span>
                        <p className="text-[#434655]">{line.text}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-[#737686] italic text-center py-4">No transcript turns available for this recording.</div>
              )}
            </div>
          </section>
        </div>
      ) : null}

      {/* Session History Table with Search & Filter */}
      {calls.length > 0 && (
        <section className="bg-white rounded-2xl border border-[#c3c6d7]/30 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#c3c6d7]/20 space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#191b23]">Stored Call History</h3>
                <p className="text-xs text-[#737686]">Analyzed calls stored in browser localStorage ({filteredCalls.length} items)</p>
              </div>

              {/* Search Input */}
              <div className="relative min-w-[240px]">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#737686] text-sm">search</span>
                <input 
                  type="text"
                  placeholder="Search caller, company, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf8ff] border border-[#c3c6d7]/40 rounded-xl focus:outline-none focus:border-[#004ac6]"
                />
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="font-semibold text-[#434655]">Filter Intent:</span>
              <select 
                value={selectedIntentFilter}
                onChange={(e) => setSelectedIntentFilter(e.target.value)}
                className="bg-[#f3f3fe] border border-[#c3c6d7]/40 px-3 py-1.5 rounded-lg font-medium text-[#191b23] focus:outline-none"
              >
                <option value="ALL">All Intents</option>
                <option value="Appointment Booking">Appointment Booking</option>
                <option value="Sales Inquiry">Sales Inquiry</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Billing Issue">Billing Issue</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Callback Request">Callback Request</option>
                <option value="Complaint">Complaint</option>
              </select>

              <span className="font-semibold text-[#434655] ml-2">Priority:</span>
              <select 
                value={selectedPriorityFilter}
                onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                className="bg-[#f3f3fe] border border-[#c3c6d7]/40 px-3 py-1.5 rounded-lg font-medium text-[#191b23] focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f3f3fe] text-[#434655] text-[11px] font-semibold uppercase tracking-wider">
                  <th className="p-4">Call ID</th>
                  <th className="p-4">Caller Name</th>
                  <th className="p-4">Intent</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Sentiment</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Date &amp; Time</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c6d7]/20 text-xs">
                {filteredCalls.length > 0 ? (
                  filteredCalls.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => setActiveCall(c)}
                      className={`hover:bg-[#faf8ff] transition-colors cursor-pointer ${
                        activeCall?.id === c.id ? 'bg-[#004ac6]/5 font-semibold' : ''
                      }`}
                    >
                      <td className="p-4 font-mono text-[#004ac6] font-bold">{c.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-[#191b23]">{c.caller_name}</div>
                        {c.company_name && c.company_name !== 'N/A' && <div className="text-[10px] text-[#737686]">{c.company_name}</div>}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[#004ac6]/10 text-[#004ac6] rounded-full font-semibold border border-[#004ac6]/20">
                          {c.intent}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-semibold border ${getPriorityBadgeClass(c.priority)}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full font-semibold border ${getSentimentBadgeClass(c.sentiment)}`}>
                          {c.sentiment} ({c.sentiment_score}%)
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[#434655]">{c.duration}</td>
                      <td className="p-4 text-[#737686] text-[11px]">{c.date_time}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCall(c);
                          }}
                          className="text-[#004ac6] font-bold hover:underline text-xs mr-3"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCall(c.id);
                          }}
                          className="text-[#ba1a1a] hover:opacity-80"
                          title="Delete call from local storage"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-[#737686] italic text-xs">
                      No calls match your filter criteria or search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full py-6 mt-12 bg-[#e1e2ed] flex flex-col md:flex-row justify-between items-center px-6 rounded-xl gap-4">
        <p className="text-[#434655] font-body-sm text-xs">© 2026 VoiceDesk AI. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <a
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-[#f3f3fe] text-[#191b23] border border-[#c3c6d7]/40 rounded-xl text-xs font-bold transition-all shadow-2xs"
            href="https://github.com/bikram73/VoiceDesk_AI"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-4 h-4 fill-current text-[#191b23]" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub Repo</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
