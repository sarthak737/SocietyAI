// In-memory ticket storage
// Can be easily migrated to MongoDB later

const tickets = new Map();
let idCounter = 1;

// Create a new ticket
const create = (data) => {
  const id = String(idCounter++);
  const ticket = {
    id,
    user_name: data.user_name,
    flat_number: data.flat_number,
    audio_url: data.audio_url || null,
    transcription: data.transcription,
    category: data.category,
    urgency: data.urgency,
    summary: data.summary,
    action_needed: data.action_needed,
    status: 'open',
    created_at: new Date().toISOString()
  };
  tickets.set(id, ticket);
  return ticket;
};

// Get all tickets
const getAll = () => {
  return Array.from(tickets.values()).sort((a, b) =>
    new Date(b.created_at) - new Date(a.created_at)
  );
};

// Get ticket by ID
const getById = (id) => {
  return tickets.get(id);
};

// Update ticket status
const updateStatus = (id, status) => {
  const ticket = tickets.get(id);
  if (!ticket) return null;

  ticket.status = status;
  tickets.set(id, ticket);
  return ticket;
};

module.exports = {
  create,
  getAll,
  getById,
  updateStatus
};