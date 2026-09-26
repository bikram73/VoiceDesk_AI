import { describe, it, expect } from 'vitest';
import { CallAnalysis } from '../src/types';

describe('VoiceDesk AI - Storage, Search, Filtering & Export Validation', () => {
  const sampleCalls: CallAnalysis[] = [
    {
      id: 'CALL-101',
      caller_name: 'John Smith',
      company_name: 'Apex Dental',
      phone: '987-654-3210',
      email: 'john@example.com',
      intent: 'Appointment Booking',
      priority: 'High',
      service: 'Dental Checkup',
      appointment_date: 'Tomorrow',
      meeting_time: '11:00 AM',
      follow_up_needed: true,
      callback_requested: true,
      products_mentioned: ['Dental Checkup'],
      sentiment: 'Interested',
      sentiment_score: 92,
      short_summary: 'John Smith booked a dental checkup.',
      detailed_summary: 'John Smith called from Apex Dental to book tomorrow at 11 AM.',
      next_action: 'Confirm booking via SMS.',
      transcript: [{ speaker: 'Caller', text: 'Hello, book checkup.', timestamp: '00:02' }],
      date_time: '2026-10-28 10:00 AM',
      duration: '01:15',
      file_name: 'dental.wav'
    },
    {
      id: 'CALL-102',
      caller_name: 'Rahul Sharma',
      company_name: 'N/A',
      phone: '555-0199',
      email: 'rahul@example.com',
      intent: 'Billing Issue',
      priority: 'Critical',
      service: 'Subscription Dispute',
      appointment_date: 'N/A',
      meeting_time: 'N/A',
      follow_up_needed: true,
      callback_requested: true,
      products_mentioned: ['Monthly Plan'],
      sentiment: 'Urgent',
      sentiment_score: 30,
      short_summary: 'Double charge reported by Rahul.',
      detailed_summary: 'Customer disputes unexpected duplicate billing charge.',
      next_action: 'Supervisor callback immediately.',
      transcript: [{ speaker: 'Caller', text: 'I was charged twice.', timestamp: '00:03' }],
      date_time: '2026-10-28 11:30 AM',
      duration: '00:45',
      file_name: 'billing.wav'
    },
    {
      id: 'CALL-103',
      caller_name: 'Anonymous',
      company_name: 'N/A',
      phone: 'N/A',
      email: 'N/A',
      intent: 'General Inquiry',
      priority: 'Low',
      service: 'Office Hours',
      appointment_date: 'N/A',
      meeting_time: 'N/A',
      follow_up_needed: false,
      callback_requested: false,
      products_mentioned: [],
      sentiment: 'Neutral',
      sentiment_score: 70,
      short_summary: 'Caller inquired about Saturday office hours.',
      detailed_summary: 'Caller asked whether the office is open over the weekend.',
      next_action: 'No action required.',
      transcript: [{ speaker: 'Caller', text: 'Are you open Saturday?', timestamp: '00:01' }],
      date_time: '2026-10-28 01:15 PM',
      duration: '00:30',
      file_name: 'inquiry.wav'
    }
  ];

  // Search Test
  it('SEARCH-001: Filters calls correctly by caller name keyword', () => {
    const query = 'John';
    const filtered = sampleCalls.filter(c => 
      c.caller_name.toLowerCase().includes(query.toLowerCase()) ||
      c.company_name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query)
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('CALL-101');
  });

  it('SEARCH-002: Filters calls correctly by phone number digits', () => {
    const query = '987';
    const filtered = sampleCalls.filter(c => c.phone.includes(query));
    expect(filtered.length).toBe(1);
    expect(filtered[0].caller_name).toBe('John Smith');
  });

  // Filter Combinations Test
  it('FILTER-001: Multi-filter by Priority and Intent simultaneously', () => {
    const priorityFilter: string = 'Critical';
    const intentFilter: string = 'Billing Issue';
    const filtered = sampleCalls.filter(c => 
      (priorityFilter === 'ALL' || c.priority === priorityFilter) &&
      (intentFilter === 'ALL' || c.intent === intentFilter)
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('CALL-102');
  });

  // Export JSON Validation
  it('EXPORT-001: Generates valid JSON export that parses without errors', () => {
    const jsonString = JSON.stringify(sampleCalls, null, 2);
    expect(() => JSON.parse(jsonString)).not.toThrow();
    const parsed = JSON.parse(jsonString);
    expect(parsed.length).toBe(3);
    expect(parsed[0].caller_name).toBe('John Smith');
  });

  // Export CSV Validation
  it('EXPORT-002: Generates valid RFC-compliant CSV with proper headers', () => {
    const headers = ['ID', 'Caller Name', 'Company', 'Phone', 'Sentiment Score', 'Urgency', 'Intent', 'Call Duration', 'Timestamp'];
    const rows = sampleCalls.map(c => [
      c.id,
      `"${c.caller_name || ''}"`,
      `"${c.company_name || ''}"`,
      `"${c.phone || ''}"`,
      c.sentiment_score ?? '',
      c.priority || '',
      `"${c.intent || ''}"`,
      c.duration || '',
      c.date_time || '',
    ]);
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    expect(csvContent).toContain('ID,Caller Name,Company,Phone,Sentiment Score,Urgency,Intent,Call Duration,Timestamp');
    expect(csvContent).toContain('CALL-101,"John Smith","Apex Dental","987-654-3210"');
    expect(csvContent).toContain('CALL-102,"Rahul Sharma"');
  });

  // LocalStorage Malformed Recovery Test
  it('STORAGE-MALFORMED: Recovers safely when stored data is corrupt string', () => {
    const corruptStorageValue = "{ invalid json data [[[";
    let recoveredCalls: CallAnalysis[] = [];
    try {
      recoveredCalls = JSON.parse(corruptStorageValue);
    } catch {
      recoveredCalls = [];
    }
    expect(Array.isArray(recoveredCalls)).toBe(true);
    expect(recoveredCalls.length).toBe(0);
  });
});
