import React, { useState } from 'react';
import { useCallSession } from '../context/CallSessionContext';
import { CallAnalysis } from '../types';

interface DashboardViewProps {
  onNewAnalysis: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNewAnalysis }) => {
  const { calls, activeCall, setActiveCall, deleteCall, stats } = useCallSession();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntentFilter, setSelectedIntentFilter] = useState<string>('ALL');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('ALL');
  const [copiedTranscript, setCopiedTranscript] = useState(false);

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
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(calls, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `voicedesk_session_calls_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export session data as CSV file
  const handleExportCSV = () => {
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
          <div className="flex items-center gap-3">
            <h1 className="font-headline-lg text-3xl font-bold text-[#191b23]">Results Dashboard</h1>
            <span className="px-3 py-1 bg-[#57dffe]/20 text-[#006172] rounded-full text-xs font-semibold flex items-center gap-1.5 border border-[#57dffe]/40">
              <span className="w-2 h-2 rounded-full bg-[#00687a] animate-pulse"></span>
              SESSION ANALYTICS ACTIVE
            </span>
          </div>
          <p className="font-body-md text-sm text-[#434655] mt-1">Real-time telephonic intelligence, call insights, structured field extractions &amp; summaries.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="bg-white text-[#191b23] border border-[#c3c6d7] px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#f3f3fe] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">download</span>
            CSV
          </button>
          <button 
            onClick={handleExportJSON}
            className="bg-white text-[#191b23] border border-[#c3c6d7] px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#f3f3fe] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-base">code</span>
            JSON
          </button>
          <button 
            onClick={onNewAnalysis}
            className="ai-gradient-bg text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            Run New Analysis
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
          <div className="text-[11px] text-[#434655] font-medium">Current Session</div>
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

      {/* Main Analysis View for Selected Active Call */}
      {activeCall ? (
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
                  {activeCall.company_name !== 'N/A' && <span className="font-semibold text-[#191b23] mr-2">{activeCall.company_name} •</span>}
                  <span>{activeCall.phone}</span> • <span>{activeCall.email}</span> • <span>Duration: {activeCall.duration}</span>
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
                title="Delete Call from Session"
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
              <p className="text-sm font-semibold text-[#191b23]">{activeCall.service}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#c3c6d7]/20 shadow-xs space-y-1">
              <span className="text-[10px] font-bold text-[#434655] uppercase tracking-wider">Appointment Request</span>
              <p className="text-sm font-semibold text-[#00687a]">
                {activeCall.appointment_date !== 'N/A' ? `${activeCall.appointment_date} @ ${activeCall.meeting_time}` : 'No appointment requested'}
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
                {activeCall.products_mentioned.length > 0 ? (
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
                <h3 className="font-bold text-lg text-[#191b23]">AI Intelligent Call Summaries</h3>
              </div>

              <div className="bg-[#f3f3fe] p-4 rounded-xl border border-[#004ac6]/20 space-y-1">
                <h4 className="text-xs font-bold text-[#004ac6] uppercase tracking-wider">Short Summary</h4>
                <p className="text-sm text-[#191b23] leading-relaxed font-medium">
                  {activeCall.short_summary}
                </p>
              </div>

              <div className="p-4 bg-[#faf8ff] rounded-xl border border-[#c3c6d7]/30 space-y-1">
                <h4 className="text-xs font-bold text-[#434655] uppercase tracking-wider">Detailed Narrative Summary</h4>
                <p className="text-xs text-[#434655] leading-relaxed">
                  {activeCall.detailed_summary}
                </p>
              </div>

              {/* Next Action Box */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base text-emerald-700">task_alt</span>
                  Recommended Action Item
                </div>
                <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
                  {activeCall.next_action}
                </p>
              </div>
            </div>

            {/* Speaker Labeled Transcript */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d7]/20 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00687a]">subtitles</span>
                    <h3 className="font-bold text-lg text-[#191b23]">Speaker Labeled Transcript</h3>
                  </div>
                  <span className="text-xs text-[#737686] font-mono">{activeCall.transcript.length} turns</span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {activeCall.transcript.map((t, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-3 ${t.speaker === 'AI Receptionist' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                        t.speaker === 'AI Receptionist' ? 'bg-[#004ac6] text-white' : 'bg-[#dbe1ff] text-[#004ac6]'
                      }`}>
                        {t.speaker === 'AI Receptionist' ? 'AI' : activeCall.caller_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className={`p-3 rounded-2xl max-w-[85%] text-xs ${
                        t.speaker === 'AI Receptionist' 
                          ? 'bg-[#004ac6] text-white rounded-tr-none' 
                          : 'bg-[#f3f3fe] text-[#191b23] rounded-tl-none border border-[#c3c6d7]/20'
                      }`}>
                        <div className="flex justify-between items-center mb-1 gap-2">
                          <span className="font-bold">{t.speaker}</span>
                          {t.timestamp && <span className="text-[10px] opacity-75 font-mono">{t.timestamp}</span>}
                        </div>
                        <p className="leading-relaxed">{t.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button 
                  onClick={handleCopyTranscript}
                  className="w-full py-2 border border-[#004ac6] text-[#004ac6] rounded-xl text-xs font-bold hover:bg-[#004ac6]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  {copiedTranscript ? 'Transcript Copied to Clipboard!' : 'Copy Full Transcript'}
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-[#c3c6d7]/30 text-center space-y-4">
          <span className="material-symbols-outlined text-4xl text-[#004ac6]">graphic_eq</span>
          <h3 className="font-bold text-lg">No Call Selected</h3>
          <p className="text-xs text-[#434655]">Select a call from the history below or record/upload a new voice call to analyze.</p>
          <button onClick={onNewAnalysis} className="ai-gradient-bg text-white px-4 py-2 rounded-xl text-xs font-semibold">
            Record / Upload Call
          </button>
        </div>
      )}

      {/* Session History Table with Search & Filter */}
      <section className="bg-white rounded-2xl border border-[#c3c6d7]/30 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#c3c6d7]/20 space-y-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-[#191b23]">Current Session Call History</h3>
              <p className="text-xs text-[#737686]">Analyzed calls stored in browser memory for current session ({filteredCalls.length} items)</p>
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
                      {c.company_name !== 'N/A' && <div className="text-[10px] text-[#737686]">{c.company_name}</div>}
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
                        title="Delete call"
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

      {/* Footer */}
      <footer className="w-full py-6 mt-12 bg-[#e1e2ed] flex flex-col md:flex-row justify-between items-center px-6 rounded-xl">
        <p className="text-[#434655] font-body-sm text-xs">© 2026 VoiceDesk AI. All rights reserved.</p>
        <div className="flex gap-6 mt-2 md:mt-0">
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Privacy Policy</a>
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Terms of Service</a>
          <a className="text-[#434655] hover:text-[#004ac6] transition-colors text-xs" href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};
