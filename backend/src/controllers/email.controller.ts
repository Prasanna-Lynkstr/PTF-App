// backend/src/controllers/email.controller.ts
import { Request, Response } from 'express';
import { sendAnalysisEmail } from '../utils/email.util';
import { db } from '../db';
import { emailLog } from '../schema/EmailLog';
import { desc } from 'drizzle-orm'; // Add this import at the top

export const sendResultsByEmail = async (req: Request, res: Response) => {
  try {
    const { email, results } = req.body;

    console.log('Received payload:', { email, results });

    if (!email || !results || !Array.isArray(results)) {
      return res.status(400).json({ error: 'Invalid request payload' });
    }

    await sendAnalysisEmail(req, email, results);

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending analysis email:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};

export const getAllEmailLogs = async (req: Request, res: Response) => {
  try {
    const logs = await db.select().from(emailLog).orderBy(desc(emailLog.date));
    return res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching email logs:', err);
    return res.status(500).json({ error: 'Failed to fetch email logs' });
  }
};