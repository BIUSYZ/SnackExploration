import { Router } from 'express';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import OcrApi20210707, * as $OcrApi20210707 from '@alicloud/ocr-api20210707';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

const router = Router();
const CONFIG_PATH = path.join(__dirname, '../../data/config.json');
const UPLOADS_DIR = path.join(__dirname, '../../data/uploads');

// Initialize Aliyun Client (new 2021-07-07 version)
async function createClient(accessKeyId: string, accessKeySecret: string) {
  let config = new $OpenApi.Config({
    accessKeyId,
    accessKeySecret,
  });
  // Official endpoint per Aliyun docs
  config.endpoint = 'ocr-api.cn-hangzhou.aliyuncs.com';
  return new OcrApi20210707(config);
}

router.post('/', async (req, res) => {
  const { imageUrl } = req.body;

  try {
    // 1. Read config
    try {
      await fsp.access(CONFIG_PATH);
    } catch {
      return res.status(400).json({ success: false, error: 'OCR 未配置，请前往设置页面配置。' });
    }

    const rawData = await fsp.readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(rawData);

    if (!config.ocrKey || !config.ocrSecret) {
      return res.status(400).json({ success: false, error: 'OCR 密钥缺失，请检查设置。' });
    }

    // 2. Resolve local file path
    const filename = path.basename(imageUrl);
    const localPath = path.join(UPLOADS_DIR, filename);

    try {
      await fsp.access(localPath);
    } catch {
      return res.status(404).json({ success: false, error: '图片文件未找到。' });
    }

    // 3. Call Aliyun OCR (new unified API: RecognizeAllText)
    const client = await createClient(config.ocrKey, config.ocrSecret);
    const fileStream = fs.createReadStream(localPath);

    let recognizeAllTextRequest = new $OcrApi20210707.RecognizeAllTextRequest({
      body: fileStream,
      type: 'Advanced',  // 通用文字识别高精版
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
          const si = subImage as any;
          
          // Path 1: textInfo.lines[].text
          if (si.textInfo?.lines && Array.isArray(si.textInfo.lines)) {
            for (const line of si.textInfo.lines) {
              if (line.text) allText += line.text + '\n';
            }
          }
          
          // Path 2: blockInfo.blocks[].text
          if (si.blockInfo?.blocks && Array.isArray(si.blockInfo.blocks)) {
            for (const block of si.blockInfo.blocks) {
              if (block.text) allText += block.text + '\n';
            }
          }
          
          // Path 3: paragraphInfo.paragraphs[].text  
          if (si.paragraphInfo?.paragraphs && Array.isArray(si.paragraphInfo.paragraphs)) {
            for (const para of si.paragraphInfo.paragraphs) {
              if (para.text) allText += para.text + '\n';
            }
          }
        }
      }

      // Fallback: try content field directly
      if (!allText && (resultData as any).content) {
        allText = (resultData as any).content;
      }

      console.log('OCR extracted text:', allText);

      // 5. Semantic split into tokens
      const tokens = allText
        .split(/[\n\s,，.。!！?？:：;；、/|\\()\[\]【】《》""'']+/)
        .map((t: string) => t.trim())
        .filter((t: string) => t.length >= 2 && t.length <= 20);

      return res.json({
        success: true,
        data: {
          tokens: Array.from(new Set(tokens))
        }
      });
    }

    res.json({ success: true, data: { tokens: [] } });
  } catch (error: any) {
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

export default router;
