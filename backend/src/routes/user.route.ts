import { getUserRolesByOrgId } from '../controllers/user.controller';
import * as userController from '../controllers/user.controller';
import { AppError } from '../utils/app-error';
import * as orgService from '../services/org.service';
import { requireAuth } from '../utils/auth'; // adjust path if needed
import { db } from '../db';
import { users } from '../schema/User';
import { organizations } from '../schema/Account';
import { userRoles } from '../schema/User';
import { eq } from 'drizzle-orm';

export async function getUserDetails(userId: string) {
  const result = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      organizationId: users.orgId,
      roleId: users.roleId,
      organizationName: organizations.companyName,
      roleName: userRoles.name
    })
    .from(users)
    .leftJoin(organizations, eq(users.orgId, organizations.id))
    .leftJoin(userRoles, eq(users.roleId, userRoles.id))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

import { Request, Response, Router } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const router = Router();

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await getUserDetails(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:userId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    const user = await getUserDetails(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/update-profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { fullName, currentPassword, newPassword, confirmPassword } = req.body;

    const result = await orgService.updateUserProfile(userId, {
      fullName,
      currentPassword,
      newPassword,
    });

    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/org/:orgId/user', requireAuth, userController.getUsersByOrgId);
router.post('/org/:orgId/user', requireAuth, userController.createUser);
router.get('/org/:orgId/roles', requireAuth, getUserRolesByOrgId);
router.put('/org/:userId/user', requireAuth, userController.updateUser);
router.delete('/org/:userId/user', requireAuth, userController.deleteUser);

export default router;