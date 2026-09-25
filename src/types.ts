export type IntentType = 
  | 'Appointment Booking'
  | 'Product Inquiry'
  | 'Complaint'
  | 'Technical Support'
  | 'Billing Issue'
  | 'General Inquiry'
  | 'Callback Request'
  | 'Sales Inquiry'
  | 'Partnership'
  | 'Job Inquiry';

export type PriorityType = 'Low' | 'Medium' | 'High' | 'Critical';

export type SentimentType = 'Happy' | 'Neutral' | 'Angry' | 'Frustrated' | 'Interested' | 'Urgent';

export interface TranscriptLine {
  speaker: string;
  text: string;
  timestamp?: string;
}

export interface CallAnalysis {
  id: string;
  caller_name: string;
  company_name: string;
  phone: string;
  email: string;
  intent: IntentType;
  priority: PriorityType;
  service: string;
  appointment_date: string;
  meeting_time: string;
  follow_up_needed: boolean;
  callback_requested: boolean;
  products_mentioned: string[];
  sentiment: SentimentType;
  sentiment_score: number; // 0 - 100
  short_summary: string;
  detailed_summary: string;
  next_action: string;
  transcript: TranscriptLine[];
  date_time: string;
  duration: string;
  audio_url?: string;
  file_name?: string;
}

export interface CallFilterOptions {
  searchQuery: string;
  intent: string;
  priority: string;
  sentiment: string;
}
