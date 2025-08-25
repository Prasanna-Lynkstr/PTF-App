import { pgTable, serial, text, timestamp, numeric } from "drizzle-orm/pg-core";

export const aiCostLog = pgTable("ai_cost_log", {
  id: serial("id").primaryKey(),
  feature: text("feature").notNull(), // e.g., "resume_analysis", "fitment_check"
  tokenSize: numeric("token_size"),
  costUsd: numeric("cost_usd"),
  costInr: numeric("cost_inr"), 
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  date: timestamp("date").defaultNow(),
});

