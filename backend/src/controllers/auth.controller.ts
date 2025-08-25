import { userExists } from '../services/org.service';
import { Request, Response, NextFunction } from 'express';
import { loginService } from '../services/auth.service';
import { forgotPasswordService } from '../services/auth.service';
import { EventLogUtility } from '../utils/eventlog.util';

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginService(email, password);

    // Set HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      maxAge: 4 * 60 * 60 * 1000, // 4 hours
      sameSite: 'lax'
    });

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
   secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'lax',
  });
  return res.status(200).json({ message: 'Logged out successfully' });
};


export const sendForgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    EventLogUtility.logInfo('auth.controller.ts', `Received forgot password request for email: ${email}`, { email }, 'auth');
    const user = await userExists(email);
    if (!user) {
      EventLogUtility.logInfo('auth.controller.ts', `Forgot password requested for non-existent email: ${email}`, { email }, 'auth');
      return res.status(200).json({ message: 'A temporary password has been sent to your email.' });
    }
    await forgotPasswordService(email);
    res.status(200).json({ message: 'A temporary password has been sent to your email.' });
  } catch (error) {
    next(error);
  }
};
