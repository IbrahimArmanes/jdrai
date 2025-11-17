import express from 'express';
import { sendMessage, healthCheck } from '../controllers/chatController.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// Send chat message
router.post('/message', sendMessage);

export default router;

