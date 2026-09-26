import React, { useState, useEffect, useRef } from 'react';
import { useCallSession } from '../context/CallSessionContext';
import { processVoiceAnalysis, DEMO_CALL_SAMPLES } from '../services/voiceAnalysis';

interface VoiceAnalyzerViewProps {
  onGoHome: () => void;
  onAnalyzeSuccess: () => void;
}

// 5 rich sample transcript texts for 1-click loading
export const SAMPLE_TRANSCRIPT_TEXTS = [
  {
    id: 'sample-1',
    label: '1. Dental Booking',
    category: 'Appointment Booking',
    icon: 'event',
    caller: 'Sarah Jenkins (Apex Design)',
    text: `Caller: Hello! My name is Sarah Jenkins from Apex Design Studio. I'm calling to book a routine dental cleaning and consultation for tomorrow, Thursday at 10:00 AM if possible.\nAI Receptionist: Hello Sarah! I can certainly assist you with booking a dental cleaning and consultation for tomorrow at 10:00 AM.\nCaller: Wonderful! My phone number is 415-555-0198 and email is sarah.j@apexdesign.io. Could you please send me a confirmation email and have someone call to confirm the slot?\nAI Receptionist: I have logged your contact information, Sarah. Our reception desk will call you back shortly at 415-555-0198 to finalize your appointment.`
  },
  {
    id: 'sample-2',
    label: '2. Enterprise Sales',
    category: 'Sales Inquiry',
    icon: 'trending_up',
    caller: 'Marcus Vance (CloudScale Inc)',
    text: `Caller: Hi there, this is Marcus Vance, VP of Operations at CloudScale Inc. We are evaluating VoiceDesk AI for our 50-seat customer support team.\nAI Receptionist: Hello Marcus! Thank you for considering VoiceDesk AI for CloudScale Inc. How can we best assist your evaluation?\nCaller: We need pricing for Enterprise annual plans with custom CRM integration. You can reach me at marcus@cloudscale.io or 650-555-4821. We'd like to schedule a product demo this Friday at 2:00 PM.\nAI Receptionist: Thank you Marcus. I have forwarded this high-priority inquiry to our enterprise solutions team to prepare your demo for Friday at 2:00 PM.`
  },
  {
    id: 'sample-3',
    label: '3. Billing Dispute',
    category: 'Billing Issue',
    icon: 'receipt_long',
    caller: 'David Miller (Metro Retailers)',
    text: `Caller: Hello, this is David Miller from Metro Retailers. I noticed a duplicate charge of $249 on invoice #8841 this morning on my account. I need this corrected immediately.\nAI Receptionist: Hello David, I understand your concern regarding the double billing on invoice #8841. Let me record this as urgent for our billing team.\nCaller: Please have a billing supervisor call me back as soon as possible at 312-555-8910 or email david@metroretailers.com.\nAI Receptionist: Your callback request is logged with critical priority. A billing supervisor will review invoice #8841 and reach out to you directly.`
  },
  {
    id: 'sample-4',
    label: '4. HVAC Emergency',
    category: 'Technical Support',
    icon: 'ac_unit',
    caller: 'Robert Chen (Oakridge Cafe)',
    text: `Caller: Good morning, my name is Robert Chen at Oakridge Cafe, phone number 206-555-7312. Our main walk-in cooler compressor failed two hours ago and temperatures are rising.\nAI Receptionist: Good morning Robert. An emergency cooler failure is a critical priority for Oakridge Cafe. Are there any error codes displayed?\nCaller: It's flashing error code E-04 on the Carrier refrigeration unit. We need an on-site technician dispatched today before 1:00 PM.\nAI Receptionist: Understood. I am dispatching a high-priority technician ticket for Carrier unit error E-04 to Oakridge Cafe for arrival before 1:00 PM.`
  },
  {
    id: 'sample-5',
    label: '5. Legal IP Consult',
    category: 'Appointment Booking',
    icon: 'gavel',
    caller: 'Elena Rostova (Vanguard BioTech)',
    text: `Caller: Hello, this is Elena Rostova, General Counsel at Vanguard BioTech. My phone is 617-555-9043 and email is elena.rostova@vanguardbio.com.\nAI Receptionist: Hello Elena, welcome to Nexus Legal Partners. How may our corporate practice assist Vanguard BioTech?\nCaller: We are preparing an international patent and trademark filing for our new synthetic protein line and need a 45-minute partner consultation next Tuesday at 3:30 PM.\nAI Receptionist: I have recorded your request for a 45-minute IP and trademark consultation for Vanguard BioTech on next Tuesday at 3:30 PM. Our managing partner's office will send the calendar invitation.`
  }
];

// 5 Sample Audio Presets for the Upload Card
export const SAMPLE_AUDIO_INPUTS = [
  {
    id: 'audio-dental',
    name: 'dental_appointment_booking.wav',
    title: 'Dental Booking Call (WAV)',
    category: 'Appointment',
    size: '1.45 MB',
    duration: '01:24',
    bitrate: '192 kbps',
    sampleRate: '44.1 kHz',
    sampleIndex: 0
  },
  {
    id: 'audio-sales',
    name: 'enterprise_sales_lead.mp3',
    title: 'Enterprise Sales Inquiry (MP3)',
    category: 'Sales Lead',
    size: '2.10 MB',
    duration: '01:45',
    bitrate: '256 kbps',
    sampleRate: '48.0 kHz',
    sampleIndex: 1
  },
  {
    id: 'audio-billing',
    name: 'urgent_billing_dispute.wav',
    title: 'Billing Dispute Call (WAV)',
    category: 'Billing Dispute',
    size: '1.18 MB',
    duration: '01:10',
    bitrate: '192 kbps',
    sampleRate: '44.1 kHz',
    sampleIndex: 2
  },
  {
    id: 'audio-hvac',
    name: 'emergency_hvac_dispatch.wav',
    title: 'Emergency HVAC Repair (WAV)',
    category: 'Support Ticket',
    size: '1.32 MB',
    duration: '01:15',
    bitrate: '192 kbps',
    sampleRate: '44.1 kHz',
    sampleIndex: 3
  },
  {
    id: 'audio-legal',
    name: 'corporate_legal_consult.wav',
    title: 'Legal IP Consultation (WAV)',
    category: 'Legal Consult',
    size: '1.60 MB',
    duration: '01:30',
    bitrate: '192 kbps',
    sampleRate: '44.1 kHz',
    sampleIndex: 4
  }
];

export const SPEAKING_PROMPTS = [
  {
    category: 'Appointment',
    title: 'Dental Checkup Booking (TC-AUDIO-01)',
    icon: 'calendar_month',
    script: 'Hello, my name is John Smith from Apex Dental. I would like to book a dental checkup tomorrow at 11 AM. You can call me back at 987-654-3210. My email is john@example.com. Thank you.',
    expected: 'Intent: Appointment Booking • Caller: John Smith • Phone: 987-654-3210'
  },
  {
    category: 'Sales Quote',
    title: 'Enterprise Software Pricing (TC-AUDIO-02)',
    icon: 'storefront',
    script: 'Hi, this is Sarah from BrightTech. I am interested in your enterprise software pricing. Please send me a quotation. You can reach me at 9876543210.',
    expected: 'Intent: Sales Inquiry • Caller: Sarah • Follow-up: Quotation'
  },
  {
    category: 'Billing Issue',
    title: 'Subscription Double Charge (TC-AUDIO-03)',
    icon: 'receipt_long',
    script: 'Hello, my name is Rahul. I was charged twice for my subscription this month. I need someone to check my billing immediately. Please call me back.',
    expected: 'Intent: Billing Issue • Priority: High/Critical • Follow-up: Yes'
  },
  {
    category: 'Tech Support',
    title: 'Internet & Router Outage (TC-AUDIO-04)',
    icon: 'build',
    script: 'Hi, my internet connection has stopped working. I have restarted the router twice but the problem continues. I need technical support.',
    expected: 'Intent: Technical Support • Service: Internet • Priority: Medium'
  },
  {
    category: 'General Info',
    title: 'Office Working Hours (TC-AUDIO-05)',
    icon: 'schedule',
    script: 'Hello, I wanted to know your office working hours. Are you open on Saturday?',
    expected: 'Intent: General Inquiry • Priority: Low • Callback: No'
  }
];

// Helper to create a short audible tone WAV buffer for browser preview
function generateAudioToneDataUrl(): string {
  try {
    const sampleRate = 8000;
    const duration = 2; // seconds
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    view.setUint32(0, 0x52494646, false); // "RIFF"
    /* file length */
    view.setUint32(4, 36 + numSamples * 2, true);
    /* RIFF type */
    view.setUint32(8, 0x57415645, false); // "WAVE"
    /* format chunk identifier */
    view.setUint32(12, 0x666d7420, false); // "fmt "
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (1 = PCM) */
    view.setUint16(20, 1, true);
    /* channel count (1 = mono) */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    view.setUint32(36, 0x64617461, false); // "data"
    /* data chunk length */
    view.setUint32(40, numSamples * 2, true);

    // write PCM audio samples (440Hz pleasant soft sine wave)
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const freq = 440 + Math.sin(t * 3) * 50;
      const sample = Math.sin(2 * Math.PI * freq * t) * 0.2 * 32767;
      view.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, sample)), true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch (e) {
    return '';
  }
}

export const VoiceAnalyzerView: React.FC<VoiceAnalyzerViewProps> = ({ onGoHome, onAnalyzeSuccess }) => {
  const { addCall } = useCallSession();

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

  // Audio & File Metadata (initially empty until user selects a sample or uploads a file)
  const [audioFile, setAudioFile] = useState<string>('');
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [sampleRate, setSampleRate] = useState<string>('');
  const [bitrate, setBitrate] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Manual Transcript / Text Prompt state (initially empty until user clicks on samples or types)
  const [manualTranscript, setManualTranscript] = useState<string>('');
  const [activeSampleId, setActiveSampleId] = useState<string>('');
  const [activeAudioSampleId, setActiveAudioSampleId] = useState<string>('');

  // Analysis Loading State
  const [actualDuration, setActualDuration] = useState<string>('01:15');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('Initializing AI Speech Model...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [downloadedAudio, setDownloadedAudio] = useState(false);
  const [currentSpeakingLine, setCurrentSpeakingLine] = useState<string>('');
  const [selectedSpeakingPromptIndex, setSelectedSpeakingPromptIndex] = useState<number>(0);

  // Audio element ref for preview
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop any active speech synthesis or audio element playback on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Natural spoken voice synthesis for call dialogue and sample audio
  const playAudibleDialogue = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    window.speechSynthesis.cancel();

    const lines = textToSpeak
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      const defaultUtterance = new SpeechSynthesisUtterance("VoiceDesk AI telephony recording ready for analysis.");
      defaultUtterance.rate = 1.0;
      defaultUtterance.onend = () => {
        setIsPlayingPreview(false);
        setCurrentSpeakingLine('');
      };
      window.speechSynthesis.speak(defaultUtterance);
      return;
    }

    const availableVoices = window.speechSynthesis.getVoices();
    const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
    const callerVoice = englishVoices[0] || availableVoices[0];
    const receptionistVoice = englishVoices[1] || englishVoices[0] || availableVoices[0];

    let lineIndex = 0;

    const speakLineAt = (index: number) => {
      if (index >= lines.length) {
        setIsPlayingPreview(false);
        setCurrentSpeakingLine('');
        return;
      }

      const line = lines[index];
      const isCaller = line.toLowerCase().startsWith('caller:');
      const cleanDialogue = line.replace(/^(caller|ai receptionist|receptionist|agent|customer):\s*/i, '');

      const utterance = new SpeechSynthesisUtterance(cleanDialogue);
      utterance.rate = 0.95; // Natural speaking pace
      utterance.pitch = isCaller ? 1.0 : 1.12; // Slight tonal distinction between caller & receptionist
      if (isCaller && callerVoice) {
        utterance.voice = callerVoice;
      } else if (!isCaller && receptionistVoice) {
        utterance.voice = receptionistVoice;
      }

      setCurrentSpeakingLine(line);

      utterance.onend = () => {
        speakLineAt(index + 1);
      };

      utterance.onerror = () => {
        speakLineAt(index + 1);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakLineAt(0);
  };

  // Download active audio file or generated recording buffer
  const handleDownloadAudio = () => {
    const audioSrc = recordedAudioUrl || (audioBase64 ? `data:${mimeType || 'audio/wav'};base64,${audioBase64.replace(/^data:[^;]+;base64,/, '')}` : null);
    if (!audioSrc) {
      setErrorMessage("No audio is loaded yet. Please record voice audio, upload a file, or select a sample preset to download.");
      return;
    }
    const link = document.createElement('a');
    link.href = audioSrc;
    const defaultName = audioFile || (isSimulated ? 'voicedesk_demo_call.wav' : `voicedesk_recording_${Date.now()}.wav`);
    link.download = defaultName.includes('.') ? defaultName : `${defaultName}.wav`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloadedAudio(true);
    setTimeout(() => setDownloadedAudio(false), 2500);
  };

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

  const formatDurationSec = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Handle Browser Microphone Live Recording with proper container detection
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      setMicPermissionDenied(false);
      setIsSimulated(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone recording is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Determine browser-supported MediaRecorder container/codec
      let supportedMime = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          supportedMime = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          supportedMime = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          supportedMime = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          supportedMime = 'audio/ogg';
        }
      }

      const recorder = supportedMime ? new MediaRecorder(stream, { mimeType: supportedMime }) : new MediaRecorder(stream);
      const actualContainerMime = recorder.mimeType || supportedMime || 'audio/webm';
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: actualContainerMime });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setAudioFile(`microphone_call_recording.${actualContainerMime.includes('mp4') ? 'm4a' : 'webm'}`);
        setMimeType(actualContainerMime);
        setFileSize(`${(audioBlob.size / (1024 * 1024)).toFixed(2)} MB`);
        setIsUploaded(true);
        setActualDuration(formatDurationSec(seconds > 0 ? seconds : 15));

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

  // Start Simulated Live Voice Recording
  const startSimulatedRecording = () => {
    setErrorMessage(null);
    setMicPermissionDenied(false);
    setIsSimulated(true);
    setIsRecording(true);
    setIsPaused(false);
    setSeconds(0);
    setAudioFile('simulated_phone_call.wav');
    setIsUploaded(true);
    setFileSize('1.4 MB');
    setBitrate('128 kbps');
    setSampleRate('44.1 kHz');
    setActualDuration('01:24');
    const toneUrl = generateAudioToneDataUrl();
    if (toneUrl) setRecordedAudioUrl(toneUrl);
    setManualTranscript(SAMPLE_TRANSCRIPT_TEXTS[0].text);
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
      if (seconds > 0) {
        setActualDuration(formatDurationSec(seconds));
      }
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
    setIsUploaded(false);
    setAudioFile('');
    setFileSize('');
    setSampleRate('');
    setBitrate('');
    setActualDuration('01:15');
    setManualTranscript('');
    setActiveSampleId('');
    setActiveAudioSampleId('');
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlayingPreview(false);
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Strict validation for audio uploads (empty check, size <= 50MB, MIME check)
  const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50 MB
  const ALLOWED_MIME_TYPES = [
    'audio/wav',
    'audio/x-wav',
    'audio/wave',
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',
    'audio/m4a',
    'audio/x-m4a',
    'audio/aac',
    'audio/ogg',
    'audio/vorbis',
    'audio/flac',
    'audio/x-flac',
    'audio/webm'
  ];
  const ALLOWED_EXTENSIONS = ['.wav', '.mp3', '.m4a', '.ogg', '.flac', '.webm', '.aac', '.mp4'];

  const validateAndProcessFile = (file: File) => {
    setErrorMessage(null);
    if (!file) return;

    // Check for empty file
    if (file.size === 0) {
      setErrorMessage('The selected audio file is empty (0 bytes). Please upload a valid audio recording.');
      return;
    }

    // Check file size ceiling (50 MB)
    if (file.size > MAX_AUDIO_SIZE) {
      setErrorMessage(`Audio files must be 50 MB or smaller. The selected file is ${(file.size / (1024 * 1024)).toFixed(1)} MB.`);
      return;
    }

    // Validate MIME type & file extension
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some(ext => fileNameLower.endsWith(ext));
    const cleanMime = file.type ? file.type.toLowerCase().split(';')[0].trim() : '';
    const hasValidMime = cleanMime ? ALLOWED_MIME_TYPES.includes(cleanMime) || cleanMime.startsWith('audio/') : true;

    if (!hasValidExt && !hasValidMime) {
      setErrorMessage('Unsupported audio format. Use WAV, MP3, M4A, OGG, FLAC, or WebM audio files.');
      return;
    }

    setAudioFile(file.name);
    setIsUploaded(true);
    setActiveAudioSampleId('custom-file');
    setBitrate('256 kbps');
    setSampleRate('48.0 kHz');
    setMimeType(cleanMime || 'audio/wav');
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);

    const url = URL.createObjectURL(file);
    setRecordedAudioUrl(url);

    // Calculate actual audio duration from audio element metadata
    const tempAudio = new Audio(url);
    tempAudio.onloadedmetadata = () => {
      if (tempAudio.duration && !isNaN(tempAudio.duration) && tempAudio.duration > 0) {
        setActualDuration(formatDurationSec(Math.round(tempAudio.duration)));
      }
    };

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (reader.result) {
        setAudioBase64(reader.result.toString());
      }
    };
  };

  // Handle User File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // Load a 1-click Sample Audio Preset onto the Upload card
  const handleLoadSampleAudio = (sampleAudio: typeof SAMPLE_AUDIO_INPUTS[0]) => {
    setActiveAudioSampleId(sampleAudio.id);
    setAudioFile(sampleAudio.name);
    setIsUploaded(true);
    setFileSize(sampleAudio.size);
    setBitrate(sampleAudio.bitrate);
    setSampleRate(sampleAudio.sampleRate);
    setActualDuration(sampleAudio.duration);
    setMimeType(sampleAudio.name.endsWith('.mp3') ? 'audio/mp3' : 'audio/wav');
    const toneUrl = generateAudioToneDataUrl();
    if (toneUrl) setRecordedAudioUrl(toneUrl);
    
    // Also sync with corresponding transcript sample if matching
    const transcriptSample = SAMPLE_TRANSCRIPT_TEXTS[sampleAudio.sampleIndex];
    if (transcriptSample) {
      setActiveSampleId(transcriptSample.id);
      setManualTranscript(transcriptSample.text);
    }
    setErrorMessage(null);
  };

  // Load one of the 5 Sample Transcripts
  const handleSelectSampleTranscript = (sample: typeof SAMPLE_TRANSCRIPT_TEXTS[0]) => {
    setActiveSampleId(sample.id);
    setManualTranscript(sample.text);
    setErrorMessage(null);
    
    // Also sync the audio file metadata if available
    const audioPreset = SAMPLE_AUDIO_INPUTS.find(a => a.sampleIndex === SAMPLE_TRANSCRIPT_TEXTS.findIndex(s => s.id === sample.id));
    if (audioPreset) {
      setActiveAudioSampleId(audioPreset.id);
      setAudioFile(audioPreset.name);
      setIsUploaded(true);
      setFileSize(audioPreset.size);
      setActualDuration(audioPreset.duration);
    }
  };

  // Trigger preview playback with clear audible voice and dialogue speech synthesis
  const togglePreviewPlayback = () => {
    if (isPlayingPreview) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingPreview(false);
      setCurrentSpeakingLine('');
    } else {
      setIsPlayingPreview(true);

      // If user uploaded a custom audio file, try playing the audio element
      const hasCustomUpload = audioFile && !activeAudioSampleId && recordedAudioUrl && !isSimulated;
      if (hasCustomUpload && audioRef.current) {
        audioRef.current.play().catch(() => {
          // Fallback to speech synthesis
          playAudibleDialogue(manualTranscript || "Playing voice audio recording.");
        });
      } else {
        // Play clear, audible speech synthesis for the conversation
        const textToPlay = manualTranscript || (activeAudioSampleId ? SAMPLE_TRANSCRIPT_TEXTS[SAMPLE_AUDIO_INPUTS.findIndex(a => a.id === activeAudioSampleId)]?.text : '') || "Hello, this is VoiceDesk AI. Voice call recording loaded and ready for analysis.";
        playAudibleDialogue(textToPlay);
      }
    }
  };

  // 1. Analyze specifically from Uploaded Audio File / Preset
  const handleAnalyzeUpload = async () => {
    if (!isUploaded && !audioBase64 && !audioFile) {
      setErrorMessage("Please upload an audio file (WAV, MP3, M4A, OGG) or select one of the sample audio presets first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStep('Uploading audio file & running acoustic feature extraction...');

    try {
      setTimeout(() => {
        setAnalysisStep('Performing speech-to-text diarization & caller classification...');
      }, 1000);

      setTimeout(() => {
        setAnalysisStep('Generating structured call record and action items...');
      }, 2000);

      const result = await processVoiceAnalysis({
        audioBase64: audioBase64 || undefined,
        mimeType: mimeType || 'audio/wav',
        fileName: audioFile || 'Uploaded-Voice-Call.wav',
        actualDuration: actualDuration || '01:15',
      });

      if (result) {
        addCall(result);
        setIsAnalyzing(false);
        onAnalyzeSuccess();
      } else {
        throw new Error('Failed to extract call analysis data from uploaded audio.');
      }
    } catch (err: any) {
      console.error('Upload analysis error:', err);
      setErrorMessage(err.message || 'Error processing uploaded audio.');
      setIsAnalyzing(false);
    }
  };

  // 2. Analyze specifically from Live Voice Recording
  const handleAnalyzeRecording = async () => {
    if (!recordedAudioUrl && !audioBase64 && seconds === 0 && !isSimulated) {
      setErrorMessage("Please record your voice using the microphone or click 'Simulate Live Voice Recording' first before analyzing.");
      return;
    }

    // If microphone is actively recording, stop it now
    if (isRecording) {
      stopRecording();
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStep('Processing live microphone audio capture & transcription...');

    try {
      setTimeout(() => {
        setAnalysisStep('Analyzing caller speech sentiment, intent & urgency...');
      }, 1000);

      setTimeout(() => {
        setAnalysisStep('Finalizing call record and follow-up recommendations...');
      }, 2000);

      const recDuration = seconds > 0 ? formatDurationSec(seconds) : (actualDuration || '00:45');
      const result = await processVoiceAnalysis({
        audioBase64: audioBase64 || undefined,
        mimeType: mimeType || 'audio/webm',
        transcriptText: isSimulated ? manualTranscript : undefined,
        fileName: isSimulated ? 'Simulated-Reception-Call.wav' : `Live-Mic-Recording-${new Date().toLocaleTimeString().replace(/\s+/g, '')}.webm`,
        actualDuration: recDuration,
      });

      if (result) {
        addCall(result);
        setIsAnalyzing(false);
        onAnalyzeSuccess();
      } else {
        throw new Error('Failed to analyze live voice recording.');
      }
    } catch (err: any) {
      console.error('Recording analysis error:', err);
      setErrorMessage(err.message || 'Error processing voice recording.');
      setIsAnalyzing(false);
    }
  };

  // 3. Analyze specifically from Transcript Text
  const handleAnalyzeTranscript = async () => {
    if (!manualTranscript.trim()) {
      setErrorMessage("Please enter transcript text or select one of the 5 sample transcript presets above first.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStep('Parsing transcript text & extracting caller intent and metadata...');

    try {
      setTimeout(() => {
        setAnalysisStep('Classifying caller sentiment and prioritizing business action...');
      }, 1000);

      setTimeout(() => {
        setAnalysisStep('Creating structured call record and action summary...');
      }, 2000);

      const result = await processVoiceAnalysis({
        transcriptText: manualTranscript.trim(),
        fileName: 'Transcript-Input.txt',
        actualDuration: actualDuration || '01:20',
      });

      if (result) {
        addCall(result);
        setIsAnalyzing(false);
        onAnalyzeSuccess();
      } else {
        throw new Error('Failed to extract call data from transcript text.');
      }
    } catch (err: any) {
      console.error('Transcript analysis error:', err);
      setErrorMessage(err.message || 'Error processing transcript text.');
      setIsAnalyzing(false);
    }
  };

  // Trigger real AI analysis via robust service with multi-tier fallback
  const handleRunAnalysis = async () => {
    if (!isUploaded && !recordedAudioUrl && !manualTranscript.trim()) {
      setErrorMessage("Please select one of the 5 demo call presets, load a sample audio, upload a file, or type a transcript to begin analysis.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisStep('Uploading voice audio & running neural speech analysis...');

    try {
      setTimeout(() => {
        setAnalysisStep('Extracting caller details, intent classification & sentiment...');
      }, 1000);

      setTimeout(() => {
        setAnalysisStep('Generating structured summary and follow-up recommendations...');
      }, 2000);

      const result = await processVoiceAnalysis({
        audioBase64: audioBase64 || undefined,
        mimeType: mimeType || 'audio/wav',
        transcriptText: manualTranscript || undefined,
        fileName: audioFile,
        actualDuration: actualDuration || '01:15',
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

      {/* Top Demo Call Samples Bar (5 rich presets) */}
      <div className="mb-6 bg-white p-4 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-xl">library_music</span>
            <div>
              <p className="text-xs font-bold text-[#191b23]">5 Instant Demo Call Samples</p>
              <p className="text-[11px] text-[#737686]">Select a realistic business call preset to load audio, transcript & test instant analysis</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_TRANSCRIPT_TEXTS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleSelectSampleTranscript(sample)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 border ${
                  activeSampleId === sample.id
                    ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-sm'
                    : 'bg-[#faf8ff] text-[#434655] border-[#c3c6d7]/40 hover:border-[#004ac6] hover:text-[#004ac6]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {sample.icon}
                </span>
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Left Workspace: Upload & File Controls with Sample Audio Presets */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Drag & Drop Card */}
          <div className={`bg-white rounded-[20px] p-5 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border transition-all cursor-pointer group relative ${
            isUploaded ? 'border-[#004ac6] bg-[#f3f3fe]/40 ring-2 ring-[#004ac6]/20' : 'border-[#c3c6d7]/20 hover:border-[#004ac6]/50'
          }`}>
            <input 
              type="file" 
              accept=".wav,.mp3,.m4a,.ogg,.flac,.webm,audio/wav,audio/mpeg,audio/mp4,audio/ogg,audio/flac,audio/webm" 
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer z-20" 
              title={isUploaded ? "Click to change uploaded file or drop a new audio" : "Upload Audio File"}
            />
            {isUploaded ? (
              <div className="border-2 border-[#004ac6]/40 bg-[#004ac6]/5 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-2 transition-colors">
                <div className="w-11 h-11 bg-[#004ac6] rounded-full flex items-center justify-center text-white shadow-sm animate-bounce-once">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#57dffe]/30 text-[#006172] text-[11px] font-bold uppercase tracking-wider mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00687a]"></span>
                    Uploaded
                  </div>
                  <p className="font-bold text-[#191b23] text-sm truncate max-w-[200px]" title={audioFile}>
                    {audioFile}
                  </p>
                  <p className="text-xs text-[#004ac6] font-semibold mt-0.5">{fileSize} • Ready to Analyze</p>
                </div>
                <span className="text-[11px] text-[#737686] underline group-hover:text-[#004ac6] transition-colors">
                  Click or drop to replace file
                </span>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#c3c6d7]/50 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 group-hover:bg-[#f3f3fe] transition-colors">
                <div className="w-12 h-12 bg-[#004ac6]/10 rounded-full flex items-center justify-center text-[#004ac6]">
                  <span className="material-symbols-outlined text-[32px]">upload_file</span>
                </div>
                <div>
                  <p className="font-semibold text-[#191b23]">Upload Audio</p>
                  <p className="text-sm text-[#434655]">Drop MP3, WAV, M4A or OGG</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sample Audio Preset Buttons for Upload Card */}
          <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#c3c6d7]/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#191b23] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#004ac6]">audio_file</span>
                Sample Audio Inputs
              </span>
              <span className="text-[10px] bg-[#f3f3fe] text-[#004ac6] px-2 py-0.5 rounded-full font-semibold">1-Click Load</span>
            </div>
            <p className="text-[11px] text-[#737686]">Choose a preloaded audio sample to instantly test the upload workflow:</p>
            <div className="space-y-1.5">
              {SAMPLE_AUDIO_INPUTS.map((sampleAudio) => (
                <button
                  key={sampleAudio.id}
                  onClick={() => handleLoadSampleAudio(sampleAudio)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                    activeAudioSampleId === sampleAudio.id && isUploaded
                      ? 'bg-[#004ac6]/10 border-[#004ac6] text-[#004ac6] font-semibold'
                      : 'bg-[#faf8ff] border-[#c3c6d7]/30 text-[#434655] hover:bg-[#f3f3fe] hover:border-[#004ac6]/50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-sm flex-shrink-0">
                      {sampleAudio.name.endsWith('.mp3') ? 'music_note' : 'mic'}
                    </span>
                    <span className="truncate">{sampleAudio.title}</span>
                  </div>
                  <span className="text-[10px] text-[#737686] flex-shrink-0 ml-1">{sampleAudio.size}</span>
                </button>
              ))}
            </div>

            {/* Dedicated Analyze Button for Uploaded Audio File / Preset */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyzeUpload}
                disabled={isAnalyzing}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
                  isUploaded
                    ? 'bg-[#004ac6] text-white hover:bg-[#003896] ring-2 ring-[#004ac6]/30 shadow-[#004ac6]/20'
                    : 'bg-[#f3f3fe] text-[#004ac6] hover:bg-[#004ac6] hover:text-white border border-[#004ac6]/30'
                }`}
                title="Analyze uploaded audio file or loaded sample preset"
              >
                <span className="material-symbols-outlined text-base">
                  {isAnalyzing ? 'sync' : 'upload_file'}
                </span>
                <span>{isAnalyzing ? 'Analyzing Audio...' : 'Analyze Uploaded Audio'}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Preview Player */}
          <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#c3c6d7]/20 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <p className="text-label-sm font-label-sm text-[#434655] uppercase tracking-wider font-semibold">Audio Preview</p>
                {(recordedAudioUrl || manualTranscript) && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                    isPlayingPreview ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-[#004ac6]/10 text-[#004ac6]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isPlayingPreview ? 'bg-emerald-500' : 'bg-[#004ac6]'}`}></span>
                    {isPlayingPreview ? 'Playing Audible Voice' : 'Audible Voice Ready'}
                  </span>
                )}
              </div>

              {/* Download Option for Loaded/Recorded Audio */}
              <button
                onClick={handleDownloadAudio}
                disabled={!recordedAudioUrl && !audioBase64}
                className="flex items-center gap-1.5 text-xs text-[#004ac6] hover:text-white bg-[#004ac6]/10 hover:bg-[#004ac6] font-semibold px-2.5 py-1 rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xs active:scale-95"
                title={recordedAudioUrl || audioBase64 ? `Download ${audioFile || 'audio recording'}` : 'Load an audio preset or record audio first'}
              >
                <span className="material-symbols-outlined text-sm">
                  {downloadedAudio ? 'check_circle' : 'download'}
                </span>
                <span>{downloadedAudio ? 'Downloaded!' : 'Download Audio'}</span>
              </button>
            </div>
            
            {recordedAudioUrl && (
              <audio 
                ref={audioRef} 
                src={recordedAudioUrl} 
                onEnded={() => {
                  setIsPlayingPreview(false);
                  setCurrentSpeakingLine('');
                }} 
                className="hidden" 
              />
            )}

            <div className="flex items-center gap-4">
              <button 
                onClick={togglePreviewPlayback}
                disabled={!recordedAudioUrl && !manualTranscript.trim() && !activeAudioSampleId}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40 shadow-sm active:scale-95 ${
                  isPlayingPreview 
                    ? 'bg-[#ba1a1a] text-white hover:bg-red-700' 
                    : 'bg-[#004ac6]/10 text-[#004ac6] hover:bg-[#004ac6] hover:text-white'
                }`}
                title={isPlayingPreview ? "Stop voice audio playback" : "Play audible voice conversation"}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPlayingPreview ? 'stop' : 'volume_up'}
                </span>
              </button>

              <div className="flex-1 space-y-1">
                <div className="h-2 bg-[#c3c6d7]/30 rounded-full overflow-hidden relative">
                  <div className={`h-full bg-gradient-to-r from-[#004ac6] to-[#57dffe] rounded-full ${
                    isPlayingPreview ? 'w-full animate-pulse transition-all duration-300' : ((recordedAudioUrl || manualTranscript) ? 'w-1/4' : 'w-0')
                  }`}></div>
                </div>

                {/* Animated Equalizer Wave while speaking */}
                {isPlayingPreview && (
                  <div className="flex items-center justify-center gap-1 h-3 pt-0.5">
                    <span className="w-1 h-2 bg-[#004ac6] rounded-full animate-bounce"></span>
                    <span className="w-1 h-3 bg-[#004ac6] rounded-full animate-bounce delay-75"></span>
                    <span className="w-1 h-2 bg-[#57dffe] rounded-full animate-bounce delay-150"></span>
                    <span className="w-1 h-3.5 bg-[#004ac6] rounded-full animate-bounce delay-100"></span>
                    <span className="w-1 h-2 bg-[#57dffe] rounded-full animate-bounce delay-200"></span>
                  </div>
                )}
              </div>

              <span className="text-label-sm font-label-sm text-[#434655] font-mono text-xs">
                {isPlayingPreview ? 'Audible' : ((recordedAudioUrl || manualTranscript) ? 'Ready' : '0:00')}
              </span>
            </div>

            {/* Live Speaking Dialogue Subtitle */}
            {isPlayingPreview && currentSpeakingLine && (
              <div className="p-2.5 bg-[#f3f3fe] border border-[#004ac6]/20 rounded-xl text-xs text-[#191b23] leading-relaxed animate-fade-in flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-[#004ac6] mt-0.5">record_voice_over</span>
                <p className="line-clamp-2 italic font-medium">{currentSpeakingLine}</p>
              </div>
            )}
          </div>

          {/* File Info Card */}
          <div className="bg-white rounded-[20px] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#c3c6d7]/20">
            <div className="flex justify-between items-center mb-3 border-b border-[#c3c6d7]/20 pb-2">
              <h3 className="font-medium text-base text-[#191b23]">Audio Metadata</h3>
              {(recordedAudioUrl || audioBase64) && (
                <button
                  onClick={handleDownloadAudio}
                  className="text-xs text-[#004ac6] font-semibold hover:underline flex items-center gap-1"
                  title="Download raw audio file"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Save Audio
                </button>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434655]">Filename:</span>
                <span className="font-medium text-[#191b23] truncate max-w-[130px]" title={audioFile || 'No file selected'}>
                  {audioFile || 'None (Load sample or upload)'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434655]">File Size:</span>
                <span className="font-medium text-[#191b23]">{fileSize || '—'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434655]">Bitrate:</span>
                <span className="font-medium text-[#191b23]">{bitrate || '—'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#434655]">Sample Rate:</span>
                <span className="font-medium text-[#191b23]">{sampleRate || '—'}</span>
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

              {/* Dedicated Analyze Button for Live Voice Recording */}
              <div className="w-full pt-2">
                <button
                  type="button"
                  onClick={handleAnalyzeRecording}
                  disabled={isAnalyzing}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 ${
                    recordedAudioUrl || seconds > 0 || isSimulated
                      ? 'ai-gradient-bg text-white hover:shadow-lg ring-2 ring-[#004ac6]/30'
                      : 'bg-[#f3f3fe] text-[#004ac6] hover:bg-[#004ac6] hover:text-white border border-[#004ac6]/30'
                  }`}
                  title="Analyze live recorded speech or simulation"
                >
                  <span className="material-symbols-outlined text-lg">
                    {isAnalyzing ? 'sync' : 'record_voice_over'}
                  </span>
                  <span>{isAnalyzing ? 'Analyzing Voice Recording...' : 'Analyze Recorded Voice'}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
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

              {/* Interactive Example Scripts to Speak (Teleprompter Guide) */}
              <div className="w-full mt-4 pt-4 border-t border-[#c3c6d7]/30 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#004ac6]">record_voice_over</span>
                    <span className="text-xs font-bold text-[#191b23] uppercase tracking-wider">
                      Example What To Say into Mic
                    </span>
                  </div>
                  <span className="text-[10px] bg-[#004ac6]/10 text-[#004ac6] font-bold px-2 py-0.5 rounded-full">
                    Voice Prompts
                  </span>
                </div>

                {/* Categories Tab Selector */}
                <div className="flex flex-wrap gap-1.5">
                  {SPEAKING_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSpeakingPromptIndex(idx)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 border ${
                        selectedSpeakingPromptIndex === idx
                          ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-xs font-semibold'
                          : 'bg-[#faf8ff] text-[#434655] border-[#c3c6d7]/40 hover:border-[#004ac6]/50 hover:text-[#004ac6]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">{prompt.icon}</span>
                      <span>{prompt.category}</span>
                    </button>
                  ))}
                </div>

                {/* Prompt Script Preview Box */}
                <div className="bg-[#f8f9fe] border border-[#004ac6]/20 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#004ac6]">
                      {SPEAKING_PROMPTS[selectedSpeakingPromptIndex].title}
                    </span>
                    <span className="text-[10px] text-[#737686] hidden sm:inline">
                      {SPEAKING_PROMPTS[selectedSpeakingPromptIndex].expected}
                    </span>
                  </div>

                  <p className="text-xs text-[#191b23] italic font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-[#c3c6d7]/30 select-all">
                    "{SPEAKING_PROMPTS[selectedSpeakingPromptIndex].script}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#006172] bg-[#57dffe]/20 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00687a]"></span>
                      <span>Read this aloud when recording</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setManualTranscript(SPEAKING_PROMPTS[selectedSpeakingPromptIndex].script);
                        }}
                        className="text-[11px] font-semibold text-[#004ac6] hover:underline flex items-center gap-1"
                        title="Copy this text into the transcript input"
                      >
                        <span className="material-symbols-outlined text-xs">edit_note</span>
                        Use as Transcript
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Transcription Input with 5 Sample Texts */}
        <div className="col-span-12 lg:col-span-3 flex flex-col space-y-6">
          <div className="bg-white rounded-[20px] shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-[#c3c6d7]/20 flex-1 flex flex-col overflow-hidden min-h-[340px]">
            <div className="p-4 border-b border-[#c3c6d7]/10 flex justify-between items-center bg-[#faf8ff]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-[#004ac6]">subject</span>
                <h3 className="font-semibold text-sm">5 Sample Transcripts & Input</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#e7e7f3] rounded-full">
                <div className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></div>
                <span className="text-[10px] font-label-sm uppercase tracking-tighter text-[#434655]">5 Presets</span>
              </div>
            </div>

            {/* 5 Sample Transcript Buttons */}
            <div className="p-3 bg-[#f8f9fe] border-b border-[#c3c6d7]/20 space-y-2">
              <span className="text-[11px] font-bold text-[#434655] uppercase tracking-wider block">
                Select from 5 Sample Texts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_TRANSCRIPT_TEXTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSampleTranscript(sample)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 border ${
                      activeSampleId === sample.id
                        ? 'bg-[#004ac6] text-white border-[#004ac6] shadow-xs'
                        : 'bg-white text-[#434655] border-[#c3c6d7]/40 hover:border-[#004ac6] hover:text-[#004ac6]'
                    }`}
                    title={`Load transcript for ${sample.caller}`}
                  >
                    <span className="material-symbols-outlined text-[12px]">{sample.icon}</span>
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Transcript Area */}
            <div className="p-4 flex-1 flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-[#434655] font-semibold">Transcript Text:</label>
                <span className="text-[10px] text-[#737686]">{manualTranscript.length} characters</span>
              </div>
              <textarea 
                value={manualTranscript}
                onChange={(e) => setManualTranscript(e.target.value)}
                placeholder={isRecording ? "Transcribing incoming audio stream in real-time..." : "Click any of the 5 sample buttons above, paste your own transcript, or leave blank for neural speech parsing..."}
                className="w-full flex-1 p-3 text-xs font-mono leading-relaxed bg-[#faf8ff] border border-[#c3c6d7]/40 rounded-xl focus:outline-none focus:border-[#004ac6] resize-none min-h-[140px]"
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
                type="button"
                onClick={handleAnalyzeTranscript}
                disabled={isAnalyzing}
                className={`w-full py-3 px-4 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 text-sm active:scale-95 disabled:opacity-50 ${
                  manualTranscript.trim()
                    ? 'bg-[#191b23] text-white hover:bg-black ring-2 ring-black/20'
                    : 'bg-[#e1e2ed] text-[#434655] hover:bg-[#191b23] hover:text-white'
                }`}
                title="Analyze typed or preset transcript text"
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    Analyzing Transcript...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    Analyze Transcript Text
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
            <div>
              <p className="text-sm font-semibold">Active Mode</p>
              <p className="text-xs opacity-90">Ready for audio upload, 5 preset transcripts, or live speech.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
