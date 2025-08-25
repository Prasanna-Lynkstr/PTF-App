

import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const emailLog = pgTable('email_log', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  page: text('page'),
  date: timestamp('date').defaultNow(),
  numberOfResumesIncluded: text('number_of_resumes_included'),
});