import express from 'express';
import { createEngagement, getEngagements, getEngagementById, updateEngagement, deleteEngagement } from '../controllers/engagementController.js';

const router = express.Router();

// Define route for creating engagement metrics
router.post('/engagement-metrics', createEngagement);

// Define route for fetching engagement metrics
router.get('/engagement-metrics', getEngagements);

// Define route for fetching engagement metrics by id
router.get('/engagement-metrics/:id', getEngagementById);

// Define route for updating engagement metrics
router.put('/engagement-metrics/:id', updateEngagement);

// Define route for deleting engagement metrics
router.delete('/engagement-metrics/:id', deleteEngagement);

export default router;
