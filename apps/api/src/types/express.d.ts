import type { User } from '@brainify/shared';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};