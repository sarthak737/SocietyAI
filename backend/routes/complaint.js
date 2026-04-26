const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaint');

// POST /api/complaint - Submit a complaint (text or audio)
router.post('/complaint', complaintController.submitComplaint);

// GET /api/complaints - Get all tickets
router.get('/complaints', complaintController.getAllComplaints);

// PATCH /api/complaint/:id - Update ticket status
router.patch('/complaint/:id', complaintController.updateComplaintStatus);

module.exports = router;