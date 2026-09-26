# 🏗️ VoiceDesk AI - System Architecture & Pipeline Design

<div align="center">

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           VOICEDESK AI PLATFORM (2026)                      │
  └─────────────────────────────────────────────────────────────────────────────┘
                                        │
           ┌────────────────────────────┴────────────────────────────┐
           ▼                                                         ▼
  ┌─────────────────┐                                       ┌─────────────────┐
  │  🎙️ Audio Stream│                                       │ 📝 Text Inputs  │
  │ WebRTC/Mic / WAV│                                       │ Direct Transcript│
  └────────┬────────┘                                       └────────┬────────┘
           │                                                         │
           └────────────────────────────┬────────────────────────────┘
                                        ▼
             ┌──────────────────────────────────────────────────────┐
             │       🌐 Express Node.js Proxy & Pre-processor       │
             │   - Base64 Buffer Encoding / Normalization           │
             │   - Dual-mode payload validation & security sanitiz. │
             └──────────────────────────┬───────────────────────────┘
                                        ▼
             ┌──────────────────────────────────────────────────────┐
             │   🧠 Gemini 3.8 Flash Multimodal Intelligence Engine │
             │   - Automatic Speech Recognition & Diarization       │
             │   - Semantic Entity Extraction & Intent Classification│
             │   - Sentiment Analysis & Confidence Scoring          │
             │   - Action Item Recommendation & Executive Summaries │
             └──────────────────────────┬───────────────────────────┘
                                        ▼
             ┌──────────────────────────────────────────────────────┐
             │   💾 Client-Side React 19 Engine & Persistence       │
             │   - Real-time React Context State Engine             │
             │   - Browser LocalStorage / Cache Synchronization     │
             │   - CSV / JSON Export & CRM Webhook Integration      │
             └──────────────────────────────────────────────────────┘
```

</div>

---

## 🏛️ 1. Architecture Overview

**VoiceDesk AI** is an enterprise-grade AI telephony receptionist and voice intelligence platform built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Gemini 3.8 Flash**.

The system is architected into three distinct operational layers:
1. **Client Presentation & Audio Engine (React 19 SPA)**: Handles real-time browser audio recording via the `MediaRecorder` API, tone generation, transcript presets, filtering, export, and `localStorage` session caching.
2. **Server-Side API Proxy Layer (Node.js & Express)**: Safely manages Gemini API communication, protects API secrets, parses multimodal multipart audio buffers, and delivers strictly formatted JSON schemas.
3. **Multimodal Neural Core (Gemini 3.8 Flash)**: Simultaneously performs acoustic processing, phoneme alignment, speaker separation, intent classification, entity extraction, sentiment scoring, and next-action synthesis in a single unified inference step.

---

## 🔄 2. End-to-End Data Pipeline

```
[User Mic / Audio File / Sample Preset]
                  │
                  ▼
          1. Audio Ingestion
      (WAV, MP3, M4A, FLAC, PCM)
                  │
                  ▼
         2. Buffer Conversion
    (Base64 Encoding & MIME Parsing)
                  │
                  ▼
        3. POST /api/analyze
  (Encrypted Transit to Backend Proxy)
                  │
                  ▼
       4. Neural Core Inference
   (Gemini 3.8 Flash Structured JSON)
                  │
                  ▼
        5. Client State Update
  (React Session Context & LocalStorage)
                  │
                  ▼
        6. Actionable Dashboard
  (Structured Cards, Analytics & CRM Sync)
```

---

## 🛡️ 3. Security, Privacy & Local Storage Model

- **Zero Third-Party Storage**: All analyzed customer calls and extracted metadata are saved exclusively inside the user's browser `localStorage` under the secure key `voicedesk_session_calls_v2`.
- **Serverless-Ready Proxying**: No audio files or transcripts are written to persistent server disks.
- **Client Sanitization**: All exported CSV and JSON files are generated client-side with proper escaping to avoid formula injection vulnerabilities.

---

## 🔌 4. Integration Surface

- **CRM Forwarding**: Direct webhook triggers formatted for HubSpot, Salesforce, and Zapier.
- **Calendar Automation**: Auto-detects requested dates/times (e.g., `"Tomorrow 10:00 AM"`) for automated calendar invites.
- **Export Pipelines**: Instant client-side download of tabular CSV or structured JSON logs.
