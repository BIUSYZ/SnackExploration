import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// 简单的环境变量或默认密码 (生产环境请务必设置环境变量)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'snack123';
const JWT_SECRET = process.env.JWT_SECRET || 'snack-super-secret-key-2026';

// 登录接口
router.post('/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    // 密码正确，签发一个简单的 jwt
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '30d' });
    return res.json({ success: true, data: { token } });
  }

  return res.status(401).json({ success: false, error: '密码错误' });
});

// 验证Token状态接口
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: '未提供Token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, JWT_SECRET);
    res.json({ success: true, message: 'Token有效' });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token无效或已过期' });
  }
});

export default router;
