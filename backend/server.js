require('dotenv').config();
const express = require('express');
const cors = require('cors');
const complaintRoutes = require('./routes/complaint');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', complaintRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Panchayat API running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Panchayat server running on port ${PORT}`);
});