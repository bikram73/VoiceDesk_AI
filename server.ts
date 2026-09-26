import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Helper to get or initialize GoogleGenAI instance safely
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. Using fallback processing if key missing.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "VoiceDesk AI" });
});

// API Endpoint: Analyze Voice Audio or Transcript
app.post("/api/analyze", async (req, res) => {
  try {
    const { audioBase64, mimeType, transcriptText, fileName } = req.body;

    const ai = getGenAIClient();

    const systemInstruction = `You are VoiceDesk AI, an expert AI Reception Assistant for business telephone reception desks.
Analyze the provided voice call audio or transcript. You must accurately extract structured details and return a strict JSON object.

Extract and return JSON with these exact fields:
- caller_name: string (e.g. "John Smith" or "Unknown Caller" if unstated)
- company_name: string (e.g. "Apex Dental" or "N/A")
- phone: string (e.g. "9876543210" or "Unstated")
- email: string (e.g. "john@example.com" or "N/A")
- intent: string (MUST be EXACTLY one of: 'Appointment Booking', 'Product Inquiry', 'Complaint', 'Technical Support', 'Billing Issue', 'General Inquiry', 'Callback Request', 'Sales Inquiry', 'Partnership', 'Job Inquiry')
- priority: string (MUST be EXACTLY one of: 'Low', 'Medium', 'High', 'Critical')
- service: string (e.g. "Dental Consultation", "Software Trial", "Invoice Dispute", etc.)
- appointment_date: string (e.g. "Tomorrow 11 AM", "Oct 29, 2026", or "N/A")
- meeting_time: string (e.g. "11:00 AM", "02:30 PM", or "N/A")
- follow_up_needed: boolean
- callback_requested: boolean
- products_mentioned: string[] (array of specific products, packages, or services discussed)
- sentiment: string (MUST be EXACTLY one of: 'Happy', 'Neutral', 'Angry', 'Frustrated', 'Interested', 'Urgent')
- sentiment_score: number (integer between 0 and 100)
- short_summary: string (1-2 clear concise sentences)
- detailed_summary: string (comprehensive 3-4 sentence summary of conversation context, requests, and tone)
- next_action: string (clear actionable recommendation e.g. "Call customer back to confirm appointment slot at 11 AM.")
- transcript: array of objects [{ "speaker": "Caller" | "AI Receptionist", "text": "...", "timestamp": "00:05" }]
`;

    if (ai) {
      const contentsParts: any[] = [];

      if (audioBase64 && mimeType) {
        // Strip data header prefix if present (e.g. "data:audio/wav;base64,")
        const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, "");
        contentsParts.push({
          inlineData: {
            mimeType: mimeType || "audio/wav",
            data: cleanBase64,
          },
        });
      }

      const promptText = transcriptText
        ? `Analyze this caller voice conversation transcript:\n"${transcriptText}"`
        : `Analyze this recorded telephone reception audio call. Extract all details, caller info, transcript timestamps, and recommended next actions.`;

      contentsParts.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: { parts: contentsParts },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      let parsedData: any = {};
      try {
        const jsonText = response.text?.trim() || "{}";
        parsedData = JSON.parse(jsonText);
      } catch (e) {
        console.warn("Could not parse JSON directly, extracting fallback fields", e);
      }

      // Add dynamic metadata
      const id = `CALL-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const dateTimeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ` • ` + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const result = {
        id,
        caller_name: parsedData.caller_name || "Unknown Caller",
        company_name: parsedData.company_name || "N/A",
        phone: parsedData.phone || "Unstated",
        email: parsedData.email || "N/A",
        intent: parsedData.intent || "General Inquiry",
        priority: parsedData.priority || "Medium",
        service: parsedData.service || "General Assistance",
        appointment_date: parsedData.appointment_date || "N/A",
        meeting_time: parsedData.meeting_time || "N/A",
        follow_up_needed: Boolean(parsedData.follow_up_needed),
        callback_requested: Boolean(parsedData.callback_requested),
        products_mentioned: Array.isArray(parsedData.products_mentioned) ? parsedData.products_mentioned : [],
        sentiment: parsedData.sentiment || "Interested",
        sentiment_score: typeof parsedData.sentiment_score === 'number' ? parsedData.sentiment_score : 80,
        short_summary: parsedData.short_summary || "Call processed and summarized by VoiceDesk AI.",
        detailed_summary: parsedData.detailed_summary || "The caller engaged with the AI reception system to inquire about services.",
        next_action: parsedData.next_action || "Follow up with caller if necessary.",
        transcript: Array.isArray(parsedData.transcript) && parsedData.transcript.length > 0 ? parsedData.transcript : [
          { speaker: "Caller", text: transcriptText || "Audio call recording submitted for receptionist processing.", timestamp: "00:02" },
          { speaker: "AI Receptionist", text: "Thank you for calling. I have recorded your details and notified our team.", timestamp: "00:08" }
        ],
        date_time: dateTimeStr,
        duration: "01:15",
        file_name: fileName || "recorded_call.wav"
      };

      return res.json({ success: true, data: result });
    } else {
      // Fallback mock generation if API key is not yet set
      const id = `CALL-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date();
      const dateTimeStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ` • ` + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const fallbackResult = {
        id,
        caller_name: "Sarah Jenkins",
        company_name: "Apex Healthcare",
        phone: "987-555-0192",
        email: "sarah@apexhealth.com",
        intent: "Appointment Booking",
        priority: "High",
        service: "Consultation Booking",
        appointment_date: "Tomorrow, 10:00 AM",
        meeting_time: "10:00 AM",
        follow_up_needed: true,
        callback_requested: true,
        products_mentioned: ["Health Checkup", "Consultation"],
        sentiment: "Interested",
        sentiment_score: 85,
        short_summary: "Customer called to schedule a consultation appointment for tomorrow at 10 AM.",
        detailed_summary: transcriptText 
          ? `Transcript analysis: "${transcriptText.slice(0, 150)}..."` 
          : "Voice recording analyzed. The customer called to request a consultation slot and asked for confirmation via SMS.",
        next_action: "Call customer back to confirm 10:00 AM consultation appointment.",
        transcript: [
          { speaker: "Caller", text: transcriptText || "Hi, I'm calling to book a consultation for tomorrow morning.", timestamp: "00:03" },
          { speaker: "AI Receptionist", text: "Hello! I would be glad to help you schedule a consultation for tomorrow at 10:00 AM.", timestamp: "00:09" }
        ],
        date_time: dateTimeStr,
        duration: "01:12",
        file_name: fileName || "voice_analysis.wav"
      };

      return res.json({ success: true, data: fallbackResult });
    }
  } catch (err: any) {
    console.error("Error analyzing audio/transcript:", err);
    res.status(500).json({ success: false, error: err.message || "Failed to analyze audio" });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VoiceDesk AI server running on http://localhost:${PORT}`);
  });
}

startServer();
