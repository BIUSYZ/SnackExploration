"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_fs_1 = __importDefault(require("node:fs"));
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const ocr_api20210707_1 = __importStar(require("@alicloud/ocr-api20210707")), $OcrApi20210707 = ocr_api20210707_1;
const $OpenApi = __importStar(require("@alicloud/openapi-client"));
const $Util = __importStar(require("@alicloud/tea-util"));
const router = (0, express_1.Router)();
const CONFIG_PATH = node_path_1.default.join(__dirname, '../../data/config.json');
const UPLOADS_DIR = node_path_1.default.join(__dirname, '../../data/uploads');
// Initialize Aliyun Client (new 2021-07-07 version)
async function createClient(accessKeyId, accessKeySecret) {
    let config = new $OpenApi.Config({
        accessKeyId,
        accessKeySecret,
    });
    // Official endpoint per Aliyun docs
    config.endpoint = 'ocr-api.cn-hangzhou.aliyuncs.com';
    return new ocr_api20210707_1.default(config);
}
router.post('/', async (req, res) => {
    const { imageUrl } = req.body;
    try {
        // 1. Read config
        try {
            await promises_1.default.access(CONFIG_PATH);
        }
        catch {
            return res.status(400).json({ success: false, error: 'OCR 未配置，请前往设置页面配置。' });
        }
        const rawData = await promises_1.default.readFile(CONFIG_PATH, 'utf-8');
        const config = JSON.parse(rawData);
        if (!config.ocrKey || !config.ocrSecret) {
            return res.status(400).json({ success: false, error: 'OCR 密钥缺失，请检查设置。' });
        }
        // 2. Resolve local file path
        const filename = node_path_1.default.basename(imageUrl);
        const localPath = node_path_1.default.join(UPLOADS_DIR, filename);
        try {
            await promises_1.default.access(localPath);
        }
        catch {
            return res.status(404).json({ success: false, error: '图片文件未找到。' });
        }
        // 3. Call Aliyun OCR (new unified API: RecognizeAllText)
        const client = await createClient(config.ocrKey, config.ocrSecret);
        const fileStream = node_fs_1.default.createReadStream(localPath);
        let recognizeAllTextRequest = new $OcrApi20210707.RecognizeAllTextRequest({
            body: fileStream,
            type: 'Advanced', // 通用文字识别高精版
        });
        let runtime = new $Util.RuntimeOptions({});
        const response = await client.recognizeAllTextWithOptions(recognizeAllTextRequest, runtime);
        // 4. Parse response and extract text tokens
        const resultData = response.body?.data;
        console.log('OCR raw response data:', JSON.stringify(resultData, null, 2));
        if (resultData) {
            let allText = '';
            // Try multiple extraction paths since the API response varies by type
            const subImages = resultData.subImages;
            if (subImages && Array.isArray(subImages)) {
                for (const subImage of subImages) {
                    const si = subImage;
                    // Path 1: textInfo.lines[].text
                    if (si.textInfo?.lines && Array.isArray(si.textInfo.lines)) {
                        for (const line of si.textInfo.lines) {
                            if (line.text)
                                allText += line.text + '\n';
                        }
                    }
                    // Path 2: blockInfo.blocks[].text
                    if (si.blockInfo?.blocks && Array.isArray(si.blockInfo.blocks)) {
                        for (const block of si.blockInfo.blocks) {
                            if (block.text)
                                allText += block.text + '\n';
                        }
                    }
                    // Path 3: paragraphInfo.paragraphs[].text  
                    if (si.paragraphInfo?.paragraphs && Array.isArray(si.paragraphInfo.paragraphs)) {
                        for (const para of si.paragraphInfo.paragraphs) {
                            if (para.text)
                                allText += para.text + '\n';
                        }
                    }
                }
            }
            // Fallback: try content field directly
            if (!allText && resultData.content) {
                allText = resultData.content;
            }
            console.log('OCR extracted text:', allText);
            // 5. Semantic split into tokens
            const tokens = allText
                .split(/[\n\s,，.。!！?？:：;；、/|\\()\[\]【】《》""'']+/)
                .map((t) => t.trim())
                .filter((t) => t.length >= 2 && t.length <= 20);
            return res.json({
                success: true,
                data: {
                    tokens: Array.from(new Set(tokens))
                }
            });
        }
        res.json({ success: true, data: { tokens: [] } });
    }
    catch (error) {
        console.error('Aliyun OCR Error:', error);
        // Specific Aliyun error handling
        if (error.code === 'InvalidApi.NotPurchase') {
            return res.status(403).json({
                success: false,
                error: '阿里云 OCR 服务未开通。请前往阿里云控制台开通"通用文字识别"服务。'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message || '识别失败，请检查 OCR 配置或网络'
        });
    }
});
exports.default = router;
