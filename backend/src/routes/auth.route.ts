import { Router } from 'express';
import { loginUser } from '../controllers/auth.controller';
import { logoutUser } from '../controllers/auth.controller';
import { sendForgotPasswordController } from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', sendForgotPasswordController);

export default router;