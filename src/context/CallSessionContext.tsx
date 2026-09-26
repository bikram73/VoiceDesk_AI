import React, { createContext, useContext, useState, useEffect } from 'react';
import { CallAnalysis } from '../types';

export const DEMO_SAMPLE_CALLS: CallAnalysis[] = [
  {
    id: 'CALL-DEMO-01',
    caller_name: 'Sarah Jenkins',
    company_name: 'Apex Design Studio',
    phone: '415-555-0198',
    email: 'sarah.j@apexdesign.io',
    intent: 'Appointment Booking',
    priority: 'High',
    service: 'Dental Cleaning & Consultation',
    appointment_date: 'Tomorrow, Oct 29',
    meeting_time: '10:00 AM',
    follow_up_needed: true,
    callback_requested: true,
    products_mentioned: ['Routine Dental Cleaning', 'Dental Consultation'],
    sentiment: 'Interested',
    sentiment_score: 92,
    short_summary: 'Customer requested a dental cleaning and consultation appointment for tomorrow at 10 AM.',
    detailed_summary: 'Sarah Jenkins from Apex Design Studio called requesting a routine dental cleaning and consultation appointment for tomorrow at 10:00 AM. She requested email confirmation and a phone callback.',
    next_action: 'Call customer back at 415-555-0198 to confirm appointment slot and send email confirmation.',
    transcript: [
      { speaker: 'Caller', text: "Hello! My name is Sarah Jenkins from Apex Design Studio. I'd like to book a routine dental cleaning and consultation for tomorrow morning around 10 AM.", timestamp: '00:04' },
      { speaker: 'AI Receptionist', text: 'Hello Sarah! I can certainly assist you with booking a dental cleaning and consultation for tomorrow at 10:00 AM.', timestamp: '00:10' },
      { speaker: 'Caller', text: 'Great! My phone is 415-555-0198 and email is sarah.j@apexdesign.io. Could you please confirm the slot and have someone call?', timestamp: '00:18' },
      { speaker: 'AI Receptionist', text: 'Absolutely! I have logged your request and our team will follow up shortly to confirm your booking.', timestamp: '00:25' }
    ],
    date_time: 'Oct 28, 2026 • 10:42 AM',
    duration: '01:24',
    file_name: 'sarah_jenkins_dental.wav'
  },
  {
    id: 'CALL-DEMO-02',
    caller_name: 'Marcus Vance',
    company_name: 'CloudScale Inc',
    phone: '650-555-4821',
    email: 'marcus@cloudscale.io',
    intent: 'Sales Inquiry',
    priority: 'Medium',
    service: 'Enterprise VoiceDesk Subscription',
    appointment_date: 'Friday, Oct 31, 2026',
    meeting_time: '02:00 PM',
    follow_up_needed: true,
    callback_requested: false,
    products_mentioned: ['VoiceDesk AI Pro', 'Custom CRM Sync'],
    sentiment: 'Happy',
    sentiment_score: 94,
    short_summary: 'Inquired about Enterprise Tier volume pricing and product demo for 50 customer support agents.',
    detailed_summary: 'Marcus Vance reached out from CloudScale Inc to discuss enterprise volume pricing for VoiceDesk AI. He scheduled a product demonstration for Friday at 2:00 PM.',
    next_action: 'Forward contact details to Senior Account Manager and prepare demo environment.',
    transcript: [
      { speaker: 'Caller', text: 'Hi there, this is Marcus Vance from CloudScale Inc. We are evaluating VoiceDesk AI for our 50-seat team.', timestamp: '00:03' },
      { speaker: 'AI Receptionist', text: 'Welcome Marcus! How can VoiceDesk AI assist CloudScale Inc today?', timestamp: '00:09' },
      { speaker: 'Caller', text: "We need pricing for Enterprise plans with CRM integration. Let's schedule a demo Friday at 2 PM.", timestamp: '00:16' }
    ],
    date_time: 'Oct 28, 2026 • 09:15 AM',
    duration: '01:45',
    file_name: 'marcus_enterprise.mp3'
  },
  {
    id: 'CALL-DEMO-03',
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
    short_summary: 'Reported duplicate $249 charge on invoice #8841 requiring urgent supervisor callback.',
    detailed_summary: 'David Miller called disputing an unexpected double billing of $249 on invoice #8841. He requested an immediate supervisor review and phone callback.',
    next_action: 'Escalate to billing supervisor for immediate review and call customer back.',
    transcript: [
      { speaker: 'Caller', text: 'Hello, this is David Miller. I noticed a double charge of $249 on invoice #8841 this morning. I need this corrected immediately.', timestamp: '00:04' },
      { speaker: 'AI Receptionist', text: 'Hello David, I understand your concern regarding the double billing. Let me record this as urgent for our billing supervisor.', timestamp: '00:11' },
      { speaker: 'Caller', text: 'Please have a billing supervisor call me back as soon as possible at 312-555-8910.', timestamp: '00:18' }
    ],
    date_time: 'Oct 27, 2026 • 04:30 PM',
    duration: '01:10',
    file_name: 'david_billing_dispute.wav'
  },
  {
    id: 'CALL-DEMO-04',
    caller_name: 'Robert Chen',
    company_name: 'Oakridge Cafe',
    phone: '206-555-7312',
    email: 'robert@oakridgecafe.com',
    intent: 'Technical Support',
    priority: 'Critical',
    service: 'Commercial Refrigeration Emergency Repair',
    appointment_date: 'Today, Oct 28',
    meeting_time: 'Before 1:00 PM',
    follow_up_needed: true,
    callback_requested: true,
    products_mentioned: ['Carrier Cooler', 'Error Code E-04'],
    sentiment: 'Frustrated',
    sentiment_score: 42,
    short_summary: 'Commercial walk-in cooler failed with error code E-04; urgent dispatch needed before 1:00 PM.',
    detailed_summary: 'Robert Chen from Oakridge Cafe called regarding an emergency failure on their primary walk-in cooler compressor displaying error E-04. Immediate technician dispatch is required.',
    next_action: 'Dispatch emergency on-site repair technician to Oakridge Cafe before 1:00 PM.',
    transcript: [
      { speaker: 'Caller', text: 'Good morning, my name is Robert Chen at Oakridge Cafe, 206-555-7312. Our main walk-in cooler compressor failed two hours ago.', timestamp: '00:04' },
      { speaker: 'AI Receptionist', text: 'Good morning Robert. An emergency cooler failure is a critical priority. Are there any error codes displayed?', timestamp: '00:11' },
      { speaker: 'Caller', text: "It's flashing error code E-04. We need a technician dispatched today before 1:00 PM.", timestamp: '00:19' }
    ],
    date_time: 'Oct 27, 2026 • 08:05 AM',
    duration: '01:15',
    file_name: 'robert_hvac_emergency.wav'
  },
  {
    id: 'CALL-DEMO-05',
    caller_name: 'Elena Rostova',
    company_name: 'Vanguard BioTech',
    phone: '617-555-9043',
    email: 'elena.rostova@vanguardbio.com',
    intent: 'Appointment Booking',
    priority: 'High',
    service: 'Corporate IP & Patent Consultation',
    appointment_date: 'Next Tuesday, Nov 3',
    meeting_time: '03:30 PM',
    follow_up_needed: true,
    callback_requested: true,
    products_mentioned: ['International Patent', 'Trademark Portfolio'],
    sentiment: 'Interested',
    sentiment_score: 90,
    short_summary: 'Scheduled 45-minute IP patent consultation for next Tuesday at 3:30 PM.',
    detailed_summary: 'Elena Rostova, General Counsel at Vanguard BioTech, requested a 45-minute consultation regarding international patent and trademark filings for their new synthetic protein line.',
    next_action: 'Send Google Meet calendar invitation to elena.rostova@vanguardbio.com and assign senior IP partner.',
    transcript: [
      { speaker: 'Caller', text: 'Hi, we are preparing an international patent filing and need a 45-minute consultation next Tuesday at 3:30 PM.', timestamp: '00:03' },
      { speaker: 'AI Receptionist', text: 'Recorded Elena! Our managing partner will send the calendar invitation.', timestamp: '00:09' }
    ],
    date_time: 'Oct 26, 2026 • 11:05 AM',
    duration: '01:30',
    file_name: 'elena_legal.wav'
  }
];

export const PRIMARY_STORAGE_KEY = 'voicedesk_calls_v1';
const LEGACY_STORAGE_KEY = 'voicedesk_session_calls_v2';

// Helper to safely load calls from localStorage (defaulting to empty array initially)
function loadStoredCalls(): CallAnalysis[] {
  try {
    if (typeof window === 'undefined') return [];
    
    // Check primary key first, fallback to legacy key
    const raw = window.localStorage.getItem(PRIMARY_STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading localStorage for call history:', err);
  }
  return []; // Initially empty by default
}

interface CallSessionContextType {
  calls: CallAnalysis[];
  activeCall: CallAnalysis | null;
  setActiveCall: (call: CallAnalysis | null) => void;
  addCall: (newCall: CallAnalysis) => void;
  deleteCall: (id: string) => void;
  clearSessionHistory: () => void;
  loadSampleCalls: () => void;
  storageStats: {
    isStored: boolean;
    count: number;
    lastUpdated: string | null;
  };
  stats: {
    totalCalls: number;
    highPriorityCalls: number;
    appointmentRequests: number;
    complaints: number;
    salesInquiries: number;
    supportRequests: number;
  };
}

const CallSessionContext = createContext<CallSessionContextType | undefined>(undefined);

export const CallSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with empty array by default unless stored in localStorage
  const [calls, setCalls] = useState<CallAnalysis[]>(() => loadStoredCalls());
  const [activeCall, setActiveCall] = useState<CallAnalysis | null>(() => {
    const initial = loadStoredCalls();
    return initial.length > 0 ? initial[0] : null;
  });
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
    return loadStoredCalls().length > 0 ? new Date().toLocaleTimeString() : null;
  });

  // Automatically sync to LocalStorage whenever calls array changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(calls));
        setLastUpdated(calls.length > 0 ? new Date().toLocaleTimeString() : null);
      }
    } catch (err) {
      console.error('Failed to write calls to localStorage:', err);
    }
  }, [calls]);

  const addCall = (newCall: CallAnalysis) => {
    setCalls((prev) => {
      const updated = [newCall, ...prev.filter((c) => c.id !== newCall.id)];
      return updated;
    });
    setActiveCall(newCall);
  };

  const deleteCall = (id: string) => {
    setCalls((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (activeCall?.id === id) {
        setActiveCall(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });
  };

  const clearSessionHistory = () => {
    setCalls([]);
    setActiveCall(null);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(PRIMARY_STORAGE_KEY);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to clear localStorage:', err);
    }
  };

  const loadSampleCalls = () => {
    setCalls(DEMO_SAMPLE_CALLS);
    setActiveCall(DEMO_SAMPLE_CALLS[0]);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(DEMO_SAMPLE_CALLS));
      }
    } catch (err) {
      console.error('Failed to write demo calls to localStorage:', err);
    }
  };

  const highPriorityCalls = calls.filter((c) => c.priority === 'High' || c.priority === 'Critical').length;
  const appointmentRequests = calls.filter((c) => c.intent === 'Appointment Booking').length;
  const complaints = calls.filter((c) => c.intent === 'Complaint' || c.intent === 'Billing Issue').length;
  const salesInquiries = calls.filter((c) => c.intent === 'Sales Inquiry' || c.intent === 'Product Inquiry' || c.intent === 'Partnership').length;
  const supportRequests = calls.filter((c) => c.intent === 'Technical Support').length;

  return (
    <CallSessionContext.Provider
      value={{
        calls,
        activeCall,
        setActiveCall,
        addCall,
        deleteCall,
        clearSessionHistory,
        loadSampleCalls,
        storageStats: {
          isStored: calls.length > 0,
          count: calls.length,
          lastUpdated,
        },
        stats: {
          totalCalls: calls.length,
          highPriorityCalls,
          appointmentRequests,
          complaints,
          salesInquiries,
          supportRequests,
        },
      }}
    >
      {children}
    </CallSessionContext.Provider>
  );
};

export const useCallSession = () => {
  const context = useContext(CallSessionContext);
  if (!context) {
    throw new Error('useCallSession must be used within a CallSessionProvider');
  }
  return context;
};
