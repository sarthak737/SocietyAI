const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Initialize Gemini client with free tier
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Transcribe audio using Gemini 2.5 Flash (free tier)
 * Gemini can directly process audio files
 * @param {Buffer} audioBuffer - Audio file buffer
 * @returns {Promise<string>} - Transcribed text
 */
const transcribe = async (audioBuffer) => {
  try {
    // Create a temporary file from buffer
    const tempFile = path.join(os.tmpDir(), `audio_${Date.now()}.webm`);
    fs.writeFileSync(tempFile, audioBuffer);

    // Use Gemini 2.5 Flash to transcribe audio
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const audioPart = {
      inlineData: {
        data: audioBuffer.toString('base64'),
        mimeType: 'audio/webm'
      }
    };

    const result = await model.generateContent([
      'Transcribe this audio. Return only the transcribed text, nothing else.',
      audioPart
    ]);

    const transcription = result.response.text();

    // Clean up temp file
    fs.unlinkSync(tempFile);

    return transcription;
  } catch (error) {
    console.error('Gemini transcription error:', error.message);
    throw new Error('Failed to transcribe audio');
  }
};

module.exports = { transcribe };