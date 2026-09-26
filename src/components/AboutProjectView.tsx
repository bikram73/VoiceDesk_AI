import React from 'react';

export const AboutProjectView: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf8ff] text-[#191b23] space-y-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-label-sm font-label-sm text-[#004ac6] tracking-widest uppercase font-semibold">Technical Blueprint</span>
          <h1 className="font-headline-lg text-4xl font-bold text-[#191b23]">Project Deep Dive</h1>
          <p className="font-body-md text-[#434655] max-w-2xl">
            Technical architecture, pipeline design, and technological foundation powering the VoiceDesk AI intelligence suite.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://github.com/bikram73/VoiceDesk_AI"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#191b23] hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub Repo
          </a>
        </div>
      </header>

      {/* Mission Hero Section */}
      <section className="bg-white rounded-[32px] p-8 md:p-12 border border-[#c3c6d7]/30 shadow-sm grid md:grid-cols-2 gap-8 items-center overflow-hidden relative">
        <div className="space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#004ac6]/10 text-[#004ac6] rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            MISSION OBJECTIVE
          </div>
          <h2 className="font-display-lg text-3xl md:text-4xl font-bold text-[#191b23]">
            Bridging the Gap Between Speech and Action
          </h2>
          <p className="font-body-md text-[#434655] leading-relaxed">
            VoiceDesk AI transforms unstructured conversational audio into hyper-structured, actionable telephonic intelligence. By combining low-latency neural speech recognition with advanced multimodal reasoning, VoiceDesk AI eliminates operational overhead for front-desk teams.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-[#f3f3fe] rounded-2xl border border-[#004ac6]/10">
              <div className="text-2xl font-bold text-[#004ac6] font-headline-md">&lt;100ms</div>
              <div className="text-xs text-[#434655] font-medium">Audio Chunk Ingestion</div>
            </div>
            <div className="p-4 bg-[#57dffe]/10 rounded-2xl border border-[#00687a]/10">
              <div className="text-2xl font-bold text-[#006172] font-headline-md">99.8%</div>
              <div className="text-xs text-[#006172] font-medium">Intent Precision</div>
            </div>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="absolute w-72 h-72 bg-[#004ac6]/10 blur-[80px] rounded-full"></div>
          <img 
            alt="Futuristic Robot Floating" 
            className="w-full max-w-sm h-auto floating rounded-2xl object-cover relative z-10 drop-shadow-xl" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnkL4KD3eASIQsNxRKLRlnU8fgauvOq2OirRIGd3uMVuJObrGVqw_gIcr1cHRoIpJelJm65QisoCAPMmd9zCRc0xyiR33GXHqeXu2WDZ81ji2HcvqE1nztzqNURPIm5ml4WH7-ble-0667zCgRFSLiF2Rn4SIFi0RaV3SGGTCXIXbBljv6IcKaPuMdNRUFBJlm0u30JMQF4oxGSG4RsAaEsn9Q35_2fRogjhvr_fjkEBd35PTY8Jz1Vw"
          />
        </div>
      </section>

      {/* Pipeline Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-headline-lg text-2xl font-bold text-[#191b23]">The Intelligence Pipeline</h2>
          <p className="font-body-md text-sm text-[#434655]">Four-stage real-time stream processing architecture.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3 sm:space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-base text-[#191b23]">Real-time Audio Stream</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Raw audio stream captured from WebRTC/SIP channels is packetized and preprocessed via Web Audio API.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3 sm:space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#57dffe]/20 text-[#006172] flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-base text-[#191b23]">Neural Speech Tokenization</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Multimodal audio tokens pass directly to Google Gemini 3.8 Flash without intermediary transcriber loss.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3 sm:space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold text-base text-[#191b23]">Structured Entity Extraction</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Real-time reasoning classifies caller sentiment, extracts names, services, timestamps, and urgency tags.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3 sm:space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#57dffe]/20 text-[#006172] flex items-center justify-center font-bold">4</div>
            <h3 className="font-bold text-base text-[#191b23]">Automated CRM Dispatch</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Trigger instant webhooks, auto-generate calendar events, and persist state in browser LocalStorage.
            </p>
          </div>
        </div>
      </section>

      {/* Engineered for Excellence */}
      <section className="space-y-6">
        <h2 className="font-headline-lg text-2xl font-bold text-[#191b23]">Engineered for Excellence</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3">
            <span className="material-symbols-outlined text-[#004ac6] text-3xl">shield</span>
            <h3 className="font-bold text-base text-[#191b23]">Enterprise Security</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              SOC2 Type II ready, AES-256 encryption at rest and in transit, HIPAA compliant audio storage policies.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3">
            <span className="material-symbols-outlined text-[#00687a] text-3xl">speed</span>
            <h3 className="font-bold text-base text-[#191b23]">Ultra-Low Latency</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Edge-deployed inference engines maintain under 250ms voice turnaround time globally.
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3 sm:col-span-2 lg:col-span-1">
            <span className="material-symbols-outlined text-indigo-600 text-3xl">hub</span>
            <h3 className="font-bold text-base text-[#191b23]">Seamless Integrations</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Native connectors for HubSpot, Salesforce, Google Calendar, Twilio, Zendesk, and custom REST Webhooks.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c3c6d7]/30 shadow-sm space-y-6">
        <h2 className="font-headline-lg text-2xl font-bold text-[#191b23]">Roadmap &amp; Future Vision</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="border-l-2 border-[#004ac6] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#004ac6]">Q1 2026</span>
            <h4 className="font-bold text-sm text-[#191b23]">Multilingual Voice Synthesis</h4>
            <p className="text-xs text-[#434655]">Bidirectional voice translation in 40+ languages.</p>
          </div>

          <div className="border-l-2 border-[#00687a] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#00687a]">Q2 2026</span>
            <h4 className="font-bold text-sm text-[#191b23]">Autonomous Escalation</h4>
            <p className="text-xs text-[#434655]">Smart transfer to human agent based on tone spikes.</p>
          </div>

          <div className="border-l-2 border-[#2563eb] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#2563eb]">Q3 2026</span>
            <h4 className="font-bold text-sm text-[#191b23]">Custom Voice Cloning</h4>
            <p className="text-xs text-[#434655]">Brand-specific voice models generated in minutes.</p>
          </div>

          <div className="border-l-2 border-[#434655] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#434655]">Q4 2026</span>
            <h4 className="font-bold text-sm text-[#191b23]">On-Premises Deployment</h4>
            <p className="text-xs text-[#434655]">Air-gapped voice server containers for government &amp; healthcare.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 mt-12 bg-[#e1e2ed] flex flex-col md:flex-row justify-between items-center px-6 rounded-xl gap-4">
        <p className="text-[#434655] font-body-sm text-xs">© 2026 VoiceDesk AI. Powered by Neural Core.</p>
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
