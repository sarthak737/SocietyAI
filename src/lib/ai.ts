import OpenAI from 'openai'

// Initialize OpenAI client - uses OPENAI_API_KEY from environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
})

export interface AIAnalysisResult {
  category: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  summary: string
  suggested_action: string
}

export async function analyzeComplaint(complaintText: string): Promise<AIAnalysisResult> {
  const prompt = `You are an AI assistant for a housing society management system. Analyze the following complaint and provide:
1. Category: One of - plumbing, electrical, security, cleanliness, parking, noise, maintenance, safety, other
2. Urgency: One of - low, medium, high, critical
3. Summary: A brief 1-2 sentence summary of the issue
4. Suggested Action: What should be done to resolve this

Complaint: "${complaintText}"

Respond in JSON format:
{
  "category": "...",
  "urgency": "...",
  "summary": "...",
  "suggested_action": "..."
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful housing society management assistant. Always respond with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(response)

    return {
      category: parsed.category || 'other',
      urgency: parsed.urgency || 'medium',
      summary: parsed.summary || complaintText.substring(0, 100),
      suggested_action: parsed.suggested_action || 'Manual review required'
    }
  } catch (error) {
    console.error('AI Analysis error:', error)
    // Return default values on error
    return {
      category: 'other',
      urgency: 'medium',
      summary: complaintText.substring(0, 100),
      suggested_action: 'Manual review required'
    }
  }
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], 'audio.webm', { type: 'audio/webm' }),
      model: 'whisper-1',
      response_format: 'text',
    })
    return transcription as string
  } catch (error) {
    console.error('Transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}