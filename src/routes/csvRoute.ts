import express from 'express';
import { downloadAndStoreCSV } from '../controllers/factoryController.js';

const router = express.Router();

router.post('/add-stocks', downloadAndStoreCSV);

export default router;
