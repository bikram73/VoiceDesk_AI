import { describe, it, expect } from 'vitest';
import { analyzeVoiceCall, DEMO_CALL_SAMPLES, extractLocally } from '../src/services/voiceAnalysis';
import { CallAnalysis } from '../src/types';

describe('VoiceDesk AI - End-to-End Analysis & Extraction Validation', () => {
  // TC-AUDIO-01: Appointment Booking
  it('TC-AUDIO-01: Correctly extracts appointment booking details without hallucination', async () => {
    const transcript = `Hello, my name is John Smith from Apex Dental. I would like to book a dental checkup tomorrow at 11 AM. You can call me back at 987-654-3210. My email is john@example.com. Thank you.`;
    
    const result = await analyzeVoiceCall({ transcriptText: transcript, fileName: 'tc-01-appointment.wav' });

    expect(result).toBeDefined();
    expect(result.caller_name.toLowerCase()).toContain('john');
    expect(result.phone.replace(/[^0-9]/g, '')).toBe('9876543210');
    expect(result.email.toLowerCase()).toBe('john@example.com');
    expect(result.company_name).toBe('Apex Dental');
    expect(result.intent).toBe('Appointment Booking');
    expect(result.service.toLowerCase()).toContain('dental');
    expect(result.callback_requested).toBe(true);
    expect(result.sentiment_score).toBeGreaterThanOrEqual(50);
  });

  // TC-AUDIO-02: Sales Inquiry
  it('TC-AUDIO-02: Correctly classifies sales inquiry and quotation request', async () => {
    const transcript = `Hi, this is Sarah from BrightTech. I am interested in your enterprise software pricing. Please send me a quotation. You can reach me at 9876543210.`;

    const result = await analyzeVoiceCall({ transcriptText: transcript, fileName: 'tc-02-sales.wav' });

    expect(result).toBeDefined();
    expect(result.caller_name).toContain('Sarah');
    expect(result.company_name).toBe('BrightTech');
    expect(result.intent).toBe('Sales Inquiry');
    expect(result.phone.replace(/[^0-9]/g, '')).toBe('9876543210');
    expect(result.callback_requested).toBe(true);
    expect(['High', 'Medium']).toContain(result.priority);
  });

  // TC-AUDIO-03: Billing Dispute
  it('TC-AUDIO-03: Flags billing dispute with High or Critical priority', async () => {
    const transcript = `Hello, my name is Rahul. I was charged twice for my subscription this month. I need someone to check my billing immediately. Please call me back.`;

    const result = await analyzeVoiceCall({ transcriptText: transcript, fileName: 'tc-03-billing.wav' });

    expect(result).toBeDefined();
    expect(result.caller_name).toBe('Rahul');
    expect(result.intent).toBe('Billing Issue');
    expect(['High', 'Critical']).toContain(result.priority);
    expect(result.follow_up_needed).toBe(true);
    expect(result.callback_requested).toBe(true);
  });

  // TC-AUDIO-04: Technical Support
  it('TC-AUDIO-04: Handles technical support query and diagnostic context', async () => {
    const transcript = `Hi, my internet connection has stopped working. I have restarted the router twice but the problem continues. I need technical support.`;

    const result = await analyzeVoiceCall({ transcriptText: transcript, fileName: 'tc-04-support.wav' });

    expect(result).toBeDefined();
    expect(result.intent).toBe('Technical Support');
    expect(result.service.toLowerCase()).toContain('internet');
    expect(result.follow_up_needed).toBe(true);
  });

  // TC-AUDIO-05: General Inquiry
  it('TC-AUDIO-05: Processes general inquiry with low/medium priority and no unnecessary callback', async () => {
    const transcript = `Hello, I wanted to know your office working hours. Are you open on Saturday?`;

    const result = await analyzeVoiceCall({ transcriptText: transcript, fileName: 'tc-05-general.wav' });

    expect(result).toBeDefined();
    expect(result.intent).toBe('General Inquiry');
    expect(['Low', 'Medium']).toContain(result.priority);
    expect(result.caller_name).toMatch(/n\/a|not provided|anonymous|unknown/i);
    expect(result.phone).toMatch(/n\/a|not provided|none/i);
  });

  // Strict Callback Logic Independence
  it('CALLBACK-INDEPENDENCE: Stating a phone number without requesting a callback does NOT force callback_requested to true', () => {
    const transcript = `My contact number on file is 555-0199 for reference only. I do not need a call back.`;
    const result = extractLocally({ transcriptText: transcript });
    
    expect(result.phone).toBe('555-0199');
    expect(result.callback_requested).toBe(false);
  });

  // All 10 Intents Deterministic Coverage
  it('INTENTS-10-COVERAGE: Verifies all 10 intent categories have distinct classification rules', () => {
    const cases = [
      { text: 'I would like to book an appointment for tomorrow.', expected: 'Appointment Booking' },
      { text: 'Can you provide product specifications and catalog details?', expected: 'Product Inquiry' },
      { text: 'This service is unacceptable, I want to file a formal complaint with the manager.', expected: 'Complaint' },
      { text: 'Our router is offline and we have an error code.', expected: 'Technical Support' },
      { text: 'I noticed an overbilled duplicate charge on my invoice.', expected: 'Billing Issue' },
      { text: 'What is your office address and directions?', expected: 'General Inquiry' },
      { text: 'Please leave a message and have an agent call me back.', expected: 'Callback Request' },
      { text: 'We are inquiring about enterprise software pricing and quotation.', expected: 'Sales Inquiry' },
      { text: 'We would like to propose a strategic vendor partnership and reseller agreement.', expected: 'Partnership' },
      { text: 'I am submitting my resume for the software engineer job hiring application.', expected: 'Job Inquiry' }
    ];

    cases.forEach(({ text, expected }) => {
      const res = extractLocally({ transcriptText: text });
      expect(res.intent).toBe(expected);
    });
  });

  // Hallucination Prevention Test
  it('AI-HALLUCINATION-01: Does NOT invent caller names, phone numbers or emails when absent', async () => {
    const transcript = `Hello, I need information about your service and general features.`;

    const result = await analyzeVoiceCall({ transcriptText: transcript });

    expect(result.caller_name).toMatch(/n\/a|not provided|anonymous|unknown/i);
    expect(result.phone).toMatch(/n\/a|not provided|none/i);
    expect(result.email).toMatch(/n\/a|not provided|none/i);
    expect(result.company_name).toMatch(/n\/a|not provided|none/i);
  });

  // Demo presets validation
  it('PRESET-001: Verifies all 5 demo presets contain complete transcripts and analyses', () => {
    expect(DEMO_CALL_SAMPLES.length).toBe(5);
    DEMO_CALL_SAMPLES.forEach(sample => {
      expect(sample.id).toBeDefined();
      expect(sample.title).toBeDefined();
      expect(sample.category).toBeDefined();
      expect(sample.transcript.length).toBeGreaterThan(0);
      expect(sample.expectedAnalysis.intent).toBeDefined();
      expect(sample.expectedAnalysis.priority).toBeDefined();
    });
  });
});
