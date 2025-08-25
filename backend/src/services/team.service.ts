import { db } from "../db";
import { eq } from "drizzle-orm";
import { orgTeams } from "../schema/User";
import { EventLogUtility } from '../utils/eventlog.util';

export const createTeam = async (teamName: string, organizationId: string) => {
  try {
    const result = await db.insert(orgTeams).values({
      teamName,
      orgId: organizationId,
      isActive: true,
    });
    await EventLogUtility.logInfo(
      'team.service.ts',
      'Team created successfully',
      { teamName, organizationId },
      'team'
    );
    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'team.service.ts',
      'Failed to create team',
      { error },
      'team'
    );
    throw new Error("Failed to create team");
  }
};

export const getTeamsByOrg = async (organizationId: string) => {
  try {
    const result = await db
      .select()
      .from(orgTeams)
      .where(eq(orgTeams.orgId, organizationId));
    
    await EventLogUtility.logInfo(
      'team.service.ts',
      'Fetched teams for organization',
      { organizationId },
      'team'
    );
    

    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'team.service.ts',
      'Failed to fetch teams',
      { error },
      'team'
    );
    throw new Error("Failed to fetch teams");
  }
};
 
export const updateTeam = async (
  teamId: string,
  updates: Partial<{ teamName: string; isActive: boolean }>
) => {
  try {
    const result = await db
      .update(orgTeams)
      .set(updates)
      .where(eq(orgTeams.id, teamId));
    await EventLogUtility.logInfo(
      'team.service.ts',
      'Team updated successfully',
      { teamId, updates },
      'team'
    );
    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'team.service.ts',
      'Failed to update team',
      { error },
      'team'
    );
    throw new Error("Failed to update team");
  }
};

export const deleteTeam = async (teamId: string) => {
  try {
    const result = await db
      .delete(orgTeams)
      .where(eq(orgTeams.id, teamId));
    await EventLogUtility.logInfo(
      'team.service.ts',
      'Team deleted successfully',
      { teamId },
      'team'
    );
    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'team.service.ts',
      'Failed to delete team',
      { error },
      'team'
    );
    throw new Error("Failed to delete team");
  }
};