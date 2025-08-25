

import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const resumeAnalysisLog = pgTable("resume_analysis_log", {
  id: serial("id").primaryKey(),
  ipAddress: varchar("ip_address", { length: 45 }).notNull(), // supports IPv4 and IPv6
  email: varchar("email", { length: 255 }),
  date: timestamp("date").defaultNow().notNull(),
  numberOfResumesAssessed: integer("number_of_resumes_assessed").notNull(),
  page: varchar("page", { length: 255 }), // Optional: track which page was used
  userAgent: varchar("user_agent", { length: 1024 }), // Optional: for browser/client info
});