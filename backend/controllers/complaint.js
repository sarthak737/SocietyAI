const ticketModel = require('../models/ticket');
const whisperService = require('../services/whisper');
const claudeService = require('../services/claude');

// Submit a new complaint (text or audio)
const submitComplaint = async (req, res) => {
  try {
    const { user_name, flat_number, text, audio } = req.body;

    if (!user_name || !flat_number) {
      return res.status(400).json({ error: 'user_name and flat_number are required' });
    }

    let transcription = text || '';
    let audioUrl = null;

    // Handle audio input
    if (audio) {
      // If audio is base64 encoded
      const audioBuffer = Buffer.from(audio, 'base64');
      transcription = await whisperService.transcribe(audioBuffer);
      audioUrl = 'data:audio/webm;base64,' + audio;
    }

    if (!transcription) {
      return res.status(400).json({ error: 'Either text or audio is required' });
    }

    // Get AI classification
    const classification = await claudeService.classifyComplaint(transcription);

    // Create ticket
    const ticket = ticketModel.create({
      user_name,
      flat_number,
      audio_url: audioUrl,
      transcription,
      ...classification
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ error: 'Failed to process complaint' });
  }
};

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const { category, status } = req.query;
    let tickets = ticketModel.getAll();

    if (category) {
      tickets = tickets.filter(t => t.category === category);
    }
    if (status) {
      tickets = tickets.filter(t => t.status === status);
    }

    res.json(tickets);
  } catch (error) {
    console.error('Error getting complaints:', error);
    res.status(500).json({ error: 'Failed to get complaints' });
  }
};

// Update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['open', 'in-progress', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required: open, in-progress, or closed' });
    }

    const ticket = ticketModel.updateStatus(id, status);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Failed to update complaint' });
  }
};

module.exports = {
  submitComplaint,
  getAllComplaints,
  updateComplaintStatus
};