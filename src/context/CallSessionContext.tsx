import React, { createContext, useContext, useState } from 'react';
import { CallAnalysis } from '../types';

interface CallSessionContextType {
  calls: CallAnalysis[];
  activeCall: CallAnalysis | null;
  setActiveCall: (call: CallAnalysis | null) => void;
  addCall: (newCall: CallAnalysis) => void;
  deleteCall: (id: string) => void;
  clearSessionHistory: () => void;
  stats: {
    totalCalls: number;
    highPriorityCalls: number;
    appointmentRequests: number;
    complaints: number;
    salesInquiries: number;
    supportRequests: number;
  };
}

const INITIAL_CALLS: CallAnalysis[] = [
  {
    id: 'CALL-8912',
    caller_name: 'John Smith',
    company_name: 'Apex Dental Care',
    phone: '987-654-3210',
    email: 'john.smith@apexdental.com',
    intent: 'Appointment Booking',
    priority: 'High',
    service: 'Dental Consultation',
    appointment_date: 'Tomorrow, Oct 29',
    meeting_time: '11:00 AM',
    follow_up_needed: true,
    callback_requested: true,
    products_mentioned: ['Dental Hygiene Package', 'Fluoride Treatment'],
    sentiment: 'Interested',
    sentiment_score: 88,
    short_summary: 'Customer wants to schedule an urgent dental consultation for tomorrow at 11 AM.',
    detailed_summary: 'John Smith called requesting a dental consultation slot for tomorrow at 11:00 AM. He asked about the Dental Hygiene Package and requested a callback confirmation prior to the visit.',
    next_action: 'Call customer back at 987-654-3210 and confirm appointment slot.',
    transcript: [
      { speaker: 'Caller', text: "Hello, my name is John Smith from Apex Dental Care. I'd like to book an appointment for tomorrow morning around 11 AM.", timestamp: '00:04' },
      { speaker: 'AI Receptionist', text: 'Hello John! I can certainly assist you with scheduling a dental consultation for tomorrow at 11:00 AM.', timestamp: '00:10' },
      { speaker: 'Caller', text: 'Great! Also, could you give me details on your Dental Hygiene Package? Please give me a callback once confirmed.', timestamp: '00:18' },
      { speaker: 'AI Receptionist', text: 'Absolutely! I have logged your request and our team will follow up shortly to confirm your booking.', timestamp: '00:25' }
    ],
    date_time: 'Oct 28, 2026 • 10:42 AM',
    duration: '01:25',
    file_name: 'john_smith_call.wav'
  },
  {
    id: 'CALL-8911',
    caller_name: 'Eleanor Vance',
    company_name: 'Vance Tech Solutions',
    phone: '555-019-2834',
    email: 'eleanor@vancetech.io',
    intent: 'Sales Inquiry',
    priority: 'Medium',
    service: 'Enterprise VoiceDesk Subscription',
    appointment_date: 'Oct 30, 2026',
    meeting_time: '02:00 PM',
    follow_up_needed: true,
    callback_requested: false,
    products_mentioned: ['VoiceDesk AI Pro', 'Custom CRM Sync'],
    sentiment: 'Happy',
    sentiment_score: 92,
    short_summary: 'Inquired about upgrading to the Enterprise Tier for 50 receptionists.',
    detailed_summary: 'Eleanor Vance reached out to discuss enterprise volume pricing for VoiceDesk AI. She was particularly interested in custom CRM synchronization for multi-clinic reception desks.',
    next_action: 'Forward contact details to Senior Account Manager and send pricing sheet.',
    transcript: [
      { speaker: 'Caller', text: 'Hi there, I am calling from Vance Tech Solutions. We represent a network of 12 medical clinics.', timestamp: '00:03' },
      { speaker: 'AI Receptionist', text: 'Welcome Eleanor! How can VoiceDesk AI assist your medical clinic network today?', timestamp: '00:09' },
      { speaker: 'Caller', text: 'We want to roll out automated voice reception across all 12 locations. Could you send us an enterprise quotation?', timestamp: '00:16' }
    ],
    date_time: 'Oct 28, 2026 • 09:15 AM',
    duration: '02:14',
    file_name: 'eleanor_enterprise.mp3'
  },
  {
    id: 'CALL-8910',
    caller_name: 'David Kim',
    company_name: 'K-Tech Logistics',
    phone: '415-882-1920',
    email: 'dkim@ktechlogistics.com',
    intent: 'Billing Issue',
    priority: 'Critical',
    service: 'Account Billing & Invoicing',
    appointment_date: 'N/A',
    meeting_time: 'N/A',
    follow_up_needed: true,
    callback_requested: true,
    products_mentioned: ['Monthly Subscription Invoice #4901'],
    sentiment: 'Frustrated',
    sentiment_score: 24,
    short_summary: 'Customer noticed a duplicate charge on invoice #4901 and requests immediate refund.',
    detailed_summary: 'David Kim called regarding an unexpected duplicate transaction on his monthly subscription statement. He was frustrated and requested an urgent callback from accounting.',
    next_action: 'Escalate to Finance Supervisor for immediate billing audit and refund authorization.',
    transcript: [
      { speaker: 'Caller', text: 'Hello, I see two identical charges of $299 on my credit card statement for Invoice #4901. I need this corrected immediately.', timestamp: '00:05' },
      { speaker: 'AI Receptionist', text: 'I understand your concern, David. I have logged this billing dispute with highest priority for our finance supervisor.', timestamp: '00:14' }
    ],
    date_time: 'Oct 27, 2026 • 04:30 PM',
    duration: '03:10',
    file_name: 'david_kim_billing.m4a'
  },
  {
    id: 'CALL-8909',
    caller_name: 'Marcus Wright',
    company_name: 'Wright & Associates',
    phone: '312-555-0144',
    email: 'marcus@wrightlaw.com',
    intent: 'Technical Support',
    priority: 'Medium',
    service: 'SIP Trunk Connection',
    appointment_date: 'N/A',
    meeting_time: 'N/A',
    follow_up_needed: false,
    callback_requested: false,
    products_mentioned: ['Twilio Integration', 'Webhooks'],
    sentiment: 'Neutral',
    sentiment_score: 55,
    short_summary: 'Inquired about Webhook configuration for forwarding voice transcripts to Zapier.',
    detailed_summary: 'Marcus needed instructions on setting up automated webhooks to transfer call transcripts directly to his firm CRM via Zapier.',
    next_action: 'Email developer guide for Webhooks and API endpoints.',
    transcript: [
      { speaker: 'Caller', text: 'Hi, where in the settings panel can I configure webhook URLs for real-time transcript POST requests?', timestamp: '00:02' },
      { speaker: 'AI Receptionist', text: 'Hello Marcus! You can manage webhook destinations under Settings > Integrations.', timestamp: '00:08' }
    ],
    date_time: 'Oct 27, 2026 • 02:12 PM',
    duration: '01:40',
    file_name: 'marcus_support.wav'
  },
  {
    id: 'CALL-8908',
    caller_name: 'Chloe Bennett',
    company_name: 'Bennett Creative Studio',
    phone: '212-998-3341',
    email: 'chloe@bennettcreative.com',
    intent: 'General Inquiry',
    priority: 'Low',
    service: 'Office Hours & Location',
    appointment_date: 'N/A',
    meeting_time: 'N/A',
    follow_up_needed: false,
    callback_requested: false,
    products_mentioned: ['Studio Location', 'Parking Facilities'],
    sentiment: 'Happy',
    sentiment_score: 85,
    short_summary: 'Asked for main office operating hours and guest parking availability.',
    detailed_summary: 'Chloe called to verify office open hours for dropped off package deliveries and inquired if visitor parking was available on site.',
    next_action: 'No action required. General inquiry resolved on call.',
    transcript: [
      { speaker: 'Caller', text: 'Hi! What are your reception desk hours on weekdays?', timestamp: '00:03' },
      { speaker: 'AI Receptionist', text: 'Our reception team is available Monday through Friday from 8:00 AM to 6:00 PM EST.', timestamp: '00:09' }
    ],
    date_time: 'Oct 26, 2026 • 11:05 AM',
    duration: '00:55',
    file_name: 'chloe_inquiry.mp3'
  }
];

const CallSessionContext = createContext<CallSessionContextType | undefined>(undefined);

export const CallSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calls, setCalls] = useState<CallAnalysis[]>(INITIAL_CALLS);
  const [activeCall, setActiveCall] = useState<CallAnalysis | null>(INITIAL_CALLS[0]);

  const addCall = (newCall: CallAnalysis) => {
    setCalls((prev) => [newCall, ...prev]);
    setActiveCall(newCall);
  };

  const deleteCall = (id: string) => {
    setCalls((prev) => prev.filter((c) => c.id !== id));
    if (activeCall?.id === id) {
      const remaining = calls.filter((c) => c.id !== id);
      setActiveCall(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const clearSessionHistory = () => {
    setCalls([]);
    setActiveCall(null);
  };

  const stats = {
    totalCalls: calls.length,
    highPriorityCalls: calls.filter((c) => c.priority === 'High' || c.priority === 'Critical').length,
    appointmentRequests: calls.filter((c) => c.intent === 'Appointment Booking').length,
    complaints: calls.filter((c) => c.intent === 'Complaint' || c.intent === 'Billing Issue').length,
    salesInquiries: calls.filter((c) => c.intent === 'Sales Inquiry' || c.intent === 'Product Inquiry').length,
    supportRequests: calls.filter((c) => c.intent === 'Technical Support' || c.intent === 'General Inquiry').length,
  };

  return (
    <CallSessionContext.Provider
      value={{
        calls,
        activeCall,
        setActiveCall,
        addCall,
        deleteCall,
        clearSessionHistory,
        stats,
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
