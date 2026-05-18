"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'snack-super-secret-key-2026';
const requireAuth = (req, res, next) => {
    // 允许跨域预检请求
    if (req.method === 'OPTIONS') {
        return next();
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: '未授权访问' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // (req as any).user = decoded; // 暂时不需要获取用户信息，只要验证通过即可
        next();
    }
    catch (error) {
        return res.status(401).json({ success: false, error: 'Token 无效或已过期' });
    }
};
exports.requireAuth = requireAuth;
