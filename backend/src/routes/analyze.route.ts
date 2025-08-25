import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { db } from '../db';
import { resumeAnalysisLog } from "../schema/ResumeAnalysisLog";


console.log('Inside analyze.route.ts - routes being initialized');

import { analyzeResume } from '../controllers/analyze.controller';

const router = express.Router();

// Debug middleware to log incoming requests
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming ${req.method} request to ${req.originalUrl}`);
  next();
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req: express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    console.log(`Saving uploaded file: ${file.originalname} as ${uniqueSuffix + '-' + file.originalname}`);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// POST /api/analyze/upload
router.post('/upload', upload.array('resume'), async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    if (files.length > 5) {
      return res.status(400).json({ error: 'You can upload a maximum of 5 resumes at a time.' });
    }

    const results = [];
    let resumesAssessedCount = 0;

    for (const file of files) {
      const mockReq = { ...req, file } as express.Request;
      const result = await analyzeResume(mockReq);
      results.push(result);
      resumesAssessedCount++;
    }

    const logPayload: any = {
      ip_address: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
      user_agent: req.headers['user-agent'] || '',
      date: new Date(),
      number_of_resumes_assessed: resumesAssessedCount,
    };

    if (req.body?.email) logPayload.email = req.body.email;
    if (req.body?.page) logPayload.page = req.body.page;

    console.log('Logging to resume_analysis_log with payload:', logPayload);
    
    await db.insert(resumeAnalysisLog).values({
      ipAddress: logPayload.ip_address,
      userAgent: logPayload.user_agent,
      date: logPayload.date,
      numberOfResumesAssessed: logPayload.number_of_resumes_assessed,
      email: logPayload.email,
      page: logPayload.page,
    });

    res.json({ analysisResults: results });
  } catch (error) {
    next(error);
  }
});

export default router;