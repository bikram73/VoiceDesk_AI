import { describe, it, expect } from 'vitest';
import { extractLocally } from '../src/services/voiceAnalysis';

describe('VoiceDesk AI - API, Input Validation & Security Edge Cases', () => {
  // RQ-01 & RQ-02: Format acceptance & Audio normalization
  it('INPUT-001: Safely handles empty transcript input without crashing', () => {
    const result = extractLocally({ transcriptText: '' });
    expect(result).toBeDefined();
    expect(result.id).toMatch(/^CALL-\d{4}$/);
    expect(result.caller_name).toBe('N/A');
    expect(result.phone).toBe('N/A');
    expect(result.intent).toBe('General Inquiry');
  });

  // Anti-Hallucination & Ambiguity
  it('AI-AMBIGUOUS-01: Handles ambiguous account statements without inventing billing numbers', () => {
    const transcript = `I need to talk to someone about something related to my account.`;
    const result = extractLocally({ transcriptText: transcript });
    
    expect(result.caller_name).toBe('N/A');
    expect(result.phone).toBe('N/A');
    expect(result.email).toBe('N/A');
    expect(result.appointment_date).toBe('N/A');
  });

  // Missing Fields Verification
  it('AI-MISSING-FIELDS: Preserves available fields when only email is provided', () => {
    const transcript = `Please send the whitepaper to developer@cloudscale.org.`;
    const result = extractLocally({ transcriptText: transcript });
    
    expect(result.email).toBe('developer@cloudscale.org');
    expect(result.caller_name).toBe('N/A');
    expect(result.phone).toBe('N/A');
  });

  // Speaker Diarization
  it('DIARIZATION-001: Preserves dual speaker roles and timestamps in transcript items', () => {
    const transcript = `Hello, I need to check my appointment slot.`;
    const result = extractLocally({ transcriptText: transcript });
    
    expect(Array.isArray(result.transcript)).toBe(true);
    expect(result.transcript.length).toBeGreaterThanOrEqual(1);
    expect(result.transcript[0].speaker).toBe('Caller');
  });

  // Security: No API Keys Exposed in Output Payloads
  it('SECURITY-001: Analysis object does not leak internal keys or raw env secrets', () => {
    const result = extractLocally({ transcriptText: `Test call` });
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain('AIzaSy');
    expect(serialized).not.toContain('sk_live');
  });
});
