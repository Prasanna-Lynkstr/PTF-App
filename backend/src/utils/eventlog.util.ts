import { db } from '../db';
import { pgTable, serial, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const eventLogs = pgTable('event_logs', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 100 }).notNull(), // e.g., system, auth, db, api
  level: varchar('level', { length: 50 }).notNull(), // info, warn, error
  message: varchar('message', { length: 1024 }).notNull(),
  metadata: jsonb('metadata').default({}),
  source: varchar('source', { length: 100 }), // e.g., file/module name
  organizationId: varchar('organization_id', { length: 100 }),
  ipAddress: varchar('ip_address', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export class EventLogUtility {
  static async logInfo(source: string, message: string, metadata: Record<string, any> = {}, type = 'system') {
    return this.log('info', source, message, metadata, type);
  }

  static async logError(source: string, message: string, metadata: Record<string, any> = {}, type = 'system') {
    return this.log('error', source, message, metadata, type);
  }

  static async logWarn(source: string, message: string, metadata: Record<string, any> = {}, type = 'system') {
    return this.log('warn', source, message, metadata, type);
  }

  private static async log(
    level: 'info' | 'warn' | 'error',
    source: string,
    message: string,
    metadata: Record<string, any>,
    type: string
  ) {
    try {
      if (process.env.ENABLE_EVENT_LOGS !== 'true') return;
      await db.insert(eventLogs).values({
        type,
        level,
        message,
        metadata,
        source,
      });
    } catch (e) {
      console.error('Failed to log event', e);
    }
  }
}