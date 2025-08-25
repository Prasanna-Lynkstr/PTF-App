import nodemailer from 'nodemailer';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { db } from '../db';
import { emailLog } from '../schema/EmailLog';
import { Request } from 'express';
import { EventLogUtility } from './eventlog.util';

function createZeptoTransporter() {
  return nodemailer.createTransport({
    host: "smtp.zeptomail.in",
    port: 587,
    secure: false,
    auth: {
      user: "emailapikey",
      pass: process.env.ZEPTO_PASSWORD || "PHtE6r0KSunvg28t9UIGtve4QJH3M9gq/bszf1ROtY5DXvYKGE1Trt8ilWC2rU8iVfhEQP6Tmo5qsbudtu/XdDnqPGtLVWqyqK3sx/VYSPOZsbq6x00fsVoZcUTcUI/te9Bt0ifWvd7bNA=="
    }
  });
}

interface ResumeResult {
  name: string;
  email?: string;
  phone?: string;
  score: number;
  fitment: string;
  comments?: string;
  matchedSkills?: string[];
  missingSkills?: string[];
  resumeQuality?: number;
  jobStability?: number;
  jdFitment?: number;
  suggestions?: string[];
}

export async function sendAnalysisEmail(
  req: Request,
  recipientEmail: string,
  results: ResumeResult[]
): Promise<void> {
  const transporter = createZeptoTransporter();

  const fields = [
    'name',
    'email',
    'phone',
    'score',
    'fitment',
    'comments',
    'matchedSkills',
    'missingSkills',
    'resumeQuality',
    'jobStability',
    'jdFitment',
    'suggestions'
  ];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(results);

  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, `resume_analysis_${Date.now()}.csv`);
  fs.writeFileSync(filePath, csv);

  try {
    if (process.env.NODE_ENV === 'production') {
      await transporter.sendMail({
        from: process.env.ZEPTO_FROM || 'no-reply@scryyn.com',
        to: recipientEmail,
        subject: 'Resume Analysis Report',
        text: 'Please find attached the resume analysis summary in Excel-compatible CSV format.',
        attachments: [
          {
            filename: 'resume_analysis.csv',
            path: filePath
          }
        ]
      });
      await EventLogUtility.logInfo('email.util.ts', 'Resume analysis email sent', {
        recipient: recipientEmail,
        numberOfResumes: results.length
      }, 'email');
    } else {
      console.log('Email sending skipped in non-production environment.');
    }

    await db.insert(emailLog).values({
        email: recipientEmail,
        date: new Date(),
        numberOfResumesIncluded: results.length.toString(),
        ipAddress: Array.isArray(req.headers['x-forwarded-for'])
          ? req.headers['x-forwarded-for'][0]
          : req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
        userAgent: req.headers['user-agent'] || '',
        page: req.url || ''
      });
  } catch (error) {
    await EventLogUtility.logError('email.util.ts', 'Error sending analysis email', {
      recipient: recipientEmail,
      error
    }, 'email');
    console.error('Error sending analysis email:', error);
    throw error;
  }

  fs.unlink(filePath, () => {}); // Clean up
}
export async function sendOrgVerificationEmail(
  toEmail: string,
  orgName: string,
  verificationCode: string
): Promise<void> {
  const transporter = createZeptoTransporter();

  if (process.env.NODE_ENV === 'production') {
    await transporter.sendMail({
      from: process.env.ZEPTO_FROM || 'no-reply@scryyn.com',
      to: toEmail,
      subject: `Welcome to ${orgName} – Verify Your Email`,
      text: `Thank you for signing up with ${orgName}. Please verify your email using the following code:\n\n${verificationCode}\n\nIf you did not sign up, please ignore this email.`
    });
    await EventLogUtility.logInfo('email.util.ts', 'Verification email sent', {
      recipient: toEmail,
      orgName,
      verificationCode
    }, 'email');
  } else {
    console.log(`Verification email (non-prod): ${toEmail} – Code: ${verificationCode}`);
    await EventLogUtility.logInfo('email.util.ts', 'Verification email not sent (non-prod)', {
      recipient: toEmail,
      orgName,
      verificationCode
    }, 'email');
  }
}

export async function sendForgotPasswordEmail(
  toEmail: string,
  newPassword: string
): Promise<void> {
  const transporter = createZeptoTransporter();

  if (process.env.NODE_ENV === 'production') {
    await transporter.sendMail({
      from: process.env.ZEPTO_FROM || 'no-reply@scryyn.com',
      to: toEmail,
      subject: 'Your Password Has Been Reset',
      text: `Hello,\n\nYour new password is: ${newPassword}\n\nPlease log in and change this password as soon as possible.\n\nIf you did not request this reset, please contact support immediately.`
    });

    await EventLogUtility.logInfo('email.util.ts', 'Forgot password email sent', {
      recipient: toEmail
    }, 'email');
  } else {
    console.log(`Forgot password email (non-prod): ${toEmail} – New Password: ${newPassword}`);
    await EventLogUtility.logInfo('email.util.ts', 'Forgot password email not sent (non-prod)', {
      recipient: toEmail
    }, 'email');
  }
}