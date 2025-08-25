import { db } from "../db";
import { eq, or, isNull, and, not } from "drizzle-orm";
import { users, orgTeams } from "../schema/User";
import { userRoles } from "../schema/User";
import { organizations } from "../schema/Account";
import { EventLogUtility } from "../utils/eventlog.util";
import { hashPassword } from '../utils/password.util';
import { AppError } from '../utils/app-error';
import { System } from "../utils/system";

// Create user
export const createUser = async (userData: {
  fullName: string;
  email: string;
  password: string;
  orgId: string;
  teamId?: string;
  roleId: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
  signupSource?: string;
}, currentUser: { id: string; fullName: string; orgId: string }) => {
  try {
    if (!userData.password) {
      throw new AppError("Password is required", 400);
    }

    const hashedPassword = await hashPassword(userData.password);

    const result = await db.insert(users).values({
  fullName: userData.fullName,
  email: userData.email,
  passwordHash: hashedPassword,
  orgId: userData.orgId,
  teamId: userData.teamId,
  roleId: userData.roleId,
  isEmailVerified: userData.isEmailVerified ?? false,
  isActive: userData.isActive ?? true,
  signupSource: userData.signupSource,
}).returning({ id: users.id });

    const newUserId = result[0]?.id;

    await EventLogUtility.logInfo(
      'user.service.ts',
      'User created successfully',
      { email: userData.email, orgId: userData.orgId },
      'user'
    );
    await System.log({
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      action: 'User Created',
      description: `User ${userData.fullName} was created`,
      entityType: 'User',
      entityId: newUserId,
      performedBy: 'user',
      orgId: currentUser.orgId,
    });
    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'user.service.ts',
      'Failed to create user',
      { error },
      'user'
    );
    throw new Error("Failed to create user");
  }
};

// Get users by org
export const getUsersByOrg = async (organizationId: string) => {
  try {
    const result = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        isActive: users.isActive,
        isEmailVerified: users.isEmailVerified,
        orgId: users.orgId,
        orgName: organizations.companyName,
        roleId: users.roleId,
        roleName: userRoles.label,
        teamId: users.teamId,
        teamName: orgTeams.teamName,
      })
      .from(users)
      .leftJoin(userRoles, eq(users.roleId, userRoles.id))
      .leftJoin(orgTeams, eq(users.teamId, orgTeams.id))
      .leftJoin(organizations, eq(users.orgId, organizations.id))
      .where(eq(users.orgId, organizationId));

    await EventLogUtility.logInfo(
      'user.service.ts',
      'Fetched users for organization',
      { organizationId },
      'user'
    );

    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'user.service.ts',
      'Failed to fetch users',
      { error },
      'user'
    );
    throw new AppError("Failed to fetch users", 500);
  }
};

// Update user
export const updateUser = async (
  userId: string,
  updates: Partial<{
    fullName: string;
    email: string;
    passwordHash: string;
    orgId: string;
    teamId: string;
    roleId: string;
    isEmailVerified: boolean;
    isActive: boolean;
    signupSource: string;
  }>,
  req?: { user?: { id?: string; fullName?: string; orgId?: string } }
) => {
  try {
    // Check if update results in no active OrgAdmin left
    const currentUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (currentUser.length === 0) {
      throw new AppError("User not found", 404);
    }

    const currentUserRole = await db.select().from(userRoles).where(eq(userRoles.id, currentUser[0].roleId)).limit(1);
const isOrgAdmin = currentUserRole[0]?.name?.toLowerCase() === 'orgadmin';
    const orgId = currentUser[0].orgId;
    const wasActive = currentUser[0].isActive;
    const willBeInactive = updates.isActive === false;


    if (isOrgAdmin && wasActive && willBeInactive) {
      if (!orgId) {
        throw new AppError("Organization ID is missing for user", 400);
      }

      const activeOrgAdmins = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.orgId, orgId),
            eq(users.roleId, currentUser[0].roleId),
            eq(users.isActive, true),
            not(eq(users.id, userId))
          )
        );


      if (activeOrgAdmins.length === 0) {
        throw new AppError("Organization must have at least one active Admin", 400);
      }
    }

    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId));

    await EventLogUtility.logInfo(
      'user.service.ts',
      'User updated successfully',
      { userId, updates },
      'user'
    );
    console.debug('updateUser - actorId:', req?.user?.id);
    console.debug('updateUser - actorName:', req?.user?.fullName);
    console.debug('updateUser - orgId:', req?.user?.orgId);
    await System.log({
      actorId: req?.user?.id,
      actorName: req?.user?.fullName,
      action: 'User Updated',
      description: `User ${currentUser[0].fullName} was updated`,
      entityType: 'User',
      entityId: userId,
      performedBy: 'user',
      orgId: req?.user?.orgId,
    });
    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'user.service.ts',
      'Failed to update user',
      { error },
      'user'
    );

    if (error instanceof AppError) {
      throw new AppError(`Failed to update user: ${error.message}`, error.statusCode);
    }
    throw new AppError("Failed to update user", 500);
  }
};

// Delete user
export const deleteUser = async (userId: string, req?: { user?: { id?: string; fullName?: string; orgId?: string } }) => {
  try {
    // Check if the user to be deleted is an OrgAdmin and active
    const userToDelete = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userToDelete.length === 0) {
      throw new AppError("User not found", 404);
    }

    const userToDeleteRole = await db.select().from(userRoles).where(eq(userRoles.id, userToDelete[0].roleId)).limit(1);
    const isOrgAdmin = userToDeleteRole[0]?.name?.toLowerCase() === 'orgadmin';
    const orgId = userToDelete[0].orgId;

    if (isOrgAdmin && userToDelete[0].isActive) {
      if (!orgId) {
        throw new AppError("Organization ID is missing for user", 400);
      }

      const activeOrgAdmins = await db
        .select()
        .from(users)
        .where(
          and(
            eq(users.orgId, orgId),
            eq(users.roleId, userToDelete[0].roleId),
            eq(users.isActive, true),
            not(eq(users.id, userId))
          )
        );

      if (activeOrgAdmins.length === 0) {
        throw new AppError("Organization must have at least one active Admin", 400);
      }
    }

   const result = await db.delete(users).where(eq(users.id, userId));
    await EventLogUtility.logInfo(
      'user.service.ts',
      'User deleted successfully',
      { userId },
      'user'
    );
    console.debug('deleteUser - actorId:', req?.user?.id);
    console.debug('deleteUser - actorName:', req?.user?.fullName);
    console.debug('deleteUser - orgId:', req?.user?.orgId);
    await System.log({
      actorId: req?.user?.id,
      actorName: req?.user?.fullName,
      action: 'User Deleted',
      description: `User ${userToDelete[0].fullName} was deleted`,
      entityType: 'User',
      entityId: userId,
      performedBy: 'user',
      orgId: req?.user?.orgId,
    });
    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'user.service.ts',
      'Failed to delete user',
      { error },
      'user'
    );

    if (error instanceof AppError) {
      throw new AppError(`Failed to delete user: ${error.message}`, error.statusCode);
    }
    throw new AppError("Failed to delete user", 500);
  }
};

// Get user roles by org, including global roles (orgId is null)
export const getUserRolesByOrg = async (organizationId: string) => {
  try {
    const result = await db
      .select()
      .from(userRoles)
      .where(
        or(
          eq(userRoles.orgId, organizationId),
          isNull(userRoles.orgId)
        )
      );

    await EventLogUtility.logInfo(
      'user.service.ts',
      'Fetched user roles for organization (including global roles)',
      { organizationId },
      'user'
    );

    return result;
  } catch (error) {
    await EventLogUtility.logError(
      'user.service.ts',
      'Failed to fetch user roles',
      { error },
      'user'
    );
    throw new AppError("Failed to fetch user roles", 500);
  }
};