import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { extractLocally, normalizeCallData, GEMINI_MODEL } from "./src/services/voiceAnalysis";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

const ALLOWED_MIME_TYPES = [
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/mpeg",
  "audio/mp3",
  "audio/mp4",
  "audio/m4a",
  "audio/x-m4a",
  "audio/aac",
  "audio/ogg",
  "audio/vorbis",
  "audio/flac",
  "audio/x-flac",
  "audio/webm"
];

// Helper to get or initialize GoogleGenAI instance safely
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. Using deterministic local extractor.");
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
  res.json({ status: "ok", app: "VoiceDesk AI", model: GEMINI_MODEL });
});

// API Endpoint: Analyze Voice Audio or Transcript
app.post("/api/analyze", async (req, res) => {
  // 1. Request Body Validation
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({
      success: false,
      error: "Invalid request body. Expected JSON object with audioBase64 or transcriptText."
    });
  }

  const { audioBase64, mimeType, transcriptText, fileName, actualDuration } = req.body;

  if (!audioBase64 && (!transcriptText || !String(transcriptText).trim())) {
    return res.status(400).json({
      success: false,
      error: "Validation failed: 'audioBase64' or 'transcriptText' is required."
    });
  }

  // 2. MIME Type Validation
  if (mimeType && typeof mimeType === "string") {
    const cleanMime = mimeType.toLowerCase().split(";")[0].trim();
    if (!ALLOWED_MIME_TYPES.includes(cleanMime)) {
      return res.status(422).json({
        success: false,
        error: `Unsupported MIME type: '${mimeType}'. Supported formats: WAV, MP3, M4A, OGG, FLAC, WebM.`
      });
    }
  }

  try {
    const ai = getGenAIClient();

    const systemInstruction = `You are VoiceDesk AI, an expert AI Reception Assistant for business telephone reception desks.
Analyze the provided voice call audio or transcript. You MUST return a strict JSON object with NO markdown:
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

    if (ai) {
      const contentsParts: any[] = [];

      if (audioBase64 && mimeType) {
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
        model: GEMINI_MODEL,
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
        console.warn("Could not parse Gemini JSON directly, falling back to normalization:", e);
      }

      const normalized = normalizeCallData(parsedData, {
        audioBase64,
        mimeType,
        transcriptText,
        fileName,
        actualDuration,
      });

      return res.json({ success: true, data: normalized });
    } else {
      // Offline fallback: Use deterministic extraction on the actual supplied text (never invent customer facts)
      const localAnalysis = extractLocally({
        audioBase64,
        mimeType,
        transcriptText: transcriptText || "Audio call recording received by reception desk.",
        fileName,
        actualDuration,
      });

      return res.json({ success: true, data: localAnalysis });
    }
  } catch (error: any) {
    console.error("API error during call analysis:", error);
    // Safe deterministic fallback instead of hard crash
    const fallback = extractLocally({
      audioBase64,
      mimeType,
      transcriptText: transcriptText || "Audio call recording processed via fallback pipeline.",
      fileName,
      actualDuration,
    });
    return res.json({ success: true, data: fallback });
  }
});

// Production static file serving
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`VoiceDesk AI server running on http://localhost:${PORT}`);
});
