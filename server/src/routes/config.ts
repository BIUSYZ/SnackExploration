import { Router } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';

const router = Router();
const CONFIG_PATH = path.join(__dirname, '../../data/config.json');

// Ensure data directory exists
const ensureConfig = async () => {
  const dir = path.dirname(CONFIG_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }

  try {
    await fs.access(CONFIG_PATH);
  } catch {
    await fs.writeFile(CONFIG_PATH, JSON.stringify({
      ocrProvider: 'Aliyun',
      ocrKey: '',
      ocrSecret: ''
    }, null, 2));
  }
};

// GET config (Sanitized)
router.get('/', async (req, res) => {
  await ensureConfig();
  const rawData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const config = JSON.parse(rawData);
  
  // Mask sensitive data for UI
  const mask = (str: string) => {
    if (!str) return '';
    if (str.length <= 8) return '********';
    return `${str.substring(0, 4)}****${str.substring(str.length - 4)}`;
  };

  res.json({
    success: true,
    data: {
      ocrProvider: config.ocrProvider,
      ocrKey: mask(config.ocrKey),
      ocrSecret: mask(config.ocrSecret),
      hasKey: !!config.ocrKey,
      hasSecret: !!config.ocrSecret
    }
  });
});

// POST config (Update)
router.post('/', async (req, res) => {
  await ensureConfig();
  const { ocrProvider, ocrKey, ocrSecret } = req.body;
  const rawData = await fs.readFile(CONFIG_PATH, 'utf-8');
  const currentConfig = JSON.parse(rawData);

  // Only update if provided
  const newConfig = {
    ...currentConfig,
    ocrProvider: ocrProvider || currentConfig.ocrProvider,
  };

  if (ocrKey && !ocrKey.includes('****')) {
    newConfig.ocrKey = ocrKey;
  }
  if (ocrSecret && !ocrSecret.includes('****')) {
    newConfig.ocrSecret = ocrSecret;
  }

  await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
  res.json({ success: true, message: 'Settings saved successfully' });
});

export default router;
