import { db } from '../db'; // your drizzle instance
import { users } from '../schema/User';
import { organizations } from '../schema/Account';
import { userRoles } from '../schema/User'; // Assuming you have a roles table
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app-error';
import { EventLogUtility } from '../utils/eventlog.util';
import crypto from 'crypto';

import { sendForgotPasswordEmail } from '../utils/email.util'; // Ensure this exists


export const loginService = async (email: string, password: string) => {
  const result = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      roleId: users.roleId,
      roleName: userRoles.name,
      orgId: users.orgId,
      organizationName: organizations.companyName,
      passwordHash: users.passwordHash,
      isEmailVerified: users.isEmailVerified
    })
    .from(users)
    .leftJoin(organizations, eq(users.orgId, organizations.id))
    .leftJoin(userRoles, eq(users.roleId, userRoles.id))
    .where(eq(users.email, email))
    .limit(1);

  const user = result[0];

  await EventLogUtility.logInfo('AUTH_ATTEMPT', `Login attempt for ${email}`);

  if (!user) {
    await EventLogUtility.logError('AUTH_FAILURE', `Login failed for ${email}: user not found`);
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    await EventLogUtility.logError('AUTH_FAILURE', `Login failed for ${email}: password mismatch`);
    throw new AppError('Invalid credentials', 401);
  }

  await EventLogUtility.logInfo('AUTH_SUCCESS', `Login successful for ${email}`);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      orgId: user.orgId,
      role: user.roleId
    },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  // Exclude sensitive fields
  const { passwordHash, ...safeUser } = user;

  return { token, user: safeUser };
};





export const forgotPasswordService = async (email: string) => {
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = userResult[0];

  if (!user) {
    await EventLogUtility.logError('FORGOT_PASSWORD_FAILURE', `User not found for ${email}`);
    throw new AppError('User not found', 404);
  }

  const newPassword = crypto.randomBytes(4).toString('hex'); // 8-char new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db
    .update(users)
    .set({ passwordHash: hashedPassword })
    .where(eq(users.id, user.id));

  await sendForgotPasswordEmail(
    email,
    newPassword
  );

  await EventLogUtility.logInfo('FORGOT_PASSWORD_SUCCESS', `Password reset and sent for ${email}, new password: ${newPassword}`);
  return { message: 'New password sent to your email' };
};

export const verifyCurrentPassword = async (email: string, password: string): Promise<boolean> => {
  const userResult = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = userResult[0];

  if (!user) {
    await EventLogUtility.logError('PASSWORD_VERIFICATION_FAILED', `User not found for ${email}`);
    return false;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    await EventLogUtility.logInfo('PASSWORD_VERIFICATION_FAILED', `Password mismatch for ${email}`);
  }

  return isMatch;
};