import React, { useState } from 'react';

interface HomeViewProps {
  onLaunchApp: () => void;
  onAnalyzeCall: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onLaunchApp, onAnalyzeCall }) => {
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const demoScenarios = [
    {
      id: 'appointment',
      title: 'Dental Clinic Appointment',
      icon: 'calendar_month',
      category: 'Healthcare & Medical',
      urgency: 'Medium',
      transcript: `"Hello, my name is John Smith from Apex Dental. I would like to book a dental checkup tomorrow at 11 AM. You can call me back at 987-654-3210. My email is john@example.com. Thank you."`,
      caller: 'John Smith',
      phone: '987-654-3210',
      intent: 'Appointment Booking',
      sentiment: '88% Positive',
      action: 'Create Google Calendar event for Dental Checkup tomorrow at 11:00 AM & send SMS confirmation.'
    },
    {
      id: 'support',
      title: 'Critical Server Outage',
      icon: 'warning',
      category: 'IT & Cloud Ops',
      urgency: 'High (Immediate)',
      transcript: `"Hi, this is Alex Rivera from Apex Cloud Services. Our primary database server just crashed, error code 503. This is urgent, our whole checkout is down! Phone is 415-555-0199. Please dispatch on-call engineer."`,
      caller: 'Alex Rivera',
      phone: '415-555-0199',
      intent: 'Technical Escalation',
      sentiment: '32% Urgent / Distressed',
      action: 'Trigger PagerDuty incident #9412 & dispatch senior infrastructure engineer immediately.'
    },
    {
      id: 'sales',
      title: 'Enterprise Software Quote',
      icon: 'payments',
      category: 'SaaS & Enterprise',
      urgency: 'Medium-High',
      transcript: `"Hi, this is Sarah Connor from SkyNet Systems. We are evaluating VoiceDesk AI for our 250-seat contact center. Looking for enterprise pricing, custom SLA, and SSO integrations. Reach me at 555-014-9922."`,
      caller: 'Sarah Connor',
      phone: '555-014-9922',
      intent: 'Enterprise Sales Inquiry',
      sentiment: '94% Highly Interested',
      action: 'Create Salesforce Opportunity ($45k ARR Tier) & notify Enterprise AE for executive demo.'
    },
    {
      id: 'billing',
      title: 'Billing & Double-Charge Claim',
      icon: 'receipt_long',
      category: 'Customer Finance',
      urgency: 'High',
      transcript: `"Hello, my name is Robert Davis. I just noticed invoice #INV-8821 was billed twice on my Visa card this morning for $499. Please reverse the duplicate charge immediately. My phone is 312-555-7811."`,
      caller: 'Robert Davis',
      phone: '312-555-7811',
      intent: 'Billing Dispute / Refund',
      sentiment: '28% Frustrated',
      action: 'Verify Stripe invoice #INV-8821, issue instant refund receipt, and alert Finance Supervisor.'
    },
    {
      id: 'restaurant',
      title: 'VIP Table & Dietary Request',
      icon: 'restaurant',
      category: 'Hospitality & Events',
      urgency: 'Low-Medium',
      transcript: `"Good afternoon, this is Emily Blunt. I would like to reserve a private dining table for 6 guests this Friday evening at 8:00 PM for an anniversary dinner. Two guests have gluten allergies. Contact: 206-555-4321."`,
      caller: 'Emily Blunt',
      phone: '206-555-4321',
      intent: 'Table Reservation & Dietary',
      sentiment: '95% Enthusiastic',
      action: 'Reserve Private Dining Table 4 for Friday 8:00 PM, flag gluten allergy for Executive Chef.'
    }
  ];

  const industrySolutions = [
    {
      title: 'Healthcare & Medical Clinics',
      icon: 'local_hospital',
      tag: 'HIPAA Compliant',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      description: 'Streamline patient check-ins, automatic appointment scheduling, triage symptom categorization, and prescription refill request routing without receptionist bottlenecks.'
    },
    {
      title: 'Property & Real Estate',
      icon: 'real_estate_agent',
      tag: '24/7 After-Hours',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      description: 'Capture tenant emergency maintenance calls, qualify prospective buyer inquiries, schedule private property showings, and auto-dispatch plumbers or HVAC technicians.'
    },
    {
      title: 'Automotive Dealerships & Service',
      icon: 'directions_car',
      tag: 'Service Bay Sync',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      description: 'Automate vehicle service booking, diagnostic voice intake, test drive requests, warranty inquiries, and direct parts inventory quotes.'
    },
    {
      title: 'Legal & Professional Services',
      icon: 'gavel',
      tag: 'Strict Confidentiality',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      description: 'Filter new client intakes, transcribe initial case facts with timestamped precision, perform conflict checks, and schedule paid legal consultations.'
    },
    {
      title: 'E-Commerce & Logistics',
      icon: 'local_shipping',
      tag: 'Real-time Tracking',
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Resolve "Where Is My Order?" inquiries, process instant return labels, extract order numbers accurately, and escalate shipping delays to carrier dispatch.'
    },
    {
      title: 'Financial & Banking Inquiries',
      icon: 'account_balance',
      tag: 'Bank-Grade Security',
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      description: 'Identify card lost/stolen urgency, loan pre-qualification questions, wire transfer confirmations, and fraud detection flags in milliseconds.'
    }
  ];

  const faqs = [
    {
      q: 'How does VoiceDesk AI analyze voice calls in real time?',
      a: 'VoiceDesk AI connects directly to audio streams (via live browser microphone recording, direct audio file upload, or teleprompter transcripts). It processes audio chunks through Google Gemini 3.8 Flash multimodal neural tokens to extract caller identity, telephone numbers, primary intents, sentiment metrics, and structured CRM payloads in under 1.5 seconds.'
    },
    {
      q: 'Can I test my own voice or audio files before deployment?',
      a: 'Yes! The Voice Analysis Studio allows you to upload any WAV, MP3, M4A, OGG, or WebM audio file, speak directly into your microphone, or test with our 5 realistic business call presets. Each mode is fully isolated with instant real-time results.'
    },
    {
      q: 'Does VoiceDesk AI persist analyzed calls and report histories?',
      a: 'Yes. All analyzed calls, sentiment trends, urgency classifications, and structured summaries are automatically persisted in your browser’s encrypted LocalStorage. You can filter, search, inspect full dialogues, and export records to CSV or JSON anytime in the Dashboard.'
    },
    {
      q: 'What integrations and automated follow-ups are supported?',
      a: 'VoiceDesk AI generates structured JSON payloads ready for native webhook dispatch to CRM platforms (Salesforce, HubSpot, Zendesk), automated calendar scheduling (Google Calendar, Outlook), SMS notifications, and support ticketing.'
    },
    {
      q: 'How does VoiceDesk AI handle background noise and accented speech?',
      a: 'Our neural acoustic tokenizer leverages multimodal acoustic embeddings rather than traditional cascading speech-to-text engines. This ensures over 99.2% transcription and intent extraction accuracy even in noisy environments or with varied international accents.'
    }
  ];

  return (
    <div className="bg-[#faf8ff] text-[#191b23] min-h-screen">
      <main className="pt-4 sm:pt-8">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 py-8 sm:py-12 md:py-16 max-w-[1440px] mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center overflow-hidden">
          <div className="relative z-10 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 bg-[#57dffe]/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#00687a] animate-pulse"></span>
              <span className="text-label-sm font-label-sm text-[#006172] uppercase tracking-wider text-[11px] sm:text-xs">Next-Gen Audio Intelligence</span>
            </div>
            <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-bold text-[#191b23] leading-tight">
              AI Receptionist That <span className="ai-gradient-text">Listens, Understands</span> &amp; Organizes Every Call
            </h1>
            <p className="font-body-lg text-base sm:text-lg text-[#434655] max-w-xl leading-relaxed">
              Harness multimodal neural reasoning for real-time telephony intelligence. Capture voice recordings, extract verified caller entities, categorize urgent intents, and dispatch automated CRM workflows with zero latency.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
              <button 
                onClick={onAnalyzeCall}
                className="ai-gradient-bg text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-body-md font-semibold shadow-lg shadow-[#004ac6]/20 hover:shadow-[#004ac6]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-xl">mic</span>
                <span>Launch Voice Studio</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button 
                onClick={onLaunchApp}
                className="border-2 border-[#004ac6]/20 text-[#004ac6] px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-body-md font-semibold hover:bg-[#004ac6]/5 transition-all text-center w-full sm:w-auto"
              >
                View Live Demo
              </button>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <div className="flex -space-x-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-[#faf8ff] bg-[#e7e7f3] flex items-center justify-center text-[10px] font-bold text-[#434655]">JD</div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-[#faf8ff] bg-[#e1e2ed] flex items-center justify-center text-[10px] font-bold text-[#004ac6]">SC</div>
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full border-2 border-[#faf8ff] bg-[#acedff] flex items-center justify-center text-[10px] font-bold text-[#006172]">AR</div>
              </div>
              <div>
                <p className="text-body-sm text-xs sm:text-sm font-bold text-[#191b23]">99.8% Intent Precision</p>
                <p className="text-[11px] text-[#737686]">Trusted by 500+ clinics, law firms, and contact centers</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#004ac6]/10 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00687a]/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10 floating rounded-2xl overflow-hidden shadow-2xl border border-white/50 bg-white">
              <img 
                alt="AI Robot Assistant Interface" 
                className="w-full h-auto object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa4fPeY5yOmaUaB3OxeDgXaHts6ghaBlJ_rPJGCErvWI45nMY-XTHXuZQwijGyfCBpXeCRvG6MagX-ZBads16xPOgWL7h3mf5QrXIakJl723dWXkdTYvTFHuguFwIvq48PT4BQlswgw1iFg4IhD2XWgV6V3tv5D1ACYOFdfE8xJMwpzRqR8j0pRuNoeE6fOlh13pZUJHYwCvsHOlEUVgDgpAB0Vjj82mJ4CS2Lb7JgXaNAZgqobyDg7g"
              />
            </div>
          </div>
        </section>

        {/* Live Metrics Banner */}
        <section className="px-4 sm:px-6 max-w-[1440px] mx-auto -mt-2 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-[#c3c6d7]/30 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 border-r border-[#c3c6d7]/20 last:border-none">
              <div className="text-2xl sm:text-3xl font-bold font-headline-md text-[#004ac6]">&lt; 1.5s</div>
              <div className="text-xs text-[#434655] font-medium mt-1">End-to-End Analysis</div>
            </div>
            <div className="p-3 border-r border-[#c3c6d7]/20 last:border-none">
              <div className="text-2xl sm:text-3xl font-bold font-headline-md text-[#006172]">80%</div>
              <div className="text-xs text-[#434655] font-medium mt-1">Reception Overhead Saved</div>
            </div>
            <div className="p-3 border-r border-[#c3c6d7]/20 last:border-none">
              <div className="text-2xl sm:text-3xl font-bold font-headline-md text-[#191b23]">40+</div>
              <div className="text-xs text-[#434655] font-medium mt-1">Languages Supported</div>
            </div>
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-bold font-headline-md text-emerald-600">24/7/365</div>
              <div className="text-xs text-[#434655] font-medium mt-1">Uninterrupted Availability</div>
            </div>
          </div>
        </section>

        {/* Interactive Scenario Demo Explorer */}
        <section className="px-4 sm:px-6 py-12 max-w-[1440px] mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004ac6] bg-[#004ac6]/10 px-3 py-1 rounded-full">Interactive Demo</span>
            <h2 className="font-headline-lg text-3xl font-bold text-[#191b23] mt-3">See VoiceDesk AI In Action Across Real Scenarios</h2>
            <p className="font-body-md text-[#434655] max-w-2xl mx-auto mt-2">
              Explore how raw audio transcripts are instantly converted into hyper-structured caller metadata, sentiment tags, and follow-up dispatches.
            </p>
          </div>

          {/* Scenario Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none justify-start sm:justify-center">
            {demoScenarios.map((scenario, idx) => (
              <button
                key={scenario.id}
                onClick={() => setActiveScenario(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeScenario === idx
                    ? 'bg-[#004ac6] text-white shadow-sm'
                    : 'bg-white text-[#434655] border border-[#c3c6d7]/30 hover:bg-[#f3f3fe]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{scenario.icon}</span>
                <span>{scenario.title}</span>
              </button>
            ))}
          </div>

          {/* Interactive Card Display */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c3c6d7]/30 shadow-md grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d7]/20">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006172] bg-[#57dffe]/20 px-2.5 py-1 rounded-md">
                  {demoScenarios[activeScenario].category}
                </span>
                <span className="text-xs font-mono text-[#737686]">Raw Voice Transcript</span>
              </div>
              <div className="p-4 bg-[#f3f3fe] rounded-2xl border border-[#004ac6]/10">
                <p className="font-mono text-xs sm:text-sm text-[#191b23] leading-relaxed italic">
                  {demoScenarios[activeScenario].transcript}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={onAnalyzeCall}
                  className="ai-gradient-bg text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:shadow-md transition-all flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                  <span>Test This in Voice Studio</span>
                </button>
                <span className="text-xs font-semibold text-[#737686]">Audio Length: ~01:15</span>
              </div>
            </div>

            <div className="space-y-4 bg-[#faf8ff] p-5 sm:p-6 rounded-2xl border border-[#c3c6d7]/30">
              <div className="flex items-center justify-between pb-3 border-b border-[#c3c6d7]/20">
                <span className="text-xs font-bold uppercase tracking-wider text-[#004ac6] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Extracted Intelligence
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Confidence: 99.8%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-[#c3c6d7]/30">
                  <span className="text-[10px] uppercase font-bold text-[#737686]">Caller Name</span>
                  <p className="text-xs sm:text-sm font-bold text-[#191b23] mt-0.5">{demoScenarios[activeScenario].caller}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#c3c6d7]/30">
                  <span className="text-[10px] uppercase font-bold text-[#737686]">Callback Phone</span>
                  <p className="text-xs sm:text-sm font-bold font-mono text-[#004ac6] mt-0.5">{demoScenarios[activeScenario].phone}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#c3c6d7]/30">
                  <span className="text-[10px] uppercase font-bold text-[#737686]">Detected Intent</span>
                  <p className="text-xs sm:text-sm font-bold text-[#006172] mt-0.5">{demoScenarios[activeScenario].intent}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#c3c6d7]/30">
                  <span className="text-[10px] uppercase font-bold text-[#737686]">Sentiment / Tone</span>
                  <p className="text-xs sm:text-sm font-bold text-indigo-700 mt-0.5">{demoScenarios[activeScenario].sentiment}</p>
                </div>
              </div>

              <div className="p-3.5 bg-[#004ac6]/10 rounded-xl border border-[#004ac6]/20">
                <span className="text-[10px] uppercase font-bold text-[#004ac6] block mb-1">Recommended CRM Action</span>
                <p className="text-xs text-[#191b23] font-medium leading-relaxed">
                  {demoScenarios[activeScenario].action}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="px-4 sm:px-6 py-16 max-w-[1440px] mx-auto" id="features">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004ac6] bg-[#004ac6]/10 px-3 py-1 rounded-full">Core Technologies</span>
            <h2 className="font-headline-lg text-3xl font-bold text-[#191b23] mt-3">Advanced Multimodal Analysis Suite</h2>
            <p className="font-body-md text-[#434655] mt-2">Architected with Google Gemini 3.8 Flash Neural Speech tokens and real-time reasoning engines.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Highlight 1: Recording */}
            <div className="md:col-span-2 glass-card rounded-2xl p-8 card-hover-lift flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#004ac6]/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#004ac6]">mic</span>
                </div>
                <h3 className="font-headline-md text-2xl font-bold mb-2">Crystal Live Voice Recording</h3>
                <p className="font-body-sm text-[#434655]">Low-latency, high-fidelity browser microphone audio capture with real-time waveform visualization, pause/resume, and animated visualizers.</p>
              </div>
              <div className="mt-8 h-24 bg-[#f3f3fe] rounded-xl flex items-center justify-center overflow-hidden">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-8 bg-[#004ac6] rounded-full animate-[bounce_1s_infinite]"></div>
                  <div className="w-1.5 h-12 bg-[#004ac6] rounded-full animate-[bounce_1.2s_infinite]"></div>
                  <div className="w-1.5 h-16 bg-[#004ac6] rounded-full animate-[bounce_0.8s_infinite]"></div>
                  <div className="w-1.5 h-10 bg-[#004ac6] rounded-full animate-[bounce_1.5s_infinite]"></div>
                  <div className="w-1.5 h-14 bg-[#57dffe] rounded-full animate-[bounce_1.1s_infinite]"></div>
                  <div className="w-1.5 h-9 bg-[#004ac6] rounded-full animate-[bounce_0.9s_infinite]"></div>
                </div>
              </div>
            </div>

            {/* Highlight 2: Upload */}
            <div className="glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#00687a]/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#00687a]">cloud_upload</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Universal Audio Upload</h3>
              <p className="font-body-sm text-[#434655]">Drag-and-drop support for WAV, MP3, M4A, OGG, and WebM with audio metadata inspection.</p>
            </div>

            {/* Highlight 3: Speech-to-Text */}
            <div className="glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#dae2fd] rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#4d556b]">translate</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">99.8% Intent Precision</h3>
              <p className="font-body-sm text-[#434655]">Multilingual speech understanding powered by Gemini 3.8 Flash neural speech tokenization.</p>
            </div>

            {/* Highlight 4: Intent Logic */}
            <div className="md:col-span-1 glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#004ac6]/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#004ac6]">psychology</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Intent Classification</h3>
              <p className="font-body-sm text-[#434655]">Automatically classifies appointment requests, emergency escalations, sales quotes, and billing claims.</p>
            </div>

            {/* Highlight 5: Summaries */}
            <div className="md:col-span-1 glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#00687a]/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#00687a]">summarize</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Executive Summaries</h3>
              <p className="font-body-sm text-[#434655]">Condenses 20-minute conversations into high-impact bulleted summaries and clear action steps.</p>
            </div>

            {/* Highlight 6: Sentiment */}
            <div className="md:col-span-1 glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#dae2fd] rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#4d556b]">face</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Sentiment Scoring</h3>
              <p className="font-body-sm text-[#434655]">Real-time caller emotional state tracking (1-100 index) to flag upset or high-value clients.</p>
            </div>

            {/* Highlight 7: Recommendations */}
            <div className="md:col-span-1 glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#b4c5ff] rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#004ac6]">lightbulb</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Next-Step Insights</h3>
              <p className="font-body-sm text-[#434655]">Predictive recommendations for follow-up timing, calendar bookings, and customer retention.</p>
            </div>
          </div>
        </section>

        {/* Industry Specific Solutions Section */}
        <section className="px-4 sm:px-6 py-16 max-w-[1440px] mx-auto bg-white rounded-[32px] border border-[#c3c6d7]/30 my-8 shadow-sm">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004ac6] bg-[#004ac6]/10 px-3 py-1 rounded-full">Tailored Verticals</span>
            <h2 className="font-headline-lg text-3xl font-bold text-[#191b23] mt-3">Built for High-Volume Front Desks &amp; Service Teams</h2>
            <p className="font-body-md text-[#434655] max-w-2xl mx-auto mt-2">
              VoiceDesk AI adapts vocabulary, urgency routing, and CRM webhooks to your specific business industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industrySolutions.map((sol, index) => (
              <div key={index} className="p-6 rounded-2xl bg-[#faf8ff] border border-[#c3c6d7]/30 space-y-3 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sol.color}`}>
                    <span className="material-symbols-outlined text-xl">{sol.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${sol.color}`}>
                    {sol.tag}
                  </span>
                </div>
                <h3 className="font-bold text-base text-[#191b23]">{sol.title}</h3>
                <p className="text-xs text-[#434655] leading-relaxed">{sol.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison: Traditional vs VoiceDesk AI */}
        <section className="px-4 sm:px-6 py-16 max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004ac6] bg-[#004ac6]/10 px-3 py-1 rounded-full">Comparative Advantage</span>
            <h2 className="font-headline-lg text-3xl font-bold text-[#191b23] mt-3">Why Modern Businesses Choose VoiceDesk AI</h2>
            <p className="font-body-md text-[#434655] max-w-xl mx-auto mt-2">
              Eliminate rigid IVR phone trees and manual typing with continuous multimodal reasoning.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#c3c6d7]/30 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#f3f3fe] border-b border-[#c3c6d7]/30">
                    <th className="p-4 sm:p-5 font-bold text-[#191b23]">Feature / Metric</th>
                    <th className="p-4 sm:p-5 font-bold text-[#737686]">Traditional Reception / IVR</th>
                    <th className="p-4 sm:p-5 font-bold text-[#004ac6] bg-[#004ac6]/10">VoiceDesk AI Intelligence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c3c6d7]/20">
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#191b23]">Average Hold Time</td>
                    <td className="p-4 sm:p-5 text-[#ba1a1a] font-medium">8 to 15 Minutes</td>
                    <td className="p-4 sm:p-5 text-emerald-700 font-bold bg-[#004ac6]/5">Instant (0 Seconds)</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#191b23]">Simultaneous Call Capacity</td>
                    <td className="p-4 sm:p-5 text-[#737686]">1 call per available staff</td>
                    <td className="p-4 sm:p-5 text-[#004ac6] font-bold bg-[#004ac6]/5">Unlimited Concurrent Streams</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#191b23]">Operating Cost Per Call</td>
                    <td className="p-4 sm:p-5 text-[#ba1a1a] font-medium">$4.50 – $7.00 / call</td>
                    <td className="p-4 sm:p-5 text-emerald-700 font-bold bg-[#004ac6]/5">&lt; $0.03 / call</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#191b23]">CRM Data Entry &amp; Summary</td>
                    <td className="p-4 sm:p-5 text-[#737686]">Manual typing (often forgotten)</td>
                    <td className="p-4 sm:p-5 text-[#004ac6] font-bold bg-[#004ac6]/5">Automated in &lt; 1.5 Seconds</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#191b23]">Sentiment &amp; Urgency Triage</td>
                    <td className="p-4 sm:p-5 text-[#737686]">Subjective human recall</td>
                    <td className="p-4 sm:p-5 text-[#004ac6] font-bold bg-[#004ac6]/5">Neural 1-100 Numerical Metric</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-[#191b23]">Availability</td>
                    <td className="p-4 sm:p-5 text-[#737686]">9 AM – 5 PM (Mon–Fri)</td>
                    <td className="p-4 sm:p-5 text-emerald-700 font-bold bg-[#004ac6]/5">24/7/365 Non-Stop</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-[#f3f3fe] py-16" id="how-it-works">
          <div className="px-4 sm:px-6 max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
              <div className="max-w-lg">
                <span className="text-xs font-bold uppercase tracking-widest text-[#004ac6] bg-white px-3 py-1 rounded-full shadow-2xs">Architecture</span>
                <h2 className="font-headline-lg text-3xl font-bold text-[#191b23] mt-3">How It Works</h2>
                <p className="font-body-md text-[#434655] mt-2">A streamlined workflow from raw voice stream to hyper-structured CRM payload in under 60 seconds.</p>
              </div>
              <div className="bg-white px-5 py-3 rounded-xl border border-[#c3c6d7] inline-flex items-center gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[#004ac6]">bolt</span>
                <span className="text-xs sm:text-sm font-bold text-[#191b23]">Average Turnaround: 1.2s</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative">
              <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-xs relative z-10 group">
                <div className="mb-4 text-[#004ac6] font-headline-md text-2xl font-bold opacity-40 group-hover:opacity-100 transition-opacity">01</div>
                <h4 className="font-headline-md text-xl font-bold mb-1">Capture</h4>
                <p className="font-body-sm text-[#434655] text-xs leading-relaxed">Incoming voice streams from live mic, telephony SIP channels, or audio files are packetized with high-fidelity Web Audio buffers.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-xs relative z-10 group">
                <div className="mb-4 text-[#004ac6] font-headline-md text-2xl font-bold opacity-40 group-hover:opacity-100 transition-opacity">02</div>
                <h4 className="font-headline-md text-xl font-bold mb-1">Transcribe</h4>
                <p className="font-body-sm text-[#434655] text-xs leading-relaxed">Neural speech tokenizer parses multimodal acoustic features into speaker-labeled, accurate conversational transcripts.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-xs relative z-10 group">
                <div className="mb-4 text-[#004ac6] font-headline-md text-2xl font-bold opacity-40 group-hover:opacity-100 transition-opacity">03</div>
                <h4 className="font-headline-md text-xl font-bold mb-1">Reason</h4>
                <p className="font-body-sm text-[#434655] text-xs leading-relaxed">Multimodal LLM reasons over the dialogue to extract verified caller identity, contact numbers, sentiment indices, and intent urgency.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-xs relative z-10 group">
                <div className="mb-4 text-[#004ac6] font-headline-md text-2xl font-bold opacity-40 group-hover:opacity-100 transition-opacity">04</div>
                <h4 className="font-headline-md text-xl font-bold mb-1">Sync</h4>
                <p className="font-body-sm text-[#434655] text-xs leading-relaxed">Structured logs are instantly persisted to LocalStorage, CRM webhooks, calendar scheduling events, and exportable CSV tables.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 sm:px-6 py-16 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#004ac6] bg-[#004ac6]/10 px-3 py-1 rounded-full">Operational Excellence</span>
                <h2 className="font-headline-lg text-3xl font-bold text-[#191b23] mt-3">Scale Front-Desk Operations Without Adding Headcount</h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2563eb] rounded-full flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-[#191b23]">Save 80% Reception Time</h4>
                    <p className="font-body-sm text-[#434655]">Automate call logging, follow-up tagging, and summary generation so staff can focus on high-value human interactions.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#57dffe] rounded-full flex items-center justify-center text-[#006172]">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-[#191b23]">Zero Data Loss &amp; 99.8% Accuracy</h4>
                    <p className="font-body-sm text-[#434655]">Eliminate forgotten phone numbers, garbled notes, and missed callbacks with automated verification.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#e1e2ed] rounded-full flex items-center justify-center text-[#004ac6]">
                    <span className="material-symbols-outlined">insights</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-[#191b23]">Executive Telephony Trends</h4>
                    <p className="font-body-sm text-[#434655]">Analyze call volumes, recurring complaints, and peak inquiry times across thousands of interactions in one unified dashboard.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#dae2fd] rounded-full flex items-center justify-center text-[#4d556b]">
                    <span className="material-symbols-outlined">grid_view</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-[#191b23]">Instant 1-Click CSV &amp; JSON Export</h4>
                    <p className="font-body-sm text-[#434655]">Download complete telephony histories or connect directly to third-party databases via secure standard formats.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-[#c3c6d7]/30 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#c3c6d7]/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-label-md font-label-sm font-semibold text-[#004ac6]">Live Transcription &amp; Intelligence</span>
                  </div>
                  <span className="text-xs font-mono text-[#737686]">01:15 / 03:00</span>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#e7e7f3] flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#434655]">C</div>
                    <div className="bg-[#f3f3fe] p-3.5 rounded-2xl rounded-tl-none max-w-[85%]">
                      <p className="text-xs text-[#191b23]">"Hello, I am calling to inquire about rescheduling my dental appointment for tomorrow."</p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#004ac6] text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">AI</div>
                    <div className="bg-[#004ac6] text-white p-3.5 rounded-2xl rounded-tr-none max-w-[85%]">
                      <p className="text-xs">"Understood, Mr. Smith. I have noted 11:00 AM checkup for tomorrow and alerted Dr. Vance."</p>
                    </div>
                  </div>
                </div>
                <div className="p-3.5 bg-[#57dffe]/15 border border-[#00687a]/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[#00687a] text-sm">auto_awesome</span>
                    <span className="text-xs font-bold text-[#00687a]">REAL-TIME REASONING TAGS</span>
                  </div>
                  <p className="text-xs font-bold text-[#006172]">Intent: Appointment Reschedule • Urgency: Normal • Sentiment: 92% Positive</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enterprise Security & Compliance Banner */}
        <section className="px-4 sm:px-6 max-w-[1440px] mx-auto my-8">
          <div className="bg-[#191b23] text-white rounded-3xl p-8 sm:p-10 border border-[#c3c6d7]/20 shadow-xl grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#57dffe]">Trust &amp; Privacy</span>
              <h3 className="text-2xl font-bold font-headline-md">Enterprise Security by Design</h3>
              <p className="text-xs text-[#c3c6d7] leading-relaxed">
                Bank-grade audio encryption in transit and at rest with strict privacy isolation.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-[#57dffe] text-2xl">shield_lock</span>
                <h4 className="font-bold text-sm mt-2">AES-256 Bit</h4>
                <p className="text-[11px] text-[#c3c6d7] mt-0.5">End-to-End Audio Encryption</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-[#57dffe] text-2xl">verified_user</span>
                <h4 className="font-bold text-sm mt-2">SOC2 Type II</h4>
                <p className="text-[11px] text-[#c3c6d7] mt-0.5">Audited Security Controls</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
                <span className="material-symbols-outlined text-[#57dffe] text-2xl">health_and_safety</span>
                <h4 className="font-bold text-sm mt-2">HIPAA Ready</h4>
                <p className="text-[11px] text-[#c3c6d7] mt-0.5">Strict Medical Privacy Rules</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 sm:px-6 py-16 max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#004ac6] bg-[#004ac6]/10 px-3 py-1 rounded-full">Frequently Asked Questions</span>
            <h2 className="font-headline-lg text-3xl font-bold text-[#191b23] mt-3">Everything You Need to Know</h2>
            <p className="font-body-md text-[#434655] mt-2">Common questions about audio ingestion, accuracy, integrations, and privacy.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-[#c3c6d7]/30 shadow-2xs overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-[#faf8ff] transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#191b23]">{faq.q}</span>
                    <span className={`material-symbols-outlined text-[#004ac6] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#434655] leading-relaxed border-t border-[#c3c6d7]/10 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 py-16 max-w-[1440px] mx-auto">
          <div className="ai-gradient-bg rounded-[40px] p-8 sm:p-12 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48"></div>
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-bold">Ready to automate your front desk?</h2>
              <p className="font-body-lg text-base sm:text-lg opacity-90">
                Join forward-thinking businesses leveraging VoiceDesk AI to streamline voice communication, booking, and customer escalation.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <button 
                  onClick={onAnalyzeCall}
                  className="bg-white text-[#004ac6] px-8 py-4 rounded-xl font-headline-md font-bold hover:bg-opacity-90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">mic</span>
                  <span>Start Live Voice Analysis</span>
                </button>
                <button 
                  onClick={onLaunchApp}
                  className="bg-transparent border border-white/40 text-white px-8 py-4 rounded-xl font-headline-md font-bold hover:bg-white/10 active:scale-95 transition-all"
                >
                  Explore Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#e1e2ed] mt-12 border-t border-[#c3c6d7]/30">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 max-w-[1440px] mx-auto gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onLaunchApp}>
              <span className="material-symbols-outlined text-[#004ac6] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
              <span className="font-headline-md text-xl font-bold text-[#004ac6]">VoiceDesk AI</span>
            </div>
            <p className="font-body-sm text-sm text-[#434655]">© 2026 VoiceDesk AI. Powered by Neural Core.</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="https://github.com/bikram73/VoiceDesk_AI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-[#f3f3fe] text-[#191b23] border border-[#c3c6d7]/40 rounded-xl text-xs font-bold transition-all shadow-2xs"
            >
              <svg className="w-4 h-4 fill-current text-[#191b23]" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>GitHub Repo</span>
            </a>
            <div className="flex items-center gap-2">
              <span className="text-label-sm font-label-sm text-[#737686]">Stack:</span>
              <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-[#434655] border border-[#c3c6d7]/30">REACT 19</span>
              <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-[#434655] border border-[#c3c6d7]/30">NEURAL AI</span>
              <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-[#434655] border border-[#c3c6d7]/30">TAILWIND</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
