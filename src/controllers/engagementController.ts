import { v4 as uuidv4 } from 'uuid';
import asyncHandler from '../utils/asyncHandler.js';
import { EngagementModel } from '../model/engagementModel.js';
// Create engagement
export const createEngagement = asyncHandler(async (req, res) => {
    try {
        const data = { id: uuidv4(), ...req.body };
        await EngagementModel.insert(data);
        res.status(201).json({ message: 'Engagement created successfully', data });
    } catch (error) {
        console.error('Error creating engagement:', error);
        res.status(500).json({ error: 'Failed to create engagement' });
    }
})


// Get all engagements
export const getEngagements = asyncHandler(async (req, res) => {
    try {
        const engagements = await EngagementModel.findAll();
        res.status(200).json(engagements);
    } catch (error) {
        console.error('Error fetching engagements:', error);
        res.status(500).json({ error: 'Failed to fetch engagements' });
    }
})

// Get engagement by ID
export const getEngagementById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const engagement = await EngagementModel.findById(id);
        if (!engagement) {
            return res.status(404).json({ message: 'Engagement not found' });
        }
        res.status(200).json(engagement);
    } catch (error) {
        console.error('Error fetching engagement:', error);
        res.status(500).json({ error: 'Failed to fetch engagement' });
    }
})

// Update engagement by ID
export const updateEngagement = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        await EngagementModel.updateById(id, updates);
        res.status(200).json({ message: 'Engagement updated successfully' });
    } catch (error) {
        console.error('Error updating engagement:', error);
        res.status(500).json({ error: 'Failed to update engagement' });
    }
})

// Delete engagement by ID
export const deleteEngagement = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        await EngagementModel.deleteById(id);
        res.status(200).json({ message: 'Engagement deleted successfully' });
    } catch (error) {
        console.error('Error deleting engagement:', error);
        res.status(500).json({ error: 'Failed to delete engagement' });
    }
})  
