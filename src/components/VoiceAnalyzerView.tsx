import React, { useState, useEffect, useRef } from 'react';
import { useCallSession } from '../context/CallSessionContext';
import { processVoiceAnalysis, DEMO_CALL_SAMPLES } from '../services/voiceAnalysis';

interface VoiceAnalyzerViewProps {
  onGoHome: () => void;
  onAnalyzeSuccess: () => void;
}

export const VoiceAnalyzerView: React.FC<VoiceAnalyzerViewProps> = ({ onGoHome, onAnalyzeSuccess }) => {
  const { addCall, calls, setActiveCall } = useCallSession();

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [, setAudioChunks] = useState<Blob[]>([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('audio/wav');

  // Audio & File Metadata
  const [audioFile, setAudioFile] = useState<string>('live_recording_01.wav');
  const [sampleRate, setSampleRate] = useState<string>('44.1 kHz');
  const [bitrate, setBitrate] = useState<string>('128 kbps');
  const [fileSize, setFileSize] = useState<string>('1.2 MB');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Manual Transcript / Text Prompt state
  const [manualTranscript, setManualTranscript] = useState<string>('');

  // Selected sample call state
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);

  // Analysis Loading State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('Initializing AI Speech Model...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  // Audio element ref for preview
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer effect for recording
  useEffect(() => {
    let interval: any = null;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Handle Browser Microphone Live Recording
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      setMicPermissionDenied(false);
      setIsSimulated(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone recording is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setAudioFile('browser_microphone_recording.wav');
        setMimeType(audioBlob.type || 'audio/wav');
        setFileSize(`${(audioBlob.size / (1024 * 1024)).toFixed(2)} MB`);

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          if (reader.result) {
            setAudioBase64(reader.result.toString());
          }
        };

        // Stop media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      setIsPaused(false);
      setSeconds(0);
    } catch (err: any) {
      console.warn('Microphone access notice:', err?.message || err);
      setMicPermissionDenied(true);
      setErrorMessage('Microphone access was dismissed or unavailable. You can use the "Simulate Live Voice Recording" below, or choose a pre-recorded demo call sample.');
    }
  };

  // Start Simulated Live Voice Recording (fallback when mic permission is dismissed/blocked)
  const startSimulatedRecording = () => {
    setErrorMessage(null);
    setMicPermissionDenied(false);
    setIsSimulated(true);
    setIsRecording(true);
    setIsPaused(false);
    setSeconds(0);
    setAudioFile('simulated_phone_call.wav');
    setFileSize('1.4 MB');
    setBitrate('128 kbps');
    setSampleRate('44.1 kHz');
    setManualTranscript("Hello! My name is Sarah Jenkins from Apex Design Studio. I'm calling to book a routine dental cleaning and consultation for tomorrow, Thursday at 10:00 AM. My number is 415-555-0198.");
  };

  const pauseRecording = () => {
    if (isRecording) {
      if (mediaRecorder && !isSimulated) {
        if (isPaused) {
          mediaRecorder.resume();
        } else {
          mediaRecorder.pause();
        }
      }
      setIsPaused(!isPaused);
    }
  };

  const stopRecording = () => {
    if (isRecording) {
      if (mediaRecorder && !isSimulated) {
        mediaRecorder.stop();
      }
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const resetRecording = () => {
    if (mediaRecorder && !isSimulated && isRecording) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    setIsSimulated(false);
    setSeconds(0);
    setRecordedAudioUrl(null);
    setAudioBase64(null);
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file.name);
      setBitrate('256 kbps');
      setSampleRate('48.0 kHz');
      setMimeType(file.type || 'audio/wav');
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
      setActiveSampleId(null);

      const url = URL.createObjectURL(file);
      setRecordedAudioUrl(url);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result) {
          setAudioBase64(reader.result.toString());
        }
      };
    }
  };

  // Load a demo sample call
  const handleLoadSample = (sample: typeof DEMO_CALL_SAMPLES[0]) => {
    setActiveSampleId(sample.id);
    setAudioFile(`${sample.id}_${sample.category.toLowerCase().replace(/\s+/g, '_')}.wav`);
    setFileSize('1.8 MB');
    setBitrate('192 kbps');
    setSampleRate('44.1 kHz');
    const fullText = sample.transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
    setManualTranscript(fullText);
    setErrorMessage(null);
  };

  const togglePreviewPlayback = () => {
    if (audioRef.current) {
      if (isPlayingPreview) {
        audioRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        audioRef.current.play().catch(() => setIsPlayingPreview(true));
        setIsPlayingPreview(true);
      }
    } else {
      setIsPlayingPreview(!isPlayingPreview);
    }
  };

  // Trigger real AI analysis via robust service with multi-tier fallback
  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStep('Uploading voice audio & running neural speech analysis...');

    try {
      setTimeout(() => {
        setAnalysisStep('Extracting caller details, intent classification & sentiment...');
      }, 1200);

      setTimeout(() => {
        setAnalysisStep('Generating structured summary and follow-up recommendations...');
      }, 2400);

      const result = await processVoiceAnalysis({
        audioBase64: audioBase64 || undefined,
        mimeType: mimeType || 'audio/wav',
        transcriptText: manualTranscript || undefined,
        fileName: audioFile,
      });

      if (result) {
        addCall(result);
        setIsAnalyzing(false);
        onAnalyzeSuccess();
      } else {
        throw new Error('Failed to extract call analysis data.');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'Error processing voice analysis.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8ff] text-[#191b23]">
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <nav aria-label="Breadcrumb" className="flex text-[#434655] text-sm mb-1">
            <ol className="flex items-center space-x-2">
              <li>
                <button onClick={onGoHome} className="hover:text-[#004ac6] transition-colors">
                  Home
                </button>
              </li>
              <li className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-[#191b23] font-medium">Voice Analyzer</span>
              </li>
            </ol>
          </nav>
          <h2 className="font-headline-lg text-3xl font-bold">Voice Analysis Studio</h2>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="ai-gradient-bg text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 text-sm disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Analyze Voice Call
              </>
            )}
          </button>
        </div>
      </header>

      {/* Error & Info Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-[#ffdad6] text-[#410002] border border-[#ba1a1a]/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#ba1a1a]">info</span>
            <span>{errorMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            {micPermissionDenied && (
              <button 
                onClick={startSimulatedRecording}
                className="bg-[#004ac6] text-white px-3 py-1 rounded-lg text-xs hover:bg-[#003896] transition-colors"
              >
                Simulate Voice Recording
              </button>
            )}
            <button onClick={() => setErrorMessage(null)} className="text-[#ba1a1a] hover:underline px-2 py-1">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Demo Call Sample Quick-Loader Bar */}
      <div className="mb-6 bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-xl">library_music</span>
            <div>
              <p className="text-xs font-bold text-[#191b23]">Instant Demo Call Samples</p>
              <p className="text-[11px] text-[#737686]">Select a realistic recorded call to test instant transcription & analysis</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {DEMO_CALL_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleLoadSample(sample)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 border ${
                  activeSampleId === sample.id
                    ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-sm'
                    : 'bg-[#faf8ff] text-[#434655] border-[#c3c6d7]/40 hover:border-[#004ac6] hover:text-[#004ac6]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {sample.category === 'Appointment Booking' ? 'event' : sample.category === 'Sales Inquiry' ? 'trending_up' : 'receipt_long'}
                </span>
                <span>{sample.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Left Workspace: Upload & File Controls */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Drag & Drop Card */}
          <div className="bg-white rounded-[20px] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#c3c6d7]/20 hover:border-[#004ac6]/50 transition-colors cursor-pointer group relative">
            <input 
              type="file" 
              accept="audio/*" 
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
              title="Upload Audio File"
            />
            <div className="border-2 border-dashed border-[#c3c6d7]/50 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 group-hover:bg-[#f3f3fe] transition-colors">
              <div className="w-12 h-12 bg-[#004ac6]/10 rounded-full flex items-center justify-center text-[#004ac6]">
                <span className="material-symbols-outlined text-[32px]">upload_file</span>
              </div>
              <div>
                <p className="font-semibold text-[#191b23]">Upload Audio</p>
                <p className="text-sm text-[#434655]">Drop MP3, WAV, M4A or OGG</p>
              </div>
            </div>
          </div>

          {/* Preview Player */}
          <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#c3c6d7]/20 space-y-3">
            <p className="text-label-sm font-label-sm text-[#434655] uppercase tracking-wider font-semibold">Audio Preview</p>
            
            {recordedAudioUrl && (
              <audio 
                ref={audioRef} 
                src={recordedAudioUrl} 
                onEnded={() => setIsPlayingPreview(false)} 
                className="hidden" 
              />
            )}

            <div className="flex items-center gap-4">
              <button 
                onClick={togglePreviewPlayback}
                className="w-10 h-10 rounded-full bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center hover:bg-[#004ac6] hover:text-white transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPlayingPreview ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <div className="flex-1 h-1.5 bg-[#c3c6d7]/30 rounded-full overflow-hidden relative">
                <div className={`absolute inset-y-0 left-0 bg-[#004ac6] ${isPlayingPreview ? 'w-full transition-all duration-[10000ms]' : 'w-1/3'}`}></div>
              </div>
              <span className="text-label-sm font-label-sm text-[#434655]">
                {isPlayingPreview ? '0:15' : '0:00'}
              </span>
            </div>
          </div>

          {/* File Info Card */}
          <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#c3c6d7]/20">
            <h3 className="font-medium text-base mb-3 border-b border-[#c3c6d7]/20 pb-2">Audio Metadata</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434655]">Filename:</span>
                <span className="font-medium text-[#191b23] truncate max-w-[130px]">{audioFile}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434655]">File Size:</span>
                <span className="font-medium text-[#191b23]">{fileSize}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434655]">Bitrate:</span>
                <span className="font-medium text-[#191b23]">{bitrate}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434655]">Sample Rate:</span>
                <span className="font-medium text-[#191b23]">{sampleRate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Workspace: Main Recorder */}
        <div className="col-span-12 lg:col-span-6 flex flex-col">
          <div className="bg-white rounded-[20px] p-8 shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-[#c3c6d7]/20 flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[420px]">
            <div className="z-10 flex flex-col items-center text-center space-y-8 w-full">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-label-md font-label-sm text-[#004ac6] tracking-widest uppercase font-semibold">
                    {isSimulated ? 'Simulated Live Recorder' : 'Live Voice Recorder'}
                  </span>
                  {isRecording && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping"></span>
                  )}
                </div>
                <h3 className="text-5xl font-display-lg font-bold tracking-tight text-[#191b23]" id="timer">
                  {formatTime(seconds)}
                </h3>
              </div>

              {/* Waveform Visualization */}
              <div className="w-full h-28 flex items-center justify-center gap-1.5 px-4">
                <div className={`w-1.5 bg-[#4cd7f6] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-12' : 'h-4'}`}></div>
                <div className={`w-1.5 bg-[#57dffe] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-24 delay-75' : 'h-6'}`}></div>
                <div className={`w-1.5 bg-[#004ac6] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-32 delay-100' : 'h-8'}`}></div>
                <div className={`w-1.5 bg-[#2563eb] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-16 delay-150' : 'h-5'}`}></div>
                <div className={`w-1.5 bg-[#57dffe] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-28 delay-200' : 'h-7'}`}></div>
                <div className={`w-1.5 bg-[#004ac6] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-20 delay-250' : 'h-6'}`}></div>
                <div className={`w-1.5 bg-[#4cd7f6] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-12 delay-300' : 'h-4'}`}></div>
                <div className="hidden md:flex gap-1.5">
                  <div className={`w-1.5 bg-[#57dffe] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-24' : 'h-5'}`}></div>
                  <div className={`w-1.5 bg-[#004ac6] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-32' : 'h-8'}`}></div>
                  <div className={`w-1.5 bg-[#2563eb] rounded-full transition-all duration-150 ${isRecording && !isPaused ? 'animate-pulse h-16' : 'h-4'}`}></div>
                </div>
              </div>

              {/* Mic Button */}
              <button 
                id="recordBtn"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-36 h-36 rounded-full ai-gradient-bg flex items-center justify-center shadow-[0_15px_40px_rgba(0,74,198,0.3)] hover:scale-105 transition-transform active:scale-95 group relative ${
                  isRecording ? 'animate-pulse ring-4 ring-[#ba1a1a]' : ''
                }`}
                title={isRecording ? 'Click to stop recording' : 'Click to start microphone recording'}
              >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <span className="material-symbols-outlined text-[60px] text-white" id="micIcon" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isRecording ? 'stop_circle' : 'mic'}
                </span>
              </button>

              {/* Control Buttons */}
              <div className="flex items-center gap-8 pt-2">
                <button 
                  onClick={pauseRecording}
                  disabled={!isRecording}
                  className="flex flex-col items-center gap-1 text-[#434655] hover:text-[#004ac6] transition-colors disabled:opacity-40"
                >
                  <div className="w-11 h-11 rounded-full border border-[#c3c6d7] flex items-center justify-center hover:bg-[#f3f3fe]">
                    <span className="material-symbols-outlined text-xl">
                      {isPaused ? 'play_arrow' : 'pause'}
                    </span>
                  </div>
                  <span className="text-label-sm font-label-sm">{isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button 
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="flex flex-col items-center gap-1 text-[#ba1a1a] hover:opacity-80 transition-opacity disabled:opacity-40"
                >
                  <div className="w-11 h-11 rounded-full border border-[#ba1a1a]/50 flex items-center justify-center hover:bg-[#ffdad6]/20">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>stop</span>
                  </div>
                  <span className="text-label-sm font-label-sm">Stop</span>
                </button>

                <button 
                  onClick={resetRecording}
                  className="flex flex-col items-center gap-1 text-[#434655] hover:text-[#004ac6] transition-colors"
                >
                  <div className="w-11 h-11 rounded-full border border-[#c3c6d7] flex items-center justify-center hover:bg-[#f3f3fe]">
                    <span className="material-symbols-outlined text-xl">refresh</span>
                  </div>
                  <span className="text-label-sm font-label-sm">Reset</span>
                </button>
              </div>

              {/* Fallback Simulation Button */}
              <button
                onClick={startSimulatedRecording}
                className="text-xs text-[#004ac6] font-semibold hover:underline flex items-center gap-1 pt-1"
              >
                <span className="material-symbols-outlined text-sm">settings_voice</span>
                Simulate Live Voice Recording (No Mic Needed)
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Transcription Input & Status */}
        <div className="col-span-12 lg:col-span-3 flex flex-col space-y-6">
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#c3c6d7]/20 flex-1 flex flex-col overflow-hidden min-h-[300px]">
            <div className="p-4 border-b border-[#c3c6d7]/10 flex justify-between items-center bg-[#faf8ff]">
              <h3 className="font-semibold text-base">Live Transcript / Input</h3>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#e7e7f3] rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></div>
                <span className="text-[10px] font-label-sm uppercase tracking-tighter text-[#434655]">Ready</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col space-y-2">
              <label className="text-xs text-[#434655] font-semibold">Transcript Text (Optional / Preview):</label>
              <textarea 
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                placeholder={isRecording ? "Transcribing incoming audio stream in real-time..." : "Paste or edit transcript text here, load a demo sample above, or leave blank for automatic voice understanding..."}
                className="w-full flex-1 p-3 text-xs bg-[#faf8ff] border border-[#c3c6d7]/40 rounded-xl focus:outline-none focus:border-[#004ac6] resize-none min-h-[120px]"
              />
            </div>

            <div className="p-4 bg-[#f3f3fe] space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl border border-[#c3c6d7]/20 shadow-xs">
                <span className="material-symbols-outlined text-[#004ac6]">psychology</span>
                <div>
                  <p className="text-label-sm font-bold text-[#191b23]">Neural Voice Engine</p>
                  <p className="text-[11px] text-[#434655]">Multimodal audio & intent extraction</p>
                </div>
              </div>

              <button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full bg-[#191b23] text-white py-2.5 rounded-xl font-medium shadow-md hover:bg-black transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Run AI Analysis
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Progress Overlay */}
          {isAnalyzing && (
            <div className="p-4 bg-[#004ac6] text-white rounded-[20px] shadow-lg space-y-2 animate-pulse">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                <span className="text-xs font-bold uppercase tracking-wider">VoiceDesk AI Processing</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">{analysisStep}</p>
            </div>
          )}

          {/* Status Feedback */}
          <div className="bg-[#2563eb] p-4 rounded-[20px] text-white flex items-center gap-3 shadow-sm">
            <span className="material-symbols-outlined text-[26px] flex-shrink-0">info</span>
            <p className="text-xs font-medium leading-relaxed">Neural reception engine optimized for phone call intent & caller details.</p>
          </div>
        </div>
      </div>

      {/* Session History Bottom List */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-md text-xl font-bold">Current Session Analyzed Calls ({calls.length})</h3>
          <button onClick={onAnalyzeSuccess} className="text-[#004ac6] font-medium hover:underline text-sm">View full dashboard</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {calls.slice(0, 6).map((c) => (
            <div 
              key={c.id}
              onClick={() => {
                setActiveCall(c);
                onAnalyzeSuccess();
              }}
              className="bg-white p-4 rounded-xl shadow-sm border border-[#c3c6d7]/20 flex items-center justify-between hover:border-[#004ac6]/40 transition-all cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center group-hover:bg-[#004ac6] group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#191b23]">{c.caller_name}</p>
                  <p className="text-label-sm text-xs text-[#434655]">{c.intent} • {c.priority} Priority</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#434655] text-sm">chevron_right</span>
            </div>
          ))}
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
