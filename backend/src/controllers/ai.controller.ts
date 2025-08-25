

import { Request, Response } from "express";
import { db } from "../db";
import { aiCostLog } from "../schema/AiCost";
import { desc } from 'drizzle-orm'; // Add this import at the top

export const getAiCostLogs = async (req: Request, res: Response) => {
  try {
    const logs = await db.select().from(aiCostLog).orderBy(desc(aiCostLog.date));
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching AI cost logs:", error);
    res.status(500).json({ message: "Failed to fetch AI cost logs" });
  }
};