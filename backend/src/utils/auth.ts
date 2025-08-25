// backend/utils/auth.ts
import { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}