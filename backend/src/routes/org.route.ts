import { Router } from 'express';
import {
  createOrganization,
  addOrgSetting,
  getOrgSettings,
  upsertOrgProfile,
  getOrgProfile,
  verifyOrgEmail,
  verifyEmailByCodeAndEmail,
  resendVerificationCode,
  hasProfile,
  updateOrgProfile,
  getOrgProfileDetails
} from '../controllers/org.controller';
import { getTeamsByOrgId, createTeam, updateTeam, deleteTeam } from "../controllers/team.controller";

const router = Router();

router.post('/', createOrganization);
router.post('/:orgId/settings', addOrgSetting);
router.get('/:orgId/settings', getOrgSettings);
router.post('/:orgId/profile', upsertOrgProfile);
router.get('/:orgId/profile', getOrgProfile); 
router.post('/:orgId/verify', verifyOrgEmail);
router.post('/resend-verification', resendVerificationCode);
router.post('/verify-email-code', verifyEmailByCodeAndEmail);
router.get('/:orgId/has-profile', hasProfile);

router.put('/:orgId/profile', updateOrgProfile);
router.get('/:orgId/profile-details', getOrgProfileDetails);

router.get('/:orgId/teams', getTeamsByOrgId);
router.post('/:orgId/create-team', createTeam);
router.put('/:orgId/teams/:teamId', updateTeam);
router.delete('/:orgId/teams/:teamId', deleteTeam);

export default router;