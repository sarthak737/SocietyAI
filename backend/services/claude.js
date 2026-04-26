const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client with free tier
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Classify complaint using Gemini API (free tier)
 * Extracts category, urgency, summary, and action needed
 * @param {string} complaintText - The complaint text (can be Hindi, Hinglish, or English)
 * @returns {Promise<Object>} - Classified data
 */
const classifyComplaint = async (complaintText) => {
  const prompt = `You are an AI assistant for a housing society complaint system.

Understand informal Indian language including Hindi, Hinglish, and regional phrasing.

Convert the complaint into structured JSON with these exact fields:
- category: one of ["plumbing", "electrical", "security", "cleanliness", "other"]
- urgency: one of ["low", "medium", "high"]
- summary: a short clear summary (max 50 words)
- action_needed: specific service required (max 30 words)

Return ONLY valid JSON, no other text.

Complaint: ${complaintText}`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Invalid response from Gemini');
    }

    const classified = JSON.parse(jsonMatch[0]);

    // Validate and provide defaults
    return {
      category: classified.category || 'other',
      urgency: classified.urgency || 'medium',
      summary: classified.summary || complaintText.substring(0, 100),
      action_needed: classified.action_needed || 'Review and take appropriate action'
    };
  } catch (error) {
    console.error('Gemini classification error:', error.message);
    // Return default values on error
    return {
      category: 'other',
      urgency: 'medium',
      summary: complaintText.substring(0, 100),
      action_needed: 'Manual review required'
    };
  }
};

module.exports = { classifyComplaint };