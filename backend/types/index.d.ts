import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    fullName?: string;
    orgId?: string;
  };
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      fullName?: string;
      orgId?: string;
    };
  }
}