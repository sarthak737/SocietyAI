import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client - uses GEMINI_API_KEY from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AIAnalysisResult {
  category: string;
  urgency: "low" | "medium" | "high" | "critical";
  summary: string;
  suggested_action: string;
  transcription?: string;
}

export async function analyzeComplaint(
  complaintText: string,
  audioBase64?: string,
  audioMimeType?: string,
): Promise<AIAnalysisResult> {
  // Use gemini-2.5-flash as it is fast, free-tier friendly, and supports multimodal (audio) inputs
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `You are an AI assistant for a housing society management system in India. 
You understand English, Hindi, Hinglish, and regional Indian contexts perfectly.
Analyze the provided complaint (which may include text, audio, or both) and provide:
1. category: One of - plumbing, electrical, security, cleanliness, parking, noise, maintenance, safety, other
2. urgency: One of - low, medium, high, critical
3. summary: A brief 1-2 sentence summary of the issue translated to clear English.
4. suggested_action: What should be done to resolve this by the committee.
5. transcription: If there is audio, provide the exact spoken text (transcription in the language spoken). If no audio, leave blank or echo the text.

Complaint Text (if any): "${complaintText}"

Respond in strict JSON format:
{
  "category": "...",
  "urgency": "...",
  "summary": "...",
  "suggested_action": "...",
  "transcription": "..."
}`;

  const parts: any[] = [{ text: prompt }];

  if (audioBase64 && audioMimeType) {
    parts.push({
      inlineData: {
        data: audioBase64,
        mimeType: audioMimeType,
      },
    });
  }

  try {
    const result = await model.generateContent(parts);
    const responseText = result.response.text();

    // Safety fallback in case the model wraps JSON in markdown block
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("\`\`\`json")) {
      cleanedText = cleanedText
        .replace(/^\`\`\`json/, "")
        .replace(/\`\`\`$/, "");
    } else if (cleanedText.startsWith("\`\`\`")) {
      cleanedText = cleanedText.replace(/^\`\`\`/, "").replace(/\`\`\`$/, "");
    }

    const parsed = JSON.parse(cleanedText);

    return {
      category: parsed.category || "other",
      urgency: parsed.urgency || "medium",
      summary:
        parsed.summary ||
        (complaintText ? complaintText.substring(0, 100) : "Audio complaint"),
      suggested_action: parsed.suggested_action || "Manual review required",
      transcription: parsed.transcription || complaintText,
    };
  } catch (error) {
    console.error("AI Analysis error:", error);
    // Return default values on error
    return {
      category: "other",
      urgency: "medium",
      summary: complaintText
        ? complaintText.substring(0, 100)
        : "Audio complaint received",
      suggested_action: "Manual review required",
      transcription: complaintText,
    };
  }
}
