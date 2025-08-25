import { EventLogUtility } from '../utils/eventlog.util';
import { sendOrgVerificationEmail } from '../utils/email.util';
import { db } from '../db';
import { organizations, organizationSettings, organizationProfiles } from '../schema/Account';
import { userRoles, users } from '../schema/User';
import { generateApiKey } from '../utils/org.utils';
import { sql, eq, like } from 'drizzle-orm';
import { hashPassword } from '../utils/password.util';
import { verifyCurrentPassword } from './auth.service';
import { AppError } from '../utils/app-error';

export async function createOrg(data: any) {
  const existingByEmail = await db.select().from(organizations).where(eq(organizations.email, data.email));
  const existingByCompany = await db.select().from(organizations).where(eq(organizations.companyName, data.companyName));

  if (existingByEmail.length || existingByCompany.length) {
    throw new AppError('An organization with the same company name or email already exists', 400);
  }

  const apiKey = generateApiKey();
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const {
    fullName,
    companyName,
    email,
    password,
    officialWebsite,
    verificationDocumentUrl = null,
    acceptTerms,
    signupSource = 'manual',
  } = data;

  if (!password) throw new Error('Password is required');
  const passwordHash = await hashPassword(password);

  try {
    const [org] = await db.insert(organizations).values({
      fullName,
      companyName,
      email,
      isEmailVerified: false,
      officialWebsite,
      verificationDocumentUrl,
      acceptTerms,
      signupSource,
      apiKey,
      verificationCode
    }).returning({ id: organizations.id });

    // Fetch Org Admin role dynamically
    const [orgAdminRole] = await db.select().from(userRoles).where(eq(userRoles.name, 'orgAdmin'));
    if (!orgAdminRole) throw new Error('Org Admin role not found');
    // Insert org admin user for this organization
    await db.insert(users).values({
      fullName,
      email,
      passwordHash,
      orgId: org.id,
      roleId: orgAdminRole.id,
      isEmailVerified: false,
    });
    await EventLogUtility.logInfo('org.service.ts', 'Org Admin User created successfully', { orgId: org.id, email }, 'org');


    await sendOrgVerificationEmail(email, companyName || 'your company', verificationCode);
    await EventLogUtility.logInfo('org.service.ts', 'Organization created successfully', { orgId: org.id, email }, 'org');
    return org;
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to create organization', { error, email }, 'org');
    throw error;
  }
}

export async function addSetting(orgId: string, { key, value }: { key: string, value: string }) {
  try {
    const [setting] = await db.insert(organizationSettings).values({
      organizationId: orgId, key, value
    }).returning();
    return setting;
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to add organization setting', { orgId, key, error }, 'org');
    throw error;
  }
}

export async function getSettings(orgId: string) {
  try {
    const settings = await db.select().from(organizationSettings).where(eq(organizationSettings.organizationId, orgId));
    return settings;
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to fetch organization settings', { orgId, error }, 'org');
    throw error;
  }
}

export async function updateOrgProfile(orgId: string, data: {
  logoUrl?: string;
  coverImageUrl?: string;
  about: string;
  mission?: string;
  vision?: string;
  website: string;
  contactEmail?: string;
  contactPhone?: string;
  yearOfFounding: string;
  headquarters: string;
  numberOfEmployees: string;
  companyType: string;
}) {
 
  try {
    const existing = await db.select().from(organizationProfiles).where(eq(organizationProfiles.organizationId, orgId));
    const updateData = { ...data, updatedAt: new Date() };

    if (existing.length) {
      await db.update(organizationProfiles)
        .set(updateData)
        .where(eq(organizationProfiles.organizationId, orgId));
      await EventLogUtility.logInfo('org.service.ts', 'Organization profile updated', { orgId }, 'org');
      return { message: 'Profile updated successfully' };
    } else {
      const [inserted] = await db.insert(organizationProfiles)
        .values({ ...updateData, organizationId: orgId, createdAt: new Date() })
        .returning();
      await EventLogUtility.logInfo('org.service.ts', 'Organization profile created', { orgId }, 'org');
      return inserted;
    }
  } catch (error) {
    console.error("updateOrgProfile error:", error);
    await EventLogUtility.logError('org.service.ts', 'Failed to update organization profile', { orgId, error }, 'org');
    throw error;
  }
}

export async function getOrgProfile(orgId: string) {
  try {
    const [profile] = await db.select().from(organizationProfiles).where(eq(organizationProfiles.organizationId, orgId));
    return profile;
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to get organization profile', { orgId, error }, 'org');
    throw error;
  }
}

export async function upsertProfile(orgId: string, profile: any) {
  try {
    const existing = await db.select().from(organizationProfiles).where(eq(organizationProfiles.organizationId, orgId));
    if (existing.length) {
      await db.update(organizationProfiles)
        .set(profile)
        .where(eq(organizationProfiles.organizationId, orgId));
      await EventLogUtility.logInfo('org.service.ts', 'Updated organization profile', { orgId }, 'org');
      return { message: 'Updated' };
    } else {
      const [inserted] = await db.insert(organizationProfiles)
        .values({ ...profile, organizationId: orgId })
        .returning();
      await EventLogUtility.logInfo('org.service.ts', 'Created organization profile', { orgId }, 'org');
      return inserted;
    }
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to upsert organization profile', { orgId, error }, 'org');
    throw error;
  }
}

export async function getProfile(orgId: string) {
  try {
    const [profile] = await db.select().from(organizationProfiles).where(eq(organizationProfiles.organizationId, orgId));
    return profile;
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to fetch organization profile', { orgId, error }, 'org');
    throw error;
  }
}

export async function verifyEmail(orgId: string, code: string) {
  try {
    const orgs: { id: string, verificationCode: string | null }[] = await db.select({
      id: organizations.id,
      verificationCode: organizations.verificationCode,
    }).from(organizations).where(eq(organizations.id, orgId));

    const org = orgs[0];
    if (!org) throw new Error('Organization not found');

    if (org.verificationCode !== code) {
      await EventLogUtility.logWarn('org.service.ts', 'Email verification failed – code mismatch', { orgId, code }, 'org');
      throw new Error('Invalid verification code');
    }

    await db.update(organizations)
      .set({ verificationCode: null, isEmailVerified: true })
      .where(eq(organizations.id, orgId));

    await EventLogUtility.logInfo('org.service.ts', 'Email verified successfully', { orgId }, 'org');
    return { success: true };
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to verify email', { orgId, error }, 'org');
    throw error;
  }
}
// Verifies org email by code and email
export async function verifyEmailByCodeAndEmail(email: string, code: string) {
  try {
    const [org] = await db.select().from(organizations).where(eq(organizations.email, email));
    if (!org) throw new Error('Organization not found');

    if (org.verificationCode !== code) {
      await EventLogUtility.logWarn('org.service.ts', 'Email verification failed – code mismatch', { email, code }, 'org');
      throw new AppError('Invalid verification code', 400);
    }

    await db.update(organizations)
      .set({ verificationCode: null, isEmailVerified: true })
      .where(eq(organizations.id, org.id));

    await db.update(users)
      .set({ isEmailVerified: true })
      .where(eq(users.email, email));

    await EventLogUtility.logInfo('org.service.ts', 'Email verified successfully', { email }, 'org');
    return { success: true };
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to verify email', { email, error }, 'org');
    throw error;
  }
}

// Resends verification code to org email
export async function resendVerificationCode(email: string) {
  try {
    const [org] = await db.select().from(organizations).where(eq(organizations.email, email));
    if (!org) throw new Error('Organization not found');
    if (org.isEmailVerified) throw new Error('Email already verified');

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    await db.update(organizations)
      .set({ verificationCode: newCode })
      .where(eq(organizations.id, org.id));

    await sendOrgVerificationEmail(email, org.companyName || 'your company', newCode);
    await EventLogUtility.logInfo('org.service.ts', 'Verification code resent', { email }, 'org');
    return { success: true };
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to resend verification code', { email, error }, 'org');
    throw error;
  }
}
// Checks if an organization has a profile set
export async function hasProfile(orgId: string) {
  try {
    const count = await db
  .select({ count: sql<number>`count(1)` })
  .from(organizationProfiles)
  .where(eq(organizationProfiles.organizationId, orgId));

    const hasProfile = count?.[0]?.count > 0;
    return { hasProfile };
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to check organization profile existence', { orgId, error }, 'org');
    throw error;
  }
}
// Checks if a user exists by email
export async function userExists(email: string): Promise<boolean> {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return !!user;
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to check user existence by email', { email, error }, 'org');
    throw error;
  }
}
export async function updateUserProfile(userId: string, updates: { fullName?: string, currentPassword?: string, newPassword?: string}) {
  const { fullName, currentPassword, newPassword } = updates;

  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isAnyPasswordFieldPresent = !!(currentPassword || newPassword);
    const areAllPasswordFieldsProvided = !!(currentPassword && newPassword);

    if (isAnyPasswordFieldPresent) {
      if (!areAllPasswordFieldsProvided) {
        throw new AppError('All password fields are required to change password', 400);
      }

      const isValid = await verifyCurrentPassword(user.email, currentPassword);
      if (!isValid) {
        throw new AppError('Current password is incorrect', 401);
      }

     
      const newHashedPassword = await hashPassword(newPassword);
      await db.update(users)
        .set({ passwordHash: newHashedPassword })
        .where(eq(users.id, userId));

      await EventLogUtility.logInfo('org.service.ts', 'User password updated successfully', { userId }, 'user');
    }

    if (fullName && fullName !== user.fullName) {
      await db.update(users)
        .set({ fullName })
        .where(eq(users.id, userId));
      await EventLogUtility.logInfo('org.service.ts', 'User full name updated successfully', { userId, fullName }, 'user');
    }

    return { success: true };
  } catch (error) {
    await EventLogUtility.logError('org.service.ts', 'Failed to update user profile', { userId, error }, 'user');
    throw error;
  }
}