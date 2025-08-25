import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { organizations } from './Account';
import {users} from './User';

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorId: uuid('actor_id').references(() => users.id),
  actorName: text('actor_name'),
  action: text('action').notNull(),
  description: text('description'),
  entityType: text('entity_type'),
  entityId: uuid('entity_id'),
  performedBy: text('performed_by').notNull(), // 'user' | 'system'
  orgId: uuid('org_id').references(() => organizations.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});