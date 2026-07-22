import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
export declare const requireRole: (allowedRoleNames: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=rbacMiddleware.d.ts.map