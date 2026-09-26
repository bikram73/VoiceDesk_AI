# 🧪 VoiceDesk AI — Test Case Specifications & Execution Registry

## 1. Test Case Registry

### Category: Audio Ingestion & File Handling (UPLOAD & MIC)
- **UPLOAD-001 (P0)**: Standard WAV upload (16-bit PCM, 44.1kHz).
  - *Input*: `sample_dental.wav` (1.4MB).
  - *Expected*: File parsed, waveform visible, duration displayed, analysis unlocked.
  - *Result*: **PASS**.
- **UPLOAD-002 (P0)**: Compressed MP3 upload (128kbps stereo).
  - *Input*: `sales_call.mp3` (2.1MB).
  - *Expected*: Accepted, audio duration synchronized, playback available.
  - *Result*: **PASS**.
- **UPLOAD-003 (P1)**: AAC / M4A voice memo upload.
  - *Input*: `recording.m4a` (850KB).
  - *Expected*: Ingested cleanly without browser codec error.
  - *Result*: **PASS**.
- **UPLOAD-004 (P1)**: OGG Vorbis audio container.
  - *Input*: `call_stream.ogg` (1.1MB).
  - *Expected*: Parsed with native browser audio context.
  - *Result*: **PASS**.
- **UPLOAD-005 (P2)**: Lossless FLAC container.
  - *Input*: `highres_telephony.flac` (6.2MB).
  - *Expected*: Processed without transcoding failure.
  - *Result*: **PASS**.
- **UPLOAD-006 (P1)**: Invalid file type rejection.
  - *Input*: `invoice.pdf`, `photo.png`, `script.exe`.
  - *Expected*: Clear validation modal; application remains fully responsive.
  - *Result*: **PASS**.
- **UPLOAD-007 (P2)**: 0-byte empty file.
  - *Input*: `empty.wav` (0 bytes).
  - *Expected*: Rejection message prompting for valid recording.
  - *Result*: **PASS**.
- **UPLOAD-008 (P2)**: Maximum file size boundary (50MB).
  - *Input*: `large_audio_52mb.wav`.
  - *Expected*: Error banner indicating 50MB file size ceiling.
  - *Result*: **PASS**.
- **MIC-001 (P0)**: Live microphone permission and stream recording.
  - *Input*: User clicks "Start Live Recording".
  - *Expected*: WebRTC stream acquired, animated equalizer renders, timer starts.
  - *Result*: **PASS**.
- **MIC-002 (P1)**: Recording pause and resume state.
  - *Input*: User toggles Pause / Resume.
  - *Expected*: Timer halts and resumes without dropping prior audio frames.
  - *Result*: **PASS**.
- **MIC-003 (P0)**: Recording completion and Blob generation.
  - *Input*: User clicks Stop.
  - *Expected*: Audio Blob produced, download and AI analysis buttons enabled.
  - *Result*: **PASS**.
- **MIC-004 (P1)**: Denied microphone permission handling.
  - *Input*: Permission dismissed/blocked in browser settings.
  - *Expected*: Non-blocking error alert prompting manual audio upload or preset mode.
  - *Result*: **PASS**.

---

## 2. Controlled Test Case Execution (TC-AUDIO-01 to TC-AUDIO-05)

### **TC-AUDIO-01: Appointment Booking (Apex Dental)**
```text
Transcript:
"Hello, my name is John Smith from Apex Dental. I would like to book a dental checkup tomorrow at 11 AM. You can call me back at 987-654-3210. My email is john@example.com. Thank you."
```
- **Extracted Caller**: `John Smith`
- **Extracted Company**: `Apex Dental`
- **Extracted Phone**: `987-654-3210`
- **Extracted Email**: `john@example.com`
- **Detected Intent**: `Appointment Booking`
- **Extracted Service**: `Dental Checkup`
- **Appointment Time**: `Tomorrow at 11:00 AM`
- **Callback Requested**: `Yes (true)`
- **Assigned Priority**: `High`
- **Result**: **PASS**

---

### **TC-AUDIO-02: Sales Inquiry (BrightTech)**
```text
Transcript:
"Hi, this is Sarah from BrightTech. I am interested in your enterprise software pricing. Please send me a quotation. You can reach me at 9876543210."
```
- **Extracted Caller**: `Sarah`
- **Extracted Company**: `BrightTech`
- **Extracted Phone**: `9876543210`
- **Detected Intent**: `Sales Inquiry`
- **Requested Action**: `Quotation & Enterprise Pricing`
- **Callback Requested**: `Yes (true)`
- **Assigned Priority**: `High`
- **Result**: **PASS**

---

### **TC-AUDIO-03: Billing Dispute (Rahul)**
```text
Transcript:
"Hello, my name is Rahul. I was charged twice for my subscription this month. I need someone to check my billing immediately. Please call me back."
```
- **Extracted Caller**: `Rahul`
- **Detected Intent**: `Billing Issue`
- **Assigned Priority**: `Critical` (Due to duplicate charge and immediate escalation)
- **Sentiment Score**: `35% (Urgent)`
- **Follow-up Needed**: `Yes (true)`
- **Next Action**: `Escalate duplicate billing charge to supervisor for immediate review and contact Rahul.`
- **Result**: **PASS**

---

### **TC-AUDIO-04: Technical Support (Router / Internet)**
```text
Transcript:
"Hi, my internet connection has stopped working. I have restarted the router twice but the problem continues. I need technical support."
```
- **Detected Intent**: `Technical Support`
- **Extracted Service**: `Internet Support`
- **Assigned Priority**: `High`
- **Sentiment Score**: `55% (Frustrated)`
- **Follow-up Needed**: `Yes (true)`
- **Next Action**: `Open technical support ticket for Internet Support and assist customer with connectivity troubleshooting.`
- **Result**: **PASS**

---

### **TC-AUDIO-05: General Inquiry (Office Working Hours)**
```text
Transcript:
"Hello, I wanted to know your office working hours. Are you open on Saturday?"
```
- **Detected Intent**: `General Inquiry`
- **Assigned Priority**: `Low`
- **Sentiment Score**: `70% (Neutral)`
- **Caller Name**: `N/A` (No hallucinated name)
- **Phone Number**: `N/A` (No hallucinated phone)
- **Callback Requested**: `No (false)`
- **Next Action**: `Provide requested information regarding office hours.`
- **Result**: **PASS**

---

## 3. Anti-Hallucination & Guardrail Test Cases

| Test Case | Prompt / Audio Input | Expected Output | Actual Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| **AI-HALL-01** | *"Hello, I need information about your software pricing."* | Name: `N/A`, Phone: `N/A`, Email: `N/A` | `caller_name: "N/A"`, `phone: "N/A"` | **PASS** |
| **AI-HALL-02** | *"I need to talk to someone about something related to my account."* | No invented billing numbers or fake account IDs | `appointment_date: "N/A"`, `phone: "N/A"` | **PASS** |
| **AI-HALL-03** | *"Please send the brochure to contact@domain.com."* | Only email extracted; name and phone remain `N/A` | `email: "contact@domain.com"`, `name: "N/A"` | **PASS** |
| **AI-HALL-04** | Malformed JSON returned from upstream LLM | Fallback to safe default without unhandled exception | Fallback gracefully committed | **PASS** |

---

## 4. Search, Filter & Persistence Test Cases

| Test ID | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **SRCH-001** | Search query "John" | Only John Smith calls returned | **PASS** |
| **SRCH-002** | Search phone "987" | Matches phone numbers containing 987 | **PASS** |
| **FLTR-001** | Filter Priority = Critical | Only Critical calls displayed | **PASS** |
| **FLTR-002** | Filter Intent = Billing Issue | Only Billing dispute calls displayed | **PASS** |
| **FLTR-003** | Combined Priority = Critical + Intent = Billing | Exact intersection returned | **PASS** |
| **PERS-001** | Reload browser window | Calls persisted in `localStorage` | **PASS** |
| **PERS-002** | Click Wipe LocalStorage | Reset to clean 0 stored calls | **PASS** |
| **PERS-003** | Click Populate 5 Demo Calls | 5 demo call records populated | **PASS** |
| **EXP-001** | Export to CSV | Downloads valid .csv file with headers | **PASS** |
| **EXP-002** | Export to JSON | Downloads valid .json file | **PASS** |
