import express from 'express';
import { sendResultsByEmail } from '../controllers/email.controller';

const router = express.Router();

// POST /api/email/send
router.post('/send', sendResultsByEmail);

console.log('📨 Email routes initialized');

export default router;