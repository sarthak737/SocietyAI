# Panchayat - Housing Society Complaint System

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. **Configure environment:**
Copy `.env.example` to `.env` in backend folder and add your API keys:
```
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_whisper_api_key
PORT=5000
```

3. **Run the app:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

4. **Open browser:**
- Frontend: http://localhost:3000
- Submit complaints via text or voice
- Admin dashboard: http://localhost:3000/admin

## Project Structure

```
societyOS/
├── backend/
│   ├── server.js          # Main Express server
│   ├── routes/
│   │   └── complaint.js   # Complaint routes
│   ├── controllers/
│   │   └── complaint.js   # Complaint controller
│   ├── services/
│   │   ├── whisper.js     # Speech-to-text service
│   │   └── claude.js      # AI classification service
│   ├── models/
│   │   └── ticket.js      # Ticket model (in-memory)
│   └── .env.example       # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── App.js         # Main React app
    │   ├── components/
    │   │   ├── ComplaintForm.jsx
    │   │   └── AdminDashboard.jsx
    │   └── App.css
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/complaint | Submit complaint (text or audio) |
| GET | /api/complaints | Get all tickets |
| PATCH | /api/complaint/:id | Update ticket status |

## Tech Stack

- **Backend:** Node.js, Express
- **Frontend:** React
- **AI:** Claude API (classification), Whisper API (speech-to-text)
- **Storage:** In-memory (easy migration to MongoDB)