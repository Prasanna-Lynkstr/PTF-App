import { db } from '../db';
import { activityLogs } from '../schema/System';
import { eq, desc } from 'drizzle-orm';

export class System {
  static async log({
    actorId,
    actorName,
    action,
    description,
    entityType,
    entityId,
    performedBy = 'user',
    orgId,
  }: {
    actorId?: string;
    actorName?: string;
    action: string;
    description?: string;
    entityType?: string;
    entityId?: string;
    performedBy?: 'user' | 'system';
    orgId?: string;
  }) {
    await db.insert(activityLogs).values({
      actorId,
      actorName,
      action,
      description,
      entityType,
      entityId,
      performedBy,
      orgId,
    });
  }


  static async fetchLogsForOrg({
    orgId,
    limit = 10,
  }: {
    orgId: string;
    limit?: number;
  }) {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.orgId, orgId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }
}