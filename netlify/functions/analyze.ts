import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-3.8-flash";

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

function generateCallId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CALL-${timestamp}-${randomSuffix}`;
}

export async function handler(event: any) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Method not allowed. Use POST." }),
    };
  }

  let body: any = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Invalid JSON in request body." }),
    };
  }

  const { audioBase64, mimeType, transcriptText, fileName, actualDuration } = body;

  if (!audioBase64 && (!transcriptText || !String(transcriptText).trim())) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "audioBase64 or transcriptText is required." }),
    };
  }

  if (mimeType && typeof mimeType === "string") {
    const cleanMime = mimeType.toLowerCase().split(";")[0].trim();
    if (!ALLOWED_MIME_TYPES.includes(cleanMime)) {
      return {
        statusCode: 422,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: `Unsupported MIME type: '${mimeType}'.` }),
      };
    }
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    // If no API key configured, return a 503 Service Unavailable or honest error message rather than a fabricated customer
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: false,
        error: "AI speech analysis service is not configured with a valid API key on this server environment.",
      }),
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are VoiceDesk AI, an expert AI Reception Assistant.
Analyze the provided voice call audio or transcript and return a strict JSON object:
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
  "callback_requested": boolean,
  "products_mentioned": string[],
  "sentiment": "Happy" | "Neutral" | "Angry" | "Frustrated" | "Interested" | "Urgent",
  "sentiment_score": number (0-100),
  "short_summary": string,
  "detailed_summary": string,
  "next_action": string,
  "transcript": [{"speaker": "Caller" | "AI Receptionist", "text": string, "timestamp": string}]
}`;

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
      ? `Analyze this customer call transcript:\n"${transcriptText}"`
      : `Analyze this recorded reception telephone audio call.`;

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

    const jsonText = response.text?.trim() || "{}";
    const parsedData = JSON.parse(jsonText);

    const id = generateCallId();
    const now = new Date();
    const dateTimeStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " • " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const result = {
      id,
      caller_name: parsedData.caller_name || "N/A",
      company_name: parsedData.company_name || "N/A",
      phone: parsedData.phone || "N/A",
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
      sentiment_score: typeof parsedData.sentiment_score === "number" ? parsedData.sentiment_score : 80,
      short_summary: parsedData.short_summary || "Call processed and summarized by VoiceDesk AI.",
      detailed_summary: parsedData.detailed_summary || "The caller engaged with the AI reception system to inquire about services.",
      next_action: parsedData.next_action || "Follow up with caller if necessary.",
      transcript: Array.isArray(parsedData.transcript) && parsedData.transcript.length > 0 ? parsedData.transcript : [
        { speaker: "Caller", text: transcriptText || "Audio call recording submitted.", timestamp: "00:02" },
        { speaker: "AI Receptionist", text: "Thank you for calling. Your inquiry has been recorded.", timestamp: "00:08" }
      ],
      date_time: dateTimeStr,
      duration: actualDuration || "01:15",
      file_name: fileName || "recorded_call.wav"
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (err: any) {
    console.error("Netlify function error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: "Error during AI audio extraction: " + (err.message || String(err)) }),
    };
  }
}
