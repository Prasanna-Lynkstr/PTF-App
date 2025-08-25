import { getAllEmailLogs } from "../controllers/email.controller";
import { getAiCostLogs } from "../controllers/ai.controller";
import { Router, Request, Response } from "express";
import { getAllResumeAnalysisLogs } from "../controllers/resumeAnalysis.controller";
import { System } from '../utils/system'; // Adjust the path if different
import { requireAuth } from '../utils/auth'; // adjust path if needed

const router = Router();

router.get("/resume-analysis-log", getAllResumeAnalysisLogs);
router.get("/email-log", getAllEmailLogs);
router.get("/ai-cost-log", getAiCostLogs);

const fetchLogsForOrg = async (req: Request, res: Response) => {
  try {
    const orgId = req.user?.orgId;
    const limit = parseInt(req.query.limit as string) || 10;
    if (!orgId) return res.status(400).json({ message: "Missing orgId in user context" });

    const logs = await System.fetchLogsForOrg({ orgId, limit });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch activity logs" });
  }
};

router.get("/activity-log", requireAuth, fetchLogsForOrg);

export default router;