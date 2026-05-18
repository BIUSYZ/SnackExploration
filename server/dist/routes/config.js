"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const router = (0, express_1.Router)();
const CONFIG_PATH = node_path_1.default.join(__dirname, '../../data/config.json');
// Ensure data directory exists
const ensureConfig = async () => {
    const dir = node_path_1.default.dirname(CONFIG_PATH);
    try {
        await promises_1.default.access(dir);
    }
    catch {
        await promises_1.default.mkdir(dir, { recursive: true });
    }
    try {
        await promises_1.default.access(CONFIG_PATH);
    }
    catch {
        await promises_1.default.writeFile(CONFIG_PATH, JSON.stringify({
            ocrProvider: 'Aliyun',
            ocrKey: '',
            ocrSecret: ''
        }, null, 2));
    }
};
// GET config (Sanitized)
router.get('/', async (req, res) => {
    await ensureConfig();
    const rawData = await promises_1.default.readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(rawData);
    // Mask sensitive data for UI
    const mask = (str) => {
        if (!str)
            return '';
        if (str.length <= 8)
            return '********';
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
    const rawData = await promises_1.default.readFile(CONFIG_PATH, 'utf-8');
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
    await promises_1.default.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
    res.json({ success: true, message: 'Settings saved successfully' });
});
exports.default = router;
