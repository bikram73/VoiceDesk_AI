import React from 'react';

export const AboutProjectView: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#faf8ff] text-[#191b23] space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <span className="text-label-sm font-label-sm text-[#004ac6] tracking-widest uppercase font-semibold">Technical Blueprint</span>
        <h1 className="font-headline-lg text-4xl font-bold text-[#191b23]">Project Deep Dive</h1>
        <p className="font-body-md text-[#434655] max-w-2xl">
          Technical architecture, pipeline design, and technological foundation powering the VoiceDesk AI intelligence suite.
        </p>
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
            VoiceDesk AI transforms unstructured conversational audio into hyper-structured, actionable telephonic intelligence. By combining low-latency neural speech recognition with Gemini 1.5 Pro multimodal reasoning, VoiceDesk AI eliminates operational overhead for front-desk teams.
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center font-bold">1</div>
            <h3 className="font-bold text-base text-[#191b23]">Real-time Audio Stream</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Ingests raw WebRTC / Opus audio packages directly from telephone trunks or microphone devices.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#00687a]/10 text-[#00687a] flex items-center justify-center font-bold">2</div>
            <h3 className="font-bold text-base text-[#191b23]">Transformer STT Engine</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Neural speech-to-text model extracts phonemes, performs speaker diarization, and handles accents seamlessly.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center font-bold">3</div>
            <h3 className="font-bold text-base text-[#191b23]">Gemini 1.5 Context Layer</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Context-window expansion parses full transcript semantics, caller sentiment, and implicit desires.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">4</div>
            <h3 className="font-bold text-base text-[#191b23]">Structured Output &amp; Sync</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Formats clean JSON payloads, triggers webhooks, updates calendar slots, and pushes logs to CRM databases.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Tech Stack Grid with Logos */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-headline-lg text-2xl font-bold text-[#191b23]">Modern Tech Stack</h2>
          <p className="font-body-md text-sm text-[#434655]">Built with cutting-edge production frameworks.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm flex flex-col items-center text-center space-y-3 card-hover-lift">
            <img 
              alt="React Logo" 
              className="w-12 h-12 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrZSR-yGVyAMORBeONFJxliOTxgnRugHH1573odaHdTXFAWNhCHa-q51qd-O3e4VykK5x-s8ghRV9Y30yR26UV1cpZSR2NF8QziNxC5t-WTmfL014y3oy0DrKRfhBdz33VR9_30MtvxwHAr5ikhT0cd7X4XBqaWnzZa8Nw3DN_oT7oNW9EBN4Ny-fl7e2XFiY1ganp5KMWqS71J3rq4HrLQu3Uks1oPzOQGtfU0iJ1S3Cmw_C3SVRdcA"
            />
            <div>
              <h4 className="font-bold text-sm text-[#191b23]">React 19</h4>
              <p className="text-xs text-[#737686]">UI Framework</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm flex flex-col items-center text-center space-y-3 card-hover-lift">
            <img 
              alt="TypeScript Logo" 
              className="w-12 h-12 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf2I1kQ4nOcgroVFr5dEI2Z6VBGRep3-hIil76paWqcff7kOs7q7qqkDr1nkU7QWS93MOgEKXBBNaKdAby-WHXBwlaeZkpWBQT-A6TKl1eiz4S9X4hfcZoVDYHE9uWdBz3Tc3fgEdMBRVIMz7q1jF0eEUIsPIrfUJ48xaq3cJcqW30Z_avsIARe_MOvgp-DgcKhX8M9uAPSAdZ6KWfZSUNyN9wIhIRPdnlNBFJO1vI1GJYAlXoPRME2w"
            />
            <div>
              <h4 className="font-bold text-sm text-[#191b23]">TypeScript</h4>
              <p className="text-xs text-[#737686]">Type Safety</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm flex flex-col items-center text-center space-y-3 card-hover-lift">
            <img 
              alt="Tailwind CSS Logo" 
              className="w-12 h-12 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeY4WRYb8b-Sp4Je8f-JCS5VCwSGsopzmP7HTUL5VRkE1rWlLT2I77BqXp3kt2hiPq7yxzeQO542bt1PqGaPhVa9z1eChIkpoSXgKubv0Su5zYiKstt6I2poD6YSMU03zuTAseiZAxt9-R3azFJlPBiH2vgzbOi1-qvPHDaaVd3FWmaTzjb-BRDsRFlU5Ac3VfBaY9hQORbyXNN5dj66KwpUGJJeSUwIC9tbrqBX5eyk9rmIbUN0oC4g"
            />
            <div>
              <h4 className="font-bold text-sm text-[#191b23]">Tailwind CSS</h4>
              <p className="text-xs text-[#737686]">Utility Styling</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm flex flex-col items-center text-center space-y-3 card-hover-lift">
            <img 
              alt="Vite Logo" 
              className="w-12 h-12 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8P6pA-XHGL_QqwFQAG99vXoY2dyVBMMm9YEM5SL4_R0gdc07GAcWKXASD7hp4JczdsV20J02thAaCU5yAnDDLIQ6f0G0bds1nK6662jORcSU9ZRKUoYZcWZZ9ol82j-8ZdhhIgsbejO3txEr2QHYrTv48UvIRcoAjA6paHfWk4lls8OYjG6OuZIzvbM_Nrh3DkzPIdHH_rfIJisftliu1Ilz8smESabmHxpjDPxCSqqRJ5EJfgCqpGQ"
            />
            <div>
              <h4 className="font-bold text-sm text-[#191b23]">Vite Bundler</h4>
              <p className="text-xs text-[#737686]">Lightning Build</p>
            </div>
          </div>
        </div>
      </section>

      {/* Engineered for Excellence */}
      <section className="space-y-6">
        <h2 className="font-headline-lg text-2xl font-bold text-[#191b23]">Engineered for Excellence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3">
            <span className="material-symbols-outlined text-[#004ac6] text-3xl">shield</span>
            <h3 className="font-bold text-base text-[#191b23]">Enterprise Security</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              SOC2 Type II ready, AES-256 encryption at rest and in transit, HIPAA compliant audio storage policies.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3">
            <span className="material-symbols-outlined text-[#00687a] text-3xl">speed</span>
            <h3 className="font-bold text-base text-[#191b23]">Ultra-Low Latency</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Edge-deployed inference engines maintain under 250ms voice turnaround time globally.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c3c6d7]/30 shadow-sm space-y-3">
            <span className="material-symbols-outlined text-indigo-600 text-3xl">hub</span>
            <h3 className="font-bold text-base text-[#191b23]">Seamless Integrations</h3>
            <p className="text-xs text-[#434655] leading-relaxed">
              Native connectors for HubSpot, Salesforce, Google Calendar, Twilio, Zendesk, and custom REST Webhooks.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="bg-white p-8 rounded-3xl border border-[#c3c6d7]/30 shadow-sm space-y-6">
        <h2 className="font-headline-lg text-2xl font-bold text-[#191b23]">Roadmap &amp; Future Vision</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border-l-2 border-[#004ac6] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#004ac6]">Q1 2025</span>
            <h4 className="font-bold text-sm text-[#191b23]">Multilingual Voice Synthesis</h4>
            <p className="text-xs text-[#434655]">Bidirectional voice translation in 40+ languages.</p>
          </div>

          <div className="border-l-2 border-[#00687a] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#00687a]">Q2 2025</span>
            <h4 className="font-bold text-sm text-[#191b23]">Autonomous Escalation</h4>
            <p className="text-xs text-[#434655]">Smart transfer to human agent based on tone spikes.</p>
          </div>

          <div className="border-l-2 border-[#2563eb] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#2563eb]">Q3 2025</span>
            <h4 className="font-bold text-sm text-[#191b23]">Custom Voice Cloning</h4>
            <p className="text-xs text-[#434655]">Brand-specific voice models generated in minutes.</p>
          </div>

          <div className="border-l-2 border-[#434655] pl-4 space-y-1">
            <span className="text-xs font-bold text-[#434655]">Q4 2025</span>
            <h4 className="font-bold text-sm text-[#191b23]">On-Premises Deployment</h4>
            <p className="text-xs text-[#434655]">Air-gapped voice server containers for government &amp; healthcare.</p>
          </div>
        </div>
      </section>

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
