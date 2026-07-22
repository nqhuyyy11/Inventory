"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const requireRole = (allowedRoleNames) => {
    return async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized. User information missing.' });
            return;
        }
        try {
            const role = await prisma_1.default.role.findUnique({
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
        }
        catch (error) {
            res.status(500).json({ message: 'Internal server error during role validation.' });
            return;
        }
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=rbacMiddleware.js.map