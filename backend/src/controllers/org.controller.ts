import { Request, Response } from 'express';
import * as OrgService from '../services/org.service';
import { AppError } from '../utils/app-error';

export async function createOrganization(req: Request, res: Response) {
  try {
    const org = await OrgService.createOrg(req.body);
    res.status(201).json(org);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  }
}

export async function addOrgSetting(req: Request, res: Response) {
  const setting = await OrgService.addSetting(req.params.orgId, req.body);
  res.status(201).json(setting);
}

export async function getOrgSettings(req: Request, res: Response) {
  const settings = await OrgService.getSettings(req.params.orgId);
  res.json(settings);
}

export async function upsertOrgProfile(req: Request, res: Response) {
  const profile = await OrgService.upsertProfile(req.params.orgId, req.body);
  res.status(200).json(profile);
}

export async function getOrgProfile(req: Request, res: Response) {
  const profile = await OrgService.getProfile(req.params.orgId);
  res.json(profile);
}

export async function verifyOrgEmail(req: Request, res: Response) {
  const { code } = req.body;
  const { orgId } = req.params;

  try {
    const result = await OrgService.verifyEmail(orgId, code);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Email verification failed' });
  }
}

export async function resendVerificationCode(req: Request, res: Response) {
  const { email } = req.body;

  try {
    const result = await OrgService.resendVerificationCode(email);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Resend verification failed' });
  }
};

export async function verifyEmailByCodeAndEmail(req: Request, res: Response) {
  const { email, code } = req.body;

  try {
    const result = await OrgService.verifyEmailByCodeAndEmail(email, code);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export async function hasProfile(req: Request, res: Response) {
  const { orgId } = req.params;

  try {
    const exists = await OrgService.hasProfile(orgId);
    res.status(200).json({ hasProfile: exists });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to check organization profile.' });
  }
}
export async function updateUserProfile(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const result = await OrgService.updateUserProfile(userId, req.body);
    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update user profile.' });
    }
  }
}
export async function updateOrgProfile(req: Request, res: Response) {
  const { orgId } = req.params;
 

  try {
    const updatedProfile = await OrgService.updateOrgProfile(orgId, req.body);
    res.status(200).json(updatedProfile);
  } catch (error: any) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Failed to update organization profile.' });
    }
  }
}

export async function getOrgProfileDetails(req: Request, res: Response) {
  const { organizationId } = req.params;

  try {
    const profile = await OrgService.getOrgProfile(organizationId);
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch organization profile.' });
  }
}