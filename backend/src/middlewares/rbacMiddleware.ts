import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import prisma from '../config/prisma';

export const requireRole = (allowedRoleNames: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized. User information missing.' });
      return;
    }

    try {
      const role = await prisma.role.findUnique({
        where: { id: req.user.roleId },
      });

      if (!role) {
        res.status(403).json({ message: 'Forbidden. Role not found.' });
        return;
      }

      if (!allowedRoleNames.includes(role.name)) {
        res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error during role validation.' });
      return;
    }
  };
};
