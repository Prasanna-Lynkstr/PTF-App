

import express from "express";
import { Request, Response } from "express";
import { db } from "../db"; // adjust path if needed
import { resumeAnalysisLog } from "../schema/ResumeAnalysisLog"; // adjust path if needed

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const ip =
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    "unknown";

  const { event, ...rest } = req.body;



  res.status(200).json({ status: "logged" });
});

export default router;