import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import { extractTextFromResume } from '../utils/resumeTextExtractor';
import { analyzeResumeWithOpenAI } from '../utils/openaiService';

export const analyzeResume = async (req: Request): Promise<any> => {
  try {
    const { jobDescription } = req.body;
    const file = req.file;

    if (!file || !jobDescription) {
      throw new Error('Missing resume file or job description');
    }

    // Extract resume text
    const filePath = path.resolve(file.path);
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Unsupported file type. Only PDF and DOCX are allowed.');
    }
    console.log('Resume file received:', file.originalname, '| Type:', file.mimetype);
    const resumeBuffer = fs.readFileSync(filePath);
    // Cleanup uploaded file after reading
    fs.unlink(filePath, (err) => {
      if (err) console.warn('Failed to delete uploaded file:', err);
    });
    const resumeText = await extractTextFromResume(resumeBuffer, file.originalname);
    console.log('Resume text preview:', resumeText.slice(0, 300));
    console.log('Extracted resume text length:', resumeText.length);
    console.log('Calling OpenAI with JD:', jobDescription.substring(0, 100));

    // Call OpenAI with extracted text and job description
    const forwardedFor = req.headers?.['x-forwarded-for'];
    const ipAddress = typeof forwardedFor === 'string'
      ? forwardedFor.split(',')[0].trim()
      : req.socket?.remoteAddress || '';
    const userAgent = req.headers?.['user-agent'] ?? '';
    const result = await analyzeResumeWithOpenAI(resumeText, jobDescription, ipAddress, userAgent);

    // Return result
    return result;
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    throw new Error('Failed to analyze resume');
  }
};