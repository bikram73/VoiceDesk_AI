import React from 'react';

interface HomeViewProps {
  onLaunchApp: () => void;
  onAnalyzeCall: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onLaunchApp, onAnalyzeCall }) => {
  return (
    <div className="bg-[#faf8ff] text-[#191b23] min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#faf8ff]/80 backdrop-blur-xl shadow-sm border-b border-[#c3c6d7]/20">
        <div className="flex justify-between items-center px-6 py-2 max-w-[1440px] mx-auto h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onLaunchApp}>
            <span className="material-symbols-outlined text-[#004ac6] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              graphic_eq
            </span>
            <span className="font-headline-md text-2xl font-bold text-[#004ac6]">VoiceDesk AI</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a className="font-body-md text-[#434655] hover:text-[#004ac6] transition-colors" href="#features">Features</a>
            <a className="font-body-md text-[#434655] hover:text-[#004ac6] transition-colors" href="#how-it-works">Documentation</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={onLaunchApp}
              className="bg-[#004ac6] text-white px-6 py-2 rounded-xl font-body-md hover:opacity-90 active:scale-95 duration-200 transition-all font-semibold shadow-sm"
            >
              Launch App
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative px-6 py-12 md:py-16 max-w-[1440px] mx-auto grid md:grid-cols-2 gap-12 items-center overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#57dffe]/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#00687a] animate-pulse"></span>
              <span className="text-label-sm font-label-sm text-[#006172] uppercase tracking-wider">Next-Gen Audio Intelligence</span>
            </div>
            <h1 className="font-display-lg text-4xl lg:text-5xl font-bold text-[#191b23] leading-tight">
              AI Receptionist That <span className="ai-gradient-text">Listens, Understands</span> &amp; Organizes Every Call
            </h1>
            <p className="font-body-lg text-lg text-[#434655] max-w-xl">
              Harness the power of Gemini AI for real-time voice transcription, intent detection, and automated smart summaries. Transform raw audio into actionable business intelligence.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={onAnalyzeCall}
                className="ai-gradient-bg text-white px-8 py-4 rounded-xl font-body-md font-semibold shadow-lg shadow-[#004ac6]/20 hover:shadow-[#004ac6]/40 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                Analyze Voice Call <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button 
                onClick={onLaunchApp}
                className="border-2 border-[#004ac6]/20 text-[#004ac6] px-8 py-4 rounded-xl font-body-md font-semibold hover:bg-[#004ac6]/5 transition-all"
              >
                View Demo
              </button>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#faf8ff] bg-[#e7e7f3]"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#faf8ff] bg-[#e1e2ed]"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#faf8ff] bg-[#acedff]"></div>
              </div>
              <p className="text-body-sm text-[#737686]">Trusted by 500+ modern enterprises</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#004ac6]/10 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00687a]/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10 floating rounded-2xl overflow-hidden shadow-2xl border border-white/50">
              <img 
                alt="AI Robot Assistant Interface" 
                className="w-full h-auto object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa4fPeY5yOmaUaB3OxeDgXaHts6ghaBlJ_rPJGCErvWI45nMY-XTHXuZQwijGyfCBpXeCRvG6MagX-ZBads16xPOgWL7h3mf5QrXIakJl723dWXkdTYvTFHuguFwIvq48PT4BQlswgw1iFg4IhD2XWgV6V3tv5D1ACYOFdfE8xJMwpzRqR8j0pRuNoeE6fOlh13pZUJHYwCvsHOlEUVgDgpAB0Vjj82mJ4CS2Lb7JgXaNAZgqobyDg7g"
              />
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="px-6 py-16 max-w-[1440px] mx-auto" id="features">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-3xl font-bold text-[#191b23]">Advanced Analysis Suite</h2>
            <p className="font-body-md text-[#434655] mt-2">Powerful tools driven by Neural Core and Gemini AI</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Highlight 1: Recording */}
            <div className="md:col-span-2 glass-card rounded-2xl p-8 card-hover-lift flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#004ac6]/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#004ac6]">mic</span>
                </div>
                <h3 className="font-headline-md text-2xl font-bold mb-2">Crystal Recording</h3>
                <p className="font-body-sm text-[#434655]">Low-latency, high-fidelity audio capture designed for clear transcription in any environment.</p>
              </div>
              <div className="mt-8 h-24 bg-[#f3f3fe] rounded-xl flex items-center justify-center overflow-hidden">
                <div className="flex gap-1">
                  <div className="w-1 h-8 bg-[#004ac6] rounded-full animate-[bounce_1s_infinite]"></div>
                  <div className="w-1 h-12 bg-[#004ac6] rounded-full animate-[bounce_1.2s_infinite]"></div>
                  <div className="w-1 h-16 bg-[#004ac6] rounded-full animate-[bounce_0.8s_infinite]"></div>
                  <div className="w-1 h-10 bg-[#004ac6] rounded-full animate-[bounce_1.5s_infinite]"></div>
                </div>
              </div>
            </div>

            {/* Highlight 2: Upload */}
            <div className="glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#00687a]/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#00687a]">cloud_upload</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Batch Upload</h3>
              <p className="font-body-sm text-[#434655]">Process legacy archives. Drag-and-drop support for WAV, MP3, and FLAC formats.</p>
            </div>

            {/* Highlight 3: Speech-to-Text */}
            <div className="glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#dae2fd] rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#4d556b]">translate</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">99% Accuracy</h3>
              <p className="font-body-sm text-[#434655]">Multilingual speech-to-text powered by state-of-the-art transformer models.</p>
            </div>

            {/* Highlight 4: Intent Logic */}
            <div className="md:col-span-1 glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#004ac6]/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#004ac6]">psychology</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Intent Logic</h3>
              <p className="font-body-sm text-[#434655]">Gemini AI detects if the caller is inquiring, complaining, or requesting a callback.</p>
            </div>

            {/* Highlight 5: Summaries */}
            <div className="md:col-span-1 glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#00687a]/10 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#00687a]">summarize</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Auto-Summary</h3>
              <p className="font-body-sm text-[#434655]">Condense 20-minute calls into 3-bullet action points automatically.</p>
            </div>

            {/* Highlight 6: Sentiment */}
            <div className="md:col-span-1 glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#dae2fd] rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#4d556b]">face</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Sentiment</h3>
              <p className="font-body-sm text-[#434655]">Real-time mood mapping to prioritize urgent or dissatisfied customers.</p>
            </div>

            {/* Highlight 7: Recommendations */}
            <div className="md:col-span-1 glass-card rounded-2xl p-8 card-hover-lift">
              <div className="w-12 h-12 bg-[#b4c5ff] rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#004ac6]">lightbulb</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold mb-2">Insights</h3>
              <p className="font-body-sm text-[#434655]">Predictive suggestions for follow-up actions and customer retention.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-[#f3f3fe] py-16" id="how-it-works">
          <div className="px-6 max-w-[1440px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-lg">
                <h2 className="font-headline-lg text-3xl font-bold text-[#191b23]">How It Works</h2>
                <p className="font-body-md text-[#434655] mt-2">A seamless workflow from voice to structured data in under 60 seconds.</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-xl border border-[#c3c6d7] inline-flex items-center gap-3 shadow-sm">
                <span className="material-symbols-outlined text-[#004ac6]">bolt</span>
                <span className="text-label-md font-label-sm text-[#191b23]">Average Processing: 1.2s</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="relative z-10 group">
                <div className="mb-4 text-[#004ac6] font-headline-md text-2xl font-bold opacity-30 group-hover:opacity-100 transition-opacity">01</div>
                <h4 className="font-headline-md text-xl font-bold mb-1">Capture</h4>
                <p className="font-body-sm text-[#434655]">Incoming calls are recorded and streamed directly to our secure Neural Core.</p>
              </div>

              <div className="relative z-10 group">
                <div className="mb-4 text-[#004ac6] font-headline-md text-2xl font-bold opacity-30 group-hover:opacity-100 transition-opacity">02</div>
                <h4 className="font-headline-md text-xl font-bold mb-1">Transcribe</h4>
                <p className="font-body-sm text-[#434655]">Our high-fidelity STT engine converts audio to speaker-labeled text instantly.</p>
              </div>

              <div className="relative z-10 group">
                <div className="mb-4 text-[#004ac6] font-headline-md text-2xl font-bold opacity-30 group-hover:opacity-100 transition-opacity">03</div>
                <h4 className="font-headline-md text-xl font-bold mb-1">Analyze</h4>
                <p className="font-body-sm text-[#434655]">Gemini AI parses the text to identify intent, sentiment, and key entities.</p>
              </div>

              <div className="relative z-10 group">
                <div className="mb-4 text-[#004ac6] font-headline-md text-2xl font-bold opacity-30 group-hover:opacity-100 transition-opacity">04</div>
                <h4 className="font-headline-md text-xl font-bold mb-1">Sync</h4>
                <p className="font-body-sm text-[#434655]">Reports are automatically pushed to your CRM or internal dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 py-16 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="font-headline-lg text-3xl font-bold text-[#191b23]">Scale Your Operations Without Hiring More Staff</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2563eb] rounded-full flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">schedule</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-[#191b23]">Save 80% Time</h4>
                    <p className="font-body-sm text-[#434655]">Automate call logging and summary writing. Free up your team for complex problem solving.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#57dffe] rounded-full flex items-center justify-center text-[#006172]">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-[#191b23]">Unrivaled Accuracy</h4>
                    <p className="font-body-sm text-[#434655]">Eliminate human error in transcription and intent mapping with consistent AI evaluation.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#e1e2ed] rounded-full flex items-center justify-center text-[#004ac6]">
                    <span className="material-symbols-outlined">insights</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-[#191b23]">Deep Customer Insights</h4>
                    <p className="font-body-sm text-[#434655]">Identify recurring issues across thousands of calls with centralized data aggregation.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#dae2fd] rounded-full flex items-center justify-center text-[#4d556b]">
                    <span className="material-symbols-outlined">grid_view</span>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold text-[#191b23]">Instant Organization</h4>
                    <p className="font-body-sm text-[#434655]">Keep your voice logs searchable, tagged, and categorized without manual intervention.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#c3c6d7]/30 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#c3c6d7]/20">
                  <span className="text-label-md font-label-sm font-semibold text-[#004ac6]">Live Transcription</span>
                  <span className="text-label-sm font-label-sm text-[#737686]">02:45 / 05:00</span>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#e7e7f3] flex-shrink-0 flex items-center justify-center text-xs font-bold text-[#434655]">C</div>
                    <div className="bg-[#f3f3fe] p-4 rounded-2xl rounded-tl-none">
                      <p className="text-body-sm text-[#191b23]">"Hello, I'm calling to inquire about my order #1024. It hasn't arrived yet."</p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">AI</div>
                    <div className="bg-[#004ac6] text-white p-4 rounded-2xl rounded-tr-none">
                      <p className="text-body-sm">"I'm sorry to hear that. Let me look that up for you immediately."</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#57dffe]/10 border border-[#00687a]/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[#00687a] text-sm">auto_awesome</span>
                    <span className="text-label-sm font-label-sm text-[#00687a] font-bold">AI DETECTED INTENT</span>
                  </div>
                  <p className="text-body-sm font-bold text-[#006172]">Order Status Inquiry - High Urgency</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 max-w-[1440px] mx-auto">
          <div className="ai-gradient-bg rounded-[40px] p-12 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] -mr-48 -mt-48"></div>
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="font-display-lg text-4xl lg:text-5xl font-bold">Ready to upgrade your reception?</h2>
              <p className="font-body-lg text-lg opacity-90">Join 5,000+ businesses using VoiceDesk AI to automate their communication workflows.</p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={onLaunchApp}
                  className="bg-white text-[#004ac6] px-8 py-4 rounded-xl font-headline-md font-bold hover:bg-opacity-90 active:scale-95 transition-all shadow-md"
                >
                  Get Started Free
                </button>
                <button 
                  onClick={onLaunchApp}
                  className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-xl font-headline-md font-bold hover:bg-white/10 active:scale-95 transition-all"
                >
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#e1e2ed] mt-12 border-t border-[#c3c6d7]/30">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-[1440px] mx-auto gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onLaunchApp}>
              <span className="material-symbols-outlined text-[#004ac6] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>graphic_eq</span>
              <span className="font-headline-md text-xl font-bold text-[#004ac6]">VoiceDesk AI</span>
            </div>
            <p className="font-body-sm text-sm text-[#434655]">© 2024 VoiceDesk AI. Powered by Neural Core &amp; Gemini AI.</p>
          </div>
          <div className="flex gap-8">
            <a className="font-body-sm text-sm text-[#434655] hover:text-[#004ac6]" href="#">Privacy Policy</a>
            <a className="font-body-sm text-sm text-[#434655] hover:text-[#004ac6]" href="#">Terms of Service</a>
            <a className="font-body-sm text-sm text-[#434655] hover:text-[#004ac6]" href="#">Contact Support</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-label-sm font-label-sm text-[#737686]">Stack:</span>
            <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-[#434655] border border-[#c3c6d7]/30">REACT 18</span>
            <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-[#434655] border border-[#c3c6d7]/30">GEMINI 1.5</span>
            <span className="px-2 py-1 bg-white rounded text-[10px] font-bold text-[#434655] border border-[#c3c6d7]/30">TAILWIND</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
