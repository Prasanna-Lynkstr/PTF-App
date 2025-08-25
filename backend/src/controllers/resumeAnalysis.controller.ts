import { desc } from "drizzle-orm";
import { db } from "../db"; // update path based on your setup
import { resumeAnalysisLog } from "../schema/ResumeAnalysisLog";
import { Request, Response } from "express";

export const getAllResumeAnalysisLogs = async (_req: Request, res: Response) => {
  try {
    const logs = await db.select().from(resumeAnalysisLog).orderBy(desc(resumeAnalysisLog.date));
    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to fetch resume analysis logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};