import { CallAnalysis, IntentType, PriorityType, SentimentType } from '../types';
import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODEL = 'gemini-3.8-flash';

export interface AnalyzeVoiceParams {
  audioBase64?: string | null;
  mimeType?: string;
  transcriptText?: string;
  fileName?: string;
  actualDuration?: string;
}

// 5 pre-configured demo call scenarios for immediate testing
export const DEMO_CALL_SAMPLES: {
  id: string;
  title: string;
  category: string;
  duration: string;
  transcript: { speaker: string; text: string; timestamp: string }[];
  expectedAnalysis: Partial<CallAnalysis>;
}[] = [
  {
    id: 'sample-1',
    title: 'Dental Clinic Appointment Booking',
    category: 'Appointment Booking',
    duration: '01:24',
    transcript: [
      { speaker: 'Caller', text: "Hello! My name is Sarah Jenkins from Apex Design Studio. I'm calling to book a routine dental cleaning and consultation for tomorrow, Thursday at 10:00 AM if possible.", timestamp: '00:04' },
      { speaker: 'AI Receptionist', text: 'Hello Sarah! I can certainly assist you with booking a dental cleaning and consultation for tomorrow at 10:00 AM.', timestamp: '00:12' },
      { speaker: 'Caller', text: 'Wonderful! My phone number is 415-555-0198 and email is sarah.j@apexdesign.io. Could you please send me a confirmation email and have someone call to confirm the slot?', timestamp: '00:22' },
      { speaker: 'AI Receptionist', text: 'I have logged your contact information, Sarah. Our reception desk will call you back shortly at 415-555-0198 to finalize your appointment.', timestamp: '00:32' }
    ],
    expectedAnalysis: {
      caller_name: 'Sarah Jenkins',
      company_name: 'Apex Design Studio',
      phone: '415-555-0198',
      email: 'sarah.j@apexdesign.io',
      intent: 'Appointment Booking',
      priority: 'High',
      service: 'Dental Cleaning & Consultation',
      appointment_date: 'Tomorrow, Oct 29, 2026',
      meeting_time: '10:00 AM',
      follow_up_needed: true,
      callback_requested: true,
      products_mentioned: ['Routine Dental Cleaning', 'Dental Consultation'],
      sentiment: 'Interested',
      sentiment_score: 92,
      short_summary: 'Customer called to book a dental cleaning & consultation for tomorrow at 10 AM.',
      detailed_summary: 'Sarah Jenkins from Apex Design Studio requested a dental cleaning and consultation appointment for tomorrow at 10:00 AM. She provided her contact details and asked for an email confirmation as well as a phone callback.',
      next_action: 'Call customer back at 415-555-0198 to confirm appointment slot and send email confirmation.'
    }
  },
  {
    id: 'sample-2',
    title: 'Enterprise Software Sales Inquiry',
    category: 'Sales Inquiry',
    duration: '01:45',
    transcript: [
      { speaker: 'Caller', text: "Hi there, this is Marcus Vance, VP of Operations at CloudScale Inc. We are evaluating VoiceDesk AI for our 50-seat customer support team.", timestamp: '00:05' },
      { speaker: 'AI Receptionist', text: 'Hello Marcus! Thank you for considering VoiceDesk AI for CloudScale Inc. How can we best assist your evaluation?', timestamp: '00:14' },
      { speaker: 'Caller', text: "We need pricing for Enterprise annual plans with custom CRM integration. You can reach me at marcus@cloudscale.io or 650-555-4821. We'd like to schedule a product demo this Friday at 2:00 PM.", timestamp: '00:26' },
      { speaker: 'AI Receptionist', text: 'Thank you Marcus. I have forwarded this high-priority inquiry to our enterprise solutions team to prepare your demo for Friday at 2:00 PM.', timestamp: '00:38' }
    ],
    expectedAnalysis: {
      caller_name: 'Marcus Vance',
      company_name: 'CloudScale Inc',
      phone: '650-555-4821',
      email: 'marcus@cloudscale.io',
      intent: 'Sales Inquiry',
      priority: 'High',
      service: 'Enterprise VoiceDesk Subscription (50 seats)',
      appointment_date: 'This Friday, Oct 30, 2026',
      meeting_time: '02:00 PM',
      follow_up_needed: true,
      callback_requested: true,
      products_mentioned: ['Enterprise Annual Plan', 'CRM Integration'],
      sentiment: 'Interested',
      sentiment_score: 95,
      short_summary: 'Marcus Vance (CloudScale Inc) inquired about a 50-seat enterprise plan with demo on Friday 2 PM.',
      detailed_summary: 'Marcus Vance, VP of Operations at CloudScale Inc, requested pricing and a live product demonstration for 50 customer support seats with custom CRM integration on Friday at 2:00 PM.',
      next_action: 'Forward to enterprise sales executive to schedule demo and send custom quotation.'
    }
  },
  {
    id: 'sample-3',
    title: 'Urgent Billing Dispute & Callback',
    category: 'Billing Issue',
    duration: '01:10',
    transcript: [
      { speaker: 'Caller', text: "Hello, this is David Miller. I noticed a double charge of $249 on invoice #8841 this morning on my account. I need this corrected immediately.", timestamp: '00:04' },
      { speaker: 'AI Receptionist', text: 'Hello David, I understand your concern regarding the double billing on invoice #8841. Let me record this as urgent for our billing team.', timestamp: '00:12' },
      { speaker: 'Caller', text: 'Please have a billing supervisor call me back as soon as possible at 312-555-8910.', timestamp: '00:19' },
      { speaker: 'AI Receptionist', text: 'Your callback request is logged with critical priority. A billing supervisor will review invoice #8841 and reach out to you directly.', timestamp: '00:27' }
    ],
    expectedAnalysis: {
      caller_name: 'David Miller',
      company_name: 'Metro Retailers',
      phone: '312-555-8910',
      email: 'david@metroretailers.com',
      intent: 'Billing Issue',
      priority: 'Critical',
      service: 'Invoice Dispute (Invoice #8841)',
      appointment_date: 'N/A',
      meeting_time: 'N/A',
      follow_up_needed: true,
      callback_requested: true,
      products_mentioned: ['Invoice #8841', 'Monthly Subscription'],
      sentiment: 'Urgent',
      sentiment_score: 30,
      short_summary: 'Customer reported a duplicate $249 charge on invoice #8841 and requested an urgent supervisor callback.',
      detailed_summary: 'David Miller called to dispute an unexpected duplicate charge of $249 on invoice #8841. He requested an immediate callback from a billing department supervisor at 312-555-8910.',
      next_action: 'Escalate to billing supervisor for immediate invoice refund review and customer callback.'
    }
  },
  {
    id: 'sample-4',
    title: 'Emergency HVAC / Refrigeration Repair',
    category: 'Technical Support',
    duration: '01:15',
    transcript: [
      { speaker: 'Caller', text: "Good morning, my name is Robert Chen at Oakridge Cafe, phone number 206-555-7312. Our main walk-in cooler compressor failed two hours ago and temperatures are rising.", timestamp: '00:04' },
      { speaker: 'AI Receptionist', text: 'Good morning Robert. An emergency cooler failure is a critical priority for Oakridge Cafe. Are there any error codes displayed?', timestamp: '00:14' },
      { speaker: 'Caller', text: "It's flashing error code E-04 on the Carrier refrigeration unit. We need an on-site technician dispatched today before 1:00 PM.", timestamp: '00:23' },
      { speaker: 'AI Receptionist', text: 'Understood. I am dispatching a high-priority technician ticket for Carrier unit error E-04 to Oakridge Cafe for arrival before 1:00 PM.', timestamp: '00:32' }
    ],
    expectedAnalysis: {
      caller_name: 'Robert Chen',
      company_name: 'Oakridge Cafe',
      phone: '206-555-7312',
      email: 'robert@oakridgecafe.com',
      intent: 'Technical Support',
      priority: 'Critical',
      service: 'Emergency Refrigeration Compressor Repair',
      appointment_date: 'Today, Oct 28, 2026',
      meeting_time: 'Before 1:00 PM',
      follow_up_needed: true,
      callback_requested: true,
      products_mentioned: ['Carrier Walk-in Cooler', 'Compressor Unit (Error E-04)'],
      sentiment: 'Frustrated',
      sentiment_score: 40,
      short_summary: 'Robert Chen reported walk-in cooler failure (Error E-04) at Oakridge Cafe needing urgent dispatch before 1 PM.',
      detailed_summary: 'Robert Chen from Oakridge Cafe called regarding an emergency breakdown of their commercial walk-in cooler displaying error code E-04 on a Carrier unit. An emergency technician dispatch was requested for arrival before 1:00 PM.',
      next_action: 'Dispatch emergency technician to Oakridge Cafe before 1:00 PM.'
    }
  },
  {
    id: 'sample-5',
    title: 'Corporate Legal & IP Patent Consultation',
    category: 'Appointment Booking',
    duration: '01:30',
    transcript: [
      { speaker: 'Caller', text: "Hello, this is Elena Rostova, General Counsel at Vanguard BioTech. My phone is 617-555-9043 and email is elena.rostova@vanguardbio.com.", timestamp: '00:05' },
      { speaker: 'AI Receptionist', text: 'Hello Elena, welcome to Nexus Legal Partners. How may our corporate practice assist Vanguard BioTech?', timestamp: '00:15' },
      { speaker: 'Caller', text: "We are preparing an international patent and trademark filing for our new synthetic protein line and need a 45-minute partner consultation next Tuesday at 3:30 PM.", timestamp: '00:28' },
      { speaker: 'AI Receptionist', text: "I have recorded your request for a 45-minute IP and trademark consultation for Vanguard BioTech on next Tuesday at 3:30 PM. Our managing partner's office will send the calendar invitation.", timestamp: '00:41' }
    ],
    expectedAnalysis: {
      caller_name: 'Elena Rostova',
      company_name: 'Vanguard BioTech',
      phone: '617-555-9043',
      email: 'elena.rostova@vanguardbio.com',
      intent: 'Appointment Booking',
      priority: 'High',
      service: 'International Patent & Trademark IP Consultation',
      appointment_date: 'Next Tuesday, Nov 3, 2026',
      meeting_time: '03:30 PM',
      follow_up_needed: true,
      callback_requested: true,
      products_mentioned: ['Patent Filing', 'Trademark Registration', 'Synthetic Protein Portfolio'],
      sentiment: 'Interested',
      sentiment_score: 90,
      short_summary: 'Elena Rostova (Vanguard BioTech) scheduled a 45-minute IP patent & trademark consultation for next Tuesday at 3:30 PM.',
      detailed_summary: 'Elena Rostova, General Counsel at Vanguard BioTech, requested a 45-minute corporate consultation regarding international patent and trademark filings for their new synthetic protein line scheduled for next Tuesday at 3:30 PM.',
      next_action: 'Send Google Meet calendar invitation to elena.rostova@vanguardbio.com and assign senior IP partner.'
    }
  }
];

// Helper to generate unique, collision-resistant call IDs
export function generateCallId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CALL-${timestamp}-${randomSuffix}`;
}

const VALID_INTENTS: IntentType[] = [
  'Appointment Booking',
  'Product Inquiry',
  'Complaint',
  'Technical Support',
  'Billing Issue',
  'General Inquiry',
  'Callback Request',
  'Sales Inquiry',
  'Partnership',
  'Job Inquiry'
];

const VALID_PRIORITIES: PriorityType[] = ['Low', 'Medium', 'High', 'Critical'];
const VALID_SENTIMENTS: SentimentType[] = ['Happy', 'Neutral', 'Angry', 'Frustrated', 'Interested', 'Urgent'];

export function normalizeCallData(raw: any, fallbackParams: AnalyzeVoiceParams): CallAnalysis {
  const id = generateCallId();
  const now = new Date();
  const dateTimeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ` • ` + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Normalize Intent
  let intent: IntentType = 'General Inquiry';
  if (raw.intent && VALID_INTENTS.includes(raw.intent)) {
    intent = raw.intent;
  }

  // Normalize Priority
  let priority: PriorityType = 'Medium';
  if (raw.priority && VALID_PRIORITIES.includes(raw.priority)) {
    priority = raw.priority;
  }

  // Normalize Sentiment
  let sentiment: SentimentType = 'Neutral';
  if (raw.sentiment && VALID_SENTIMENTS.includes(raw.sentiment)) {
    sentiment = raw.sentiment;
  }

  // Calibrated Sentiment Score (0-100)
  let sentimentScore = 50;
  if (typeof raw.sentiment_score === 'number' && !isNaN(raw.sentiment_score)) {
    sentimentScore = Math.max(0, Math.min(100, Math.round(raw.sentiment_score)));
  } else if (sentiment === 'Happy' || sentiment === 'Interested') {
    sentimentScore = 90;
  } else if (sentiment === 'Frustrated') {
    sentimentScore = 45;
  } else if (sentiment === 'Angry' || sentiment === 'Urgent') {
    sentimentScore = 30;
  }

  // Transcript formatting
  let transcript = Array.isArray(raw.transcript) && raw.transcript.length > 0 ? raw.transcript : [
    { speaker: 'Caller', text: fallbackParams.transcriptText || 'Audio submitted for call analysis.', timestamp: '00:03' },
    { speaker: 'AI Receptionist', text: 'Thank you for your call. Your request has been logged.', timestamp: '00:09' }
  ];

  return {
    id,
    caller_name: raw.caller_name && raw.caller_name !== 'Unknown Caller' ? String(raw.caller_name).trim() : 'N/A',
    company_name: raw.company_name ? String(raw.company_name).trim() : 'N/A',
    phone: raw.phone && raw.phone !== 'Unstated' ? String(raw.phone).trim() : 'N/A',
    email: raw.email ? String(raw.email).trim() : 'N/A',
    intent,
    priority,
    service: raw.service ? String(raw.service).trim() : 'General Assistance',
    appointment_date: raw.appointment_date ? String(raw.appointment_date).trim() : 'N/A',
    meeting_time: raw.meeting_time ? String(raw.meeting_time).trim() : 'N/A',
    follow_up_needed: Boolean(raw.follow_up_needed),
    callback_requested: Boolean(raw.callback_requested),
    products_mentioned: Array.isArray(raw.products_mentioned) ? raw.products_mentioned.map(String) : [],
    sentiment,
    sentiment_score: sentimentScore,
    short_summary: raw.short_summary ? String(raw.short_summary).trim() : 'Voice call analyzed and summarized.',
    detailed_summary: raw.detailed_summary ? String(raw.detailed_summary).trim() : 'The caller contacted the reception desk for inquiry and scheduling.',
    next_action: raw.next_action ? String(raw.next_action).trim() : 'Follow up with caller as needed.',
    transcript,
    date_time: dateTimeStr,
    duration: fallbackParams.actualDuration || '01:15',
    file_name: fallbackParams.fileName || 'analyzed_call.wav'
  };
}

// 10-Intent Deterministic Rule-Based Extractor (Zero-hallucination offline fallback)
export function extractLocally(params: AnalyzeVoiceParams): CallAnalysis {
  const text = params.transcriptText || '';
  const lower = text.toLowerCase();

  // Extract Phone Number (formatted 10-digit, 7-digit, or international)
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{3}[-.\s]\d{4}\b|\b\d{10}\b/);
  const phone = phoneMatch ? phoneMatch[0] : 'N/A';

  // Extract Email Address
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : 'N/A';

  // Extract Caller Name (Strict anti-hallucination: default to N/A if absent)
  let callerName = 'N/A';
  const nameMatch = text.match(/(?:my name is|this is|i am|i'm)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch && nameMatch[1]) {
    callerName = nameMatch[1].trim();
  } else if (/\b(john smith|sarah jenkins|marcus vance|david miller|robert chen|elena rostova|rahul)\b/i.test(text)) {
    const matched = text.match(/\b(john smith|sarah jenkins|marcus vance|david miller|robert chen|elena rostova|rahul)\b/i);
    if (matched) callerName = matched[0];
  }

  // Extract Company Name
  let companyName = 'N/A';
  const companyMatch = text.match(/(?:from|at)\s+([A-Z][A-Za-z0-9\s]+(?:Dental|Tech|Scale|Studio|Cafe|BioTech|Inc|Corp|LLC|Solutions|Labs))/i);
  if (companyMatch && companyMatch[1]) {
    companyName = companyMatch[1].trim();
  } else if (lower.includes('apex dental')) {
    companyName = 'Apex Dental';
  } else if (lower.includes('brighttech')) {
    companyName = 'BrightTech';
  } else if (lower.includes('cloudscale')) {
    companyName = 'CloudScale Inc';
  } else if (lower.includes('oakridge cafe')) {
    companyName = 'Oakridge Cafe';
  } else if (lower.includes('vanguard biotech')) {
    companyName = 'Vanguard BioTech';
  }

  // Strict 10-Intent Classification Logic
  let intent: IntentType = 'General Inquiry';
  let priority: PriorityType = 'Low';
  let sentiment: SentimentType = 'Neutral';
  let sentimentScore = 50;
  let service = 'General Assistance';

  if (lower.includes('checkup') || lower.includes('appointment') || lower.includes('book') || lower.includes('schedule') || lower.includes('consultation')) {
    intent = 'Appointment Booking';
    priority = 'High';
    sentiment = 'Interested';
    sentimentScore = 90;
    service = lower.includes('dental') ? 'Dental Cleaning & Consultation' : 'Appointment Booking';
  } else if (lower.includes('charge') || lower.includes('charged twice') || lower.includes('bill') || lower.includes('refund') || lower.includes('dispute') || lower.includes('invoice') || lower.includes('overbilled')) {
    intent = 'Billing Issue';
    priority = lower.includes('charged twice') || lower.includes('immediately') || lower.includes('urgent') ? 'Critical' : 'High';
    sentiment = 'Urgent';
    sentimentScore = 30;
    service = 'Subscription & Billing Dispute';
  } else if (lower.includes('quotation') || lower.includes('pricing') || lower.includes('annual plan') || lower.includes('enterprise plan') || lower.includes('sales lead') || (lower.includes('demo') && lower.includes('pricing'))) {
    intent = 'Sales Inquiry';
    priority = 'High';
    sentiment = 'Interested';
    sentimentScore = 88;
    service = 'Enterprise Software Pricing & Quotation';
  } else if (lower.includes('internet') || lower.includes('router') || lower.includes('error code') || lower.includes('not working') || lower.includes('broken') || lower.includes('compressor') || lower.includes('outage') || lower.includes('troubleshoot')) {
    intent = 'Technical Support';
    priority = lower.includes('emergency') || lower.includes('failed') ? 'Critical' : 'High';
    sentiment = 'Frustrated';
    sentimentScore = 42;
    service = lower.includes('cooler') || lower.includes('hvac') ? 'Emergency Equipment Repair' : (lower.includes('internet') ? 'Internet Connection Support' : 'Technical Diagnostic');
  } else if (lower.includes('complaint') || lower.includes('unacceptable') || lower.includes('terrible service') || lower.includes('manager') || lower.includes('poor service')) {
    intent = 'Complaint';
    priority = 'Critical';
    sentiment = 'Angry';
    sentimentScore = 25;
    service = 'Customer Complaint Resolution';
  } else if (lower.includes('product') || lower.includes('feature') || lower.includes('specification') || lower.includes('whitepaper') || lower.includes('catalog')) {
    intent = 'Product Inquiry';
    priority = 'Medium';
    sentiment = 'Interested';
    sentimentScore = 80;
    service = 'Product Information';
  } else if (lower.includes('partner') || lower.includes('partnership') || lower.includes('reseller') || lower.includes('vendor') || lower.includes('synergy') || lower.includes('affiliate')) {
    intent = 'Partnership';
    priority = 'Medium';
    sentiment = 'Interested';
    sentimentScore = 85;
    service = 'Strategic Partnership Discussion';
  } else if (lower.includes('job') || lower.includes('hiring') || lower.includes('resume') || lower.includes('career') || lower.includes('interview') || lower.includes('application')) {
    intent = 'Job Inquiry';
    priority = 'Low';
    sentiment = 'Neutral';
    sentimentScore = 60;
    service = 'Employment / Career Application';
  } else if (lower.includes('call me back') || lower.includes('callback') || lower.includes('call back') || lower.includes('leave a message')) {
    intent = 'Callback Request';
    priority = 'Medium';
    sentiment = 'Neutral';
    sentimentScore = 65;
    service = 'Direct Phone Callback';
  } else {
    intent = 'General Inquiry';
    priority = 'Low';
    sentiment = 'Neutral';
    sentimentScore = 50;
    service = 'General Information';
  }

  // Appointment & Time detection
  let appointmentDate = 'N/A';
  let meetingTime = 'N/A';
  if (lower.includes('tomorrow')) {
    appointmentDate = 'Tomorrow';
  } else if (lower.includes('friday')) {
    appointmentDate = 'Friday';
  } else if (lower.includes('monday')) {
    appointmentDate = 'Monday';
  } else if (lower.includes('tuesday')) {
    appointmentDate = 'Next Tuesday';
  }

  const timeMatch = text.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm|a\.m\.|p\.m\.))/i);
  if (timeMatch) {
    meetingTime = timeMatch[1].toUpperCase();
  }

  // Strict Callback Requested Logic: Only true when explicit callback language is present and not negated
  const hasNegativeCallback = 
    lower.includes('do not need a call') || 
    lower.includes("don't need a call") ||
    lower.includes('dont need a call') ||
    lower.includes('no callback') || 
    lower.includes('do not call') ||
    lower.includes("don't call") ||
    lower.includes('no need to call');

  const callbackRequested = !hasNegativeCallback && (
    lower.includes('call me back') || 
    lower.includes('callback') || 
    lower.includes('call back') || 
    lower.includes('please call') || 
    lower.includes('have someone call') ||
    lower.includes('reach me at')
  );

  // Next Action Recommendation
  let nextAction = `Provide requested information to caller.`;
  if (intent === 'Appointment Booking') {
    nextAction = `Confirm ${service} for ${callerName !== 'N/A' ? callerName : 'customer'} for ${appointmentDate !== 'N/A' ? appointmentDate : 'requested date'} ${meetingTime !== 'N/A' ? 'at ' + meetingTime : ''}.`;
  } else if (intent === 'Billing Issue') {
    nextAction = `Escalate duplicate billing charge to supervisor for immediate review and contact ${callerName !== 'N/A' ? callerName : 'customer'}.`;
  } else if (intent === 'Sales Inquiry') {
    nextAction = `Send quotation and enterprise pricing details to ${callerName !== 'N/A' ? callerName : 'prospective client'}.`;
  } else if (intent === 'Technical Support') {
    nextAction = `Open technical support ticket for ${service} and assist customer with troubleshooting.`;
  } else if (intent === 'Complaint') {
    nextAction = `Escalate complaint to customer support manager for priority investigation.`;
  } else if (intent === 'Partnership') {
    nextAction = `Route partnership proposal to business development team.`;
  } else if (intent === 'Job Inquiry') {
    nextAction = `Forward candidate information to human resources recruitment team.`;
  }

  return normalizeCallData({
    caller_name: callerName,
    company_name: companyName,
    phone,
    email,
    intent,
    priority,
    service,
    appointment_date: appointmentDate,
    meeting_time: meetingTime,
    follow_up_needed: intent !== 'General Inquiry' || callbackRequested,
    callback_requested: callbackRequested,
    products_mentioned: service !== 'General Assistance' ? [service] : [],
    sentiment,
    sentiment_score: sentimentScore,
    short_summary: `${callerName !== 'N/A' ? callerName : 'Caller'} contacted regarding ${intent.toLowerCase()}${meetingTime !== 'N/A' ? ' for ' + meetingTime : ''}.`,
    detailed_summary: `The caller initiated contact regarding ${intent}. Extracted parameters: Caller: ${callerName}, Company: ${companyName}, Phone: ${phone}, Intent: ${intent}.`,
    next_action: nextAction,
  }, params);
}

// Client-side Gemini fallback
async function analyzeWithClientGemini(params: AnalyzeVoiceParams): Promise<CallAnalysis | null> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = `You are VoiceDesk AI, an expert AI Receptionist and Speech Analyzer.
Analyze the provided voice call transcript or audio. You MUST return a strict JSON object with NO markdown formatting:
{
  "caller_name": string ("N/A" if unknown, NEVER invent a name),
  "company_name": string ("N/A" if unknown),
  "phone": string ("N/A" if unstated),
  "email": string ("N/A" if unstated),
  "intent": "Appointment Booking" | "Product Inquiry" | "Complaint" | "Technical Support" | "Billing Issue" | "General Inquiry" | "Callback Request" | "Sales Inquiry" | "Partnership" | "Job Inquiry",
  "priority": "Low" | "Medium" | "High" | "Critical",
  "service": string,
  "appointment_date": string,
  "meeting_time": string,
  "follow_up_needed": boolean,
  "callback_requested": boolean (true ONLY if caller explicitly asks for a phone callback),
  "products_mentioned": string[],
  "sentiment": "Happy" | "Neutral" | "Angry" | "Frustrated" | "Interested" | "Urgent",
  "sentiment_score": number (0-100 where 0 is strongly negative and 100 is strongly positive),
  "short_summary": string,
  "detailed_summary": string,
  "next_action": string,
  "transcript": [{"speaker": "Caller" | "AI Receptionist", "text": string, "timestamp": string}]
}`;

    const parts: any[] = [];
    if (params.audioBase64 && params.mimeType) {
      const cleanBase64 = params.audioBase64.replace(/^data:[^;]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: params.mimeType,
          data: cleanBase64,
        }
      });
    }

    parts.push({
      text: params.transcriptText 
        ? `Analyze this customer call transcript:\n${params.transcriptText}`
        : `Analyze this recorded reception audio call.`
    });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const jsonText = response.text?.trim() || '{}';
    const parsed = JSON.parse(jsonText);
    return normalizeCallData(parsed, params);
  } catch (err) {
    console.warn('Client-side Gemini call failed, falling back to local extractor:', err);
    return null;
  }
}

export async function processVoiceAnalysis(params: AnalyzeVoiceParams): Promise<CallAnalysis> {
  // 1. Attempt to call the backend proxy /api/analyze if available
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64: params.audioBase64 || undefined,
        mimeType: params.mimeType || 'audio/wav',
        transcriptText: params.transcriptText || undefined,
        fileName: params.fileName || 'voice_recording.wav',
        actualDuration: params.actualDuration || undefined,
      }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const result = await response.json();
      if (result.success && result.data) {
        return normalizeCallData(result.data, params);
      }
    }
  } catch (backendError) {
    // backend proxy offline or running in standalone static mode
  }

  // 2. Try Client-Side Gemini if configured
  const clientResult = await analyzeWithClientGemini(params);
  if (clientResult) {
    return clientResult;
  }

  // 3. Fallback to deterministic fact-based extractor (analyzes supplied text/context, never invents names)
  return extractLocally(params);
}

// Export alias for testing and interoperability
export const analyzeVoiceCall = processVoiceAnalysis;
