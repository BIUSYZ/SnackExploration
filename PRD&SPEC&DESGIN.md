每次开发时，首先阅读该文档，严格遵守该文档规范要求进行开发，
- 若有新提出的补充功能，请对应修改该文档。
- 若有所需修改bug，请在该文档底部进行记录。
- 切勿闭门造车，切勿自行发挥

# 零食记 \- UI/UX 设计规范

## 一、产品概述

### 1\.1 产品信息

|项目|内容|
|---|---|
|产品名称|零食记|
|产品类型|个人零食记录与评价工具|
|核心价值|帮助用户记录、评价、管理零食，建立个人零食红黑榜|
|目标用户|个人用户（零食爱好者）|

### 1\.2 核心功能

|优先级|功能|
|---|---|
|P0|首页列表/瀑布流展示|
|P0|按红黑榜筛选|
|P0|拍照上传\+OCR识别|
|P0|红榜打分\(星星\)|
|P0|黑榜打分\(骷髅\)|
|P1|按分类筛选|
|P1|零食地图展示|
|P1|地点标记与统计|
|P2|填写价格|

---

## 二、设计风格

### 2.1 风格定位

**风格名称**: Warm Minimalism（暖白极简风）

**风格描述**: 轻拟物卡片质感、暖白底色、柔和阴影、低饱和暖色点缀、简洁留白、圆角偏大（14-20px）、轻边框（1px）、舒适阅读排版、弱动效过渡（150-250ms）

**适用场景**: 零食记录与评分属于生活化工具类场景，暖白极简风能够突出零食图片与信息结构，整体更耐看、更适合长期使用，并保持温和的情绪氛围

### 2.2 风格特征

| 特征 | 值                  |
| -- | ------------------ |
| 圆角 | 14-20px            |
| 边框 | 1px 实线             |
| 阴影 | 轻外阴影（柔和漫反射）        |
| 配色 | 暖白 + 低饱和暖色点缀       |
| 动画 | 轻微位移/淡入（150-250ms） |

### 2.3 反模式（避免）

* 禁止使用高饱和荧光色导致视觉疲劳

* 禁止阴影过重或模糊半径过小导致廉价感

* 禁止卡片间距不足导致信息拥挤

* 禁止过度拟物化（厚重渐变、强高光）破坏简洁感

* 禁止字体过细，导致浅色背景下对比度不足

* 禁止在UI中出现任何emoji表情符号

---

## 三、色彩系统

### 3.1 主色调

```css
--color-primary: #D7A86E; /* 暖金棕 - 主按钮、Tab选中态 */
--color-primary-light: #F3E5D2; /* 浅奶茶 - hover 态 */
--color-primary-dark: #B88A52; /* 深焦糖棕 - 按下态 */
```

### 3.2 情感色

```css
/* 红榜色（温暖金调） */
--color-red-list: #e8ae19ff; /* 麦芽金 - 红榜强调 */
--color-red-light: #F6E3A1;

/* 黑榜色（中性灰棕） */
--color-black-list: #9B7EDE; /* 葡萄紫 -黑榜强调*/
--color-black-light: #A3A3A3;
```

### 3.3 评分色

```css
/* 星星评分 - 暖金黄 */
--color-star: #D4A017; /* 麦芽金 - 填充星星 */
--color-star-glow: #F6E3A1; /* 柔亮金高亮 */

/* 骷髅评分 - 深灰（低饱和，偏冷） */
--color-skull: #5C5C5C; /* 石墨灰 - 骷髅描边色 */
--color-skull-dark: #3F3F3F; /* 深灰阴影 */
```

### 3.4 背景色

```css
--color-background: #FBF8F3; /* 奶油米白 - 全局背景 */
--color-surface: #FFFFFF; /* 纯白卡片 - 高对比留白 */
--color-surface-warm: #FFFDF9; /* 暖白辅助背景 - 次级卡片/面板 */
```

### 3.5 文字色

```css
--color-text-primary: #2B2B2B; /* 深灰黑 - 标题 */
--color-text-secondary: #7A7A7A;/* 中性灰 - 正文 */
--color-text-muted: #A6A6A6; /* 浅灰 - 注释 */
```

### 3.6 边框色

```css
--color-border: #EEE6DC; /* 暖米灰 - 分割线/卡片边框 */
```

---

## 四、字体系统

### 4.1 字体选择

| 用途 | 字体    | 字重            |
| -- | ----- | ------------- |
| 标题 | Inter | 500, 600, 700 |
| 正文 | Inter | 400, 500, 600 |

### 4\.2 Google Fonts 引用

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap');
```

### 4\.3 字号规范

|场景|字号|行高|
|---|---|---|
|大标题|28px|1\.3|
|卡片标题|16px|1\.4|
|正文|14px|1\.5|
|辅助文字|12px|1\.4|
|标签|10px|1\.2|

---

## 五、组件规范

### 5\.1 零食卡片组件

#### 结构

```Plain Text
┌─────────────────────┐
│ [图片 65%] │
│ │
├─────────────────────┤
│ 标题 │
│ ⭐⭐⭐⭐☆ │
└─────────────────────┘
[红榜/黑榜徽章]
```

#### Claymorphism 样式

```css
.snack-card {
border-radius: 20px;
border: 3px solid var(--color-border);
background: #FFFFFF;
box-shadow:
inset -3px -3px 8px rgba(74, 68, 60, 0.08),
6px 6px 0px var(--color-border);
transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.snack-card:active {
transform: scale(0.95);
box-shadow:
inset -2px -2px 4px rgba(74, 68, 60, 0.08),
3px 3px 0px var(--color-border);
}
```

#### 接口定义

```typescript
interface SnackCardProps {
id: number;
title: string; // 零食名称
imageUrl: string; // 零食图片URL
rating: number; // 评分 1-5
listType: 'red' | 'black'; // 红榜/黑榜
category?: string; // 分类（可选）
location?: string; // 购买地点（可选）
price?: number; // 价格（可选）
}
```

### 5\.2 红榜评分组件 \- 星星

**交互规范**: 动态滑动打分，初始为五个空白星星，支持手势滑动最多拉满五个星星。评分标签仅显示"评分"二字，不附带任何括号说明文字。

```css
.star-rating {
display: flex;
gap: 4px;
touch-action: pan-y;
}

.star {
color: var(--color-star); /* #FFD93D 暖黄 */
font-size: 18px;
filter: drop-shadow(0 2px 4px rgba(255, 217, 61, 0.4));
cursor: pointer;
transition: transform 150ms ease, color 150ms ease;
}

.star:hover {
transform: scale(1.15);
}

.star.filled {
color: var(--color-star);
}

.star.empty {
color: #E5E0D5;
}
```

```typescript
interface StarRatingProps {
value: number; // 当前评分 1-5
onChange: (value: number) => void;
maxStars?: number; // 最大星数，默认5
isSlidable?: boolean; // 是否开启手势动态滑动打分，默认true
size?: 'small' | 'medium' | 'large';
disabled?: boolean;
}
```

### 5\.3 黑榜评分组件 \- 骷髅

**交互规范**: 动态滑动打分，初始为五个空白骷髅头，支持手势滑动最多拉满五个骷髅头。评分标签仅显示"评分"二字。

```css
.skull-rating {
display: flex;
gap: 4px;
touch-action: pan-y;
}

.skull {
color: var(--color-skull); /* #9B7EDE 葡萄紫 */
font-size: 18px;
filter: drop-shadow(0 2px 4px rgba(155, 126, 222, 0.3));
cursor: pointer;
transition: transform 150ms ease, color 150ms ease;
/* 骷髅图标始终使用描边模式（fill: none），不做纯色填充 */
}

.skull:hover {
transform: scale(1.15);
}

.skull.active {
color: var(--color-skull); /* 选中态：葡萄紫描边 */
}

.skull.empty {
color: #E5E0D5; /* 未选中态：浅灰描边 */
}
```

```typescript
interface SkullRatingProps {
value: number; // 当前评分 1-5
onChange: (value: number) => void;
maxSkulls?: number; // 最大骷髅数，默认5
isSlidable?: boolean; // 是否开启手势动态滑动打分，默认true
disabled?: boolean;
}
```

### 5\.4 底部导航栏

#### 结构

```Plain Text
┌─────────────────────────────────────────┐
│  首页   [加]   地图 │
│ （2端对齐，中间圆角矩形按钮） │
└─────────────────────────────────────────┘
```

#### 样式

```css
.tab-bar {
display: flex;
justify-content: space-around;
align-items: center;
padding: 6px 20px 16px;
background: #FFFFFF;
border-top: 2px solid var(--color-border);
}

.tab-item {
display: flex;
flex-direction: column;
align-items: center;
padding: 4px;
cursor: pointer;
}

.tab-item.active {
color: var(--color-primary);
}

.tab-icon {
font-size: 20px;
}

.tab-label {
font-family: 'Nunito';
font-size: 10px;
color: var(--color-text-muted);
margin-top: 2px;
}

/* 中间添加按钮 - 圆角矩形，适配导航栏高度 */
.add-button {
padding: 6px 20px;
border-radius: 12px;
background: var(--color-primary);
border: 2px solid var(--color-border);
box-shadow: 2px 2px 0 var(--color-border);
display: flex;
justify-content: center;
align-items: center;
cursor: pointer;
transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.add-button:active {
transform: scale(0.95);
box-shadow: 1px 1px 0 var(--color-border);
}

.add-button-icon {
font-size: 20px;
color: #FFFFFF;
font-weight: 700;
}
```

### 5\.5 筛选 Tab

```css
.filter-bar {
display: flex;
justify-content: center;
gap: 12px;
padding: 16px;
}

.filter-btn {
padding: 10px 20px;
border-radius: 20px;
border: 2px solid var(--color-border);
background: #FFFFFF;
font-family: 'Nunito';
font-weight: 600;
color: var(--color-text-secondary);
cursor: pointer;
transition: all 200ms ease;
}

.filter-btn.active {
background: var(--color-primary);
color: #FFFFFF;
}
```

---

## 六、页面结构

```Plain Text
App
├── 首页 (HomeScreen)
│ ├── 顶部Tab筛选: [红榜] [黑榜]（无“全部”选项，无应用标题，筛选栏置顶）
│ ├── 右上角: 齿轮图标进入设置页 (SettingsScreen)
│ ├── 零食网格列表（响应式 2-4 列）
│ └── 底部: 导航栏 + 中间圆角矩形添加按钮（紧凑布局）
│
├── 设置页 (SettingsScreen)
│ ├── 顶部Tab: [配置] [个人信息]
│ ├── 配置 Tab:
│ │ ├── OCR服务配置（提供商选择 + API Key输入）
│ │ ├── 地图服务配置（预留入口，暂未开发）
│ │ └── AI大模型服务配置（预留接入接口，暂未开发）
│ └── 个人信息 Tab: 暂时留空，后续开发
│
├── 地图页 (MapScreen)
│ ├── 全屏地图
│ ├── 地点标记（带红黑数量气泡）
│ └── 点击标记 → 弹出详情BottomSheet
│
├── 添加零食页 (AddSnackScreen)
│ ├── 图片上传区（拍照/相册）
│ ├── OCR识别结果展示区：以气泡（Chip）形式展示按语义切分后的字词
│ │ └── 交互：点击气泡可多选，选中的内容按顺序填充/拼接到“名称”输入框
│ ├── 标题输入框
│ ├── 红黑榜选择
│ ├── 评分区
│ ├── 描述输入框（选填，多行文本）
│ ├── 地点选择器
│ └── 价格输入框（选填，输入框内置不可删除的浅色 ¥ 前缀）
│
└── 零食详情页 (SnackDetailScreen)
├── 大图展示
├── 基本信息
├── 评分展示
├── 描述文字
├── 地点/价格信息
└── 编辑/删除操作
```

---

## 七、响应式布局规范

### 7\.1 断点定义

|设备|宽度|列数|卡片宽度参考|
|---|---|---|---|
|手机|\&lt; 768px|2 列|\~170px|
|平板|768\-1023px|3 列|\~110px|
|桌面|≥ 1024px|4 列|\~200px|

### 7\.2 弹性卡片计算公式

```typescript
const CARD_MARGIN = 12;
const getCardWidth = () => {
const cols = getColumns(); // 2/3/4
const totalMargin = CARD_MARGIN * (cols + 1);
return (screenWidth - totalMargin) / cols;
};
const CARD_RATIO = 1.2; // 卡片高宽比
const cardHeight = cardWidth * CARD_RATIO;
```

### 7\.3 响应式实现要点

- 使用 `Dimensions\.get\(\&\#39;window\&\#39;\)\.width` 动态计算

- 卡片保持统一高宽比 \(1\.2\)

- 使用 Flexbox 或 Grid 布局

- 间距使用 `gap` 属性统一控制

---

## 八、交互规范

### 8\.1 点击效果

```css
/* 按下时 */
transform: scale(0.95);
box-shadow:
inset -2px -2px 4px rgba(74, 68, 60, 0.08),
3px 3px 0px var(--color-border);
```

### 8\.2 弹回动画

```css
/* 弹性曲线 */
transition: all 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 8\.3 悬停反馈

- 轻微放大: `transform: scale\(1\.05\)`

- 颜色变化: 背景切换为 `var\(\-\-color\-primary\-light\)`

- 过渡时间: 150\-300ms

### 8\.4 无障碍

- `prefers\-reduced\-motion`: 禁用动画

- 颜色对比度 ≥ 4\.5:1

- 所有可点击元素添加 `cursor\-pointer`

---

## 九、功能详细设计

### 9\.1 首页展示功能

#### 9\.1\.1 筛选逻辑

```typescript
// 筛选类型
type FilterType = 'red' | 'black' | 'category';

// 分类列表（预设，配置页可手动添加）
const CATEGORIES = [
'膨化食品',
'巧克力',
'饼干',
'糖果',
'坚果',
'果干',
'饮品',
'其他'
];
```

#### 9\.1\.2 数据获取接口

```typescript
// 服务端文件: server/src/routes/snacks.ts
// 接口: GET /api/v1/snacks
// Query参数: filter?: FilterType, category?: string
interface SnackListResponse {
success: boolean;
data: SnackCardProps[];
total: number;
}
```

#### 9\.1\.3 瀑布流布局实现

- 使用 `@shopify/flash\-list` 实现高性能列表

- 图片宽高比随机生成（0\.7\~1\.4），确保交错排列效果

- 下拉刷新 \+ 上拉加载更多

### 9\.2 地图功能

#### 9\.2\.1 地图数据结构

```typescript
interface LocationData {
id: string;
name: string; // 地点名称
latitude: number;
longitude: number;
address?: string; // 详细地址
redCount: number; // 红榜零食数量
blackCount: number; // 黑榜零食数量
}
```

#### 9\.2\.2 地图交互流程

```Plain Text
用户点击地图标记
↓
显示BottomSheet弹窗
↓
展示地点统计（红X个 黑X个）
↓
用户点击"查看详情"
↓
展示该地点零食列表
↓
点击零食 → 跳转详情页
```

#### 9\.2\.3 地图接口

```typescript
// 服务端文件: server/src/routes/locations.ts
// 接口: GET /api/v1/locations
interface LocationListResponse {
success: boolean;
data: LocationData[];
}

// 接口: GET /api/v1/locations/:id/snacks
interface LocationSnacksResponse {
success: boolean;
data: SnackCardProps[];
}
```

### 9\.3 零食打分功能

#### 9\.3\.1 添加零食流程

```Plain Text
1. 拍照/选择图片
↓
2. 上传图片到对象存储
↓
3. 调用OCR识别（可选失败重试）
↓
4. 显示识别结果供用户选择
↓
5. 用户输入/修改标题
↓
6. 选择红榜/黑榜
↓
7. 进行评分（星星/骷髅）
↓
8. 可选填写描述、选择地点、价格
↓
9. 提交保存
```

#### 9\.3\.2 OCR识别接口

```typescript
// 服务端文件: server/src/routes/ocr.ts
// 接口: POST /api/v1/ocr/recognize
// Body: FormData { image: File }
// 响应
interface OcrResponse {
success: boolean;
data: {
texts: string[]; // 识别出的文字列表
confidence: number; // 置信度
};
}
```

#### 9\.3\.3 提交零食接口

```typescript
// 服务端文件: server/src/routes/snacks.ts
// 接口: POST /api/v1/snacks
// Body:
interface CreateSnackRequest {
title: string; // 零食名称（必填）
imageUrl: string; // 图片URL（必填）
listType: 'red' | 'black'; // 红榜/黑榜（必填）
rating: number; // 评分（必填）
description?: string; // 描述
locationId?: string; // 地点ID
price?: number; // 价格
category?: string; // 分类
}
```

### 9\.4 地点管理功能

#### 9\.4\.1 添加地点流程

```typescript
// 在添加零食页面，选择"新建地点"
interface CreateLocationRequest {
name: string; // 地点名称（必填）
latitude: number; // 纬度（必填）
longitude: number; // 经度（必填）
address?: string; // 详细地址
}
```

#### 9\.4\.2 地点接口

```typescript
// 服务端文件: server/src/routes/locations.ts
// 接口: POST /api/v1/locations
// 接口: GET /api/v1/locations
// 接口: GET /api/v1/locations/:id
```

---

## 十、技术选型方案

### 10\.1 前端技术栈

|技术|版本|用途|选择理由|
|---|---|---|---|
|**Expo SDK**|54|移动开发框架|官方稳定版本，支持Expo Go快速调试|
|**React Native**|0\.76\+|UI框架|Expo内置，无需单独安装|
|**Expo Router**|4\+|路由管理|文件路由，开发体验好|
|**TailwindCSS \(Uniwind\)**|\-|样式方案|项目内置，支持dark mode|
|**@shopify/flash\-list**|1\.6\+|高性能列表|比FlatList性能更好|
|**react\-native\-reanimated**|3\+|动画库|项目内置，流畅动画|

### 10\.2 地图组件选型

#### 方案对比

|方案|优点|缺点|推荐度|
|---|---|---|---|
|**react\-native\-maps**|Google Maps，免费，支持多平台|国内需要VPN，UI可能不符合习惯|⭐⭐⭐|
|**高德地图SDK**|国内覆盖好，功能完善|需要申请Key，有配额限制|⭐⭐⭐⭐|
|**百度地图SDK**|国内覆盖好|需要申请Key，体积较大|⭐⭐⭐|

#### 推荐方案：高德地图

**安装命令**：

```bash
cd client && npx expo install react-native-amap
```

**配置步骤**：

1\. 注册高德开放平台账号

2\. 创建应用，获取 Key

3\. 在 `app\.config\.ts` 配置：

```typescript
// app.config.ts
export default {
plugins: [
[
'react-native-amap',
{
apiKey: {
ios: 'YOUR_IOS_KEY',
android: 'YOUR_ANDROID_KEY',
},
},
],
],
};
```

### 10\.3 OCR 组件选型

|方案|优点|缺点|推荐度|
|---|---|---|---|
|**阿里云OCR**|识别准确，免费额度高|需要申请，调用需签名|⭐⭐⭐⭐|
|**百度OCR**|功能丰富|免费额度较少|⭐⭐⭐|
|**腾讯OCR**|集成方便|文档相对较少|⭐⭐⭐|

#### 推荐方案：阿里云OCR

**服务端实现**：

```typescript
// server/src/services/ocr.ts
import axios from 'axios';
const ALIYUN_API_KEY = process.env.ALIYUN_OCR_KEY;
const ALIYUN_ENDPOINT = 'https://ocrapi-market.cn-shanghai.aliyuncs.com';

export async function recognizeText(imageBuffer: Buffer): Promise<string[]> {
const response = await axios.post(
`${ALIYUN_ENDPOINT}/api/ocr/recognize`,
imageBuffer,
{
headers: {
'Authorization': `APPCODE ${ALIYUN_API_KEY}`,
'Content-Type': 'application/octet-stream',
},
params: { Scenarios: 'qrcode' },
}
);
return response.data.Regions.map((r: any) => r.Text);
}
```

### 10\.4 后端技术栈

|技术|版本|用途|选择理由|
|---|---|---|---|
|**Express\.js**|4\.x|Web框架|项目内置，稳定可靠|
|**TypeScript**|5\.x|类型系统|项目内置，类型安全|
|**multer**|1\.x|文件上传|处理图片上传|
|**zod**|3\.x|数据校验|API参数校验|
|**PostgreSQL**|\-|数据库|关系型数据存储|

### 10\.5 数据存储选型

#### 对象存储（图片）

推荐方案：系统内置对象存储

**服务端上传接口**：

```typescript
// server/src/routes/upload.ts
import multer from 'multer';
const upload = multer({
storage: multer.memoryStorage(),
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB限制
});

// POST /api/v1/upload
router.post('/', upload.single('image'), async (req, res) => {
const file = req.file;
const imageUrl = await ossUpload(file.buffer, file.originalname);
res.json({ success: true, data: { url: imageUrl } });
});

// OCR 识别接口优化
router.post('/recognize', async (req, res) => {
  try {
    // ... logic
  } catch (error: any) {
    console.error('Aliyun OCR Error:', error);
    
    // Check for specific Aliyun errors
    if (error.code === 'InvalidApi.NotPurchase') {
      return res.status(403).json({ 
        success: false, 
        error: '阿里云 OCR 服务未开通。请前往阿里云控制台开通“通用文字识别”服务。' 
      });
    }

    res.status(500).json({ 
      success: false, 
      error: error.message || '识别失败，请检查 OCR 配置或网络' 
    });
  }
});
```

---

## 十一、数据模型设计

### 11\.1 数据库表结构

```sql
-- 零食表
CREATE TABLE snacks (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title VARCHAR(255) NOT NULL,
image_url TEXT NOT NULL,
list_type VARCHAR(10) NOT NULL CHECK (list_type IN ('red', 'black')),
rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
description TEXT,
category VARCHAR(50),
price DECIMAL(10, 2),
location_id UUID REFERENCES locations(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 地点表
CREATE TABLE locations (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255) NOT NULL,
latitude DECIMAL(10, 8) NOT NULL,
longitude DECIMAL(11, 8) NOT NULL,
address TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_snacks_list_type ON snacks(list_type);
CREATE INDEX idx_snacks_category ON snacks(category);
CREATE INDEX idx_snacks_location ON snacks(location_id);
```

### 11\.2 API 响应格式

```typescript
// 统一响应格式
interface ApiResponse<T> {
success: boolean;
data?: T;
error?: {
code: string;
message: string;
};
}

// 错误码定义
const ErrorCodes = {
VALIDATION_ERROR: 'VALIDATION_ERROR',
NOT_FOUND: 'NOT_FOUND',
INTERNAL_ERROR: 'INTERNAL_ERROR',
OCR_FAILED: 'OCR_FAILED',
UPLOAD_FAILED: 'UPLOAD_FAILED',
};
```

---

## 十二、路由规划

### 12\.1 前端路由

```Plain Text
client/app/
├── _layout.tsx # 根布局（Stack）
├── index.tsx # 首页（零食列表）
├── map.tsx # 地图页
├── add.tsx # 添加零食页
├── snack/
│ └── [id].tsx # 零食详情页
└── +not-found.tsx # 404页面
```

### 12\.2 后端路由

```Plain Text
server/src/
├── routes/
│ ├── snacks.ts # 零食CRUD
│ │ ├── GET /api/v1/snacks # 列表
│ │ ├── POST /api/v1/snacks # 创建
│ │ ├── GET /api/v1/snacks/:id # 详情
│ │ ├── PUT /api/v1/snacks/:id # 更新
│ │ └── DELETE /api/v1/snacks/:id # 删除
│ │
│ ├── locations.ts # 地点管理
│ │ ├── GET /api/v1/locations # 列表
│ │ ├── POST /api/v1/locations # 创建
│ │ └── GET /api/v1/locations/:id/snacks # 地点零食
│ │
│ ├── upload.ts # 文件上传
│ │ └── POST /api/v1/upload # 上传图片
│ │
│ └── ocr.ts # OCR识别
│ └── POST /api/v1/ocr/recognize # 文字识别
│
└── index.ts # 入口文件
```

---

## 十三、实现优先级

### Phase 1: 核心功能 \(MVP\)

1. 首页零食列表展示

2. 添加零食（含图片上传）

3. 零食详情页

4. 基本CRUD操作

### Phase 2: 增强功能

1. 红黑榜筛选

2. OCR识别集成

3. 星星/骷髅评分组件

4. 地点选择器

### Phase 3: 地图功能

1. 地图页面

2. 地点标记

3. 地点统计

4. 地点详情列表

### Phase 4: 优化完善

1. 分类筛选

2. 价格记录

3. 描述功能

4. UI细节优化

---

## 十四、环境变量配置

```typescript
// client/.env
EXPO_PUBLIC_BACKEND_BASE_URL=http://localhost:9091

// server/.env
DATABASE_URL=postgresql://user:password@localhost:5432/snack_app
OSS_ACCESS_KEY=xxx
OSS_SECRET_KEY=xxx
OSS_BUCKET=snack-images
OSS_REGION=cn-hangzhou
ALIYUN_OCR_KEY=xxx
```

---

## 十五、验收标准

### 15\.1 功能验收

|功能模块|验收项|验收标准|
|---|---|---|
|首页列表功能|瀑布流展示|手机端2列、平板3列、桌面4列自适应布局，卡片错落展示，无布局错乱、重叠问题|
|榜单筛选|支持全部/红榜/黑榜精准筛选，筛选后列表实时刷新，无数据残留、漏显问题||
|分类筛选（P1）|可按预设零食分类筛选，筛选逻辑准确，支持多分类切换||
|零食新增功能|图片上传|支持相册选择、拍照上传图片，支持10MB以内图片，上传成功后正常回显，失败有明确提示|
|OCR文字识别|上传零食图片后可自动识别文字，识别结果可选择填充至标题，识别失败支持重试||
|榜单与评分提交|可自由选择红榜/黑榜，红榜1\-5星评分（暖黄填充）、黑榜1\-5骷髅评分（葡萄紫描边）可正常选中展示，提交后数据正常保存||
|拓展信息填写|支持填写零食描述、价格、选择/新建购买地点，选填内容可正常保存、回显||
|零食管理功能|详情查看|点击零食卡片可跳转详情页，完整展示图片、评分、分类、地点、价格等全部信息|
|编辑删除|支持修改零食所有信息、删除零食数据，操作后列表实时同步更新||
|地图功能（P3）|地图渲染|地图页面正常加载，无空白、加载报错，适配移动端屏幕|
|地点标记与统计|所有已记录购买地点在地图精准标记，气泡正常展示红黑榜零食数量统计数据||
|地图交互|点击标记弹出底部弹窗，可查看对应地点零食列表，支持跳转零食详情||
|基础交互功能|导航切换|底部导航首页、地图、新增按钮切换正常，选中态样式展示准确，中间凸起按钮交互正常|
|列表刷新加载|首页支持下拉刷新、上拉加载更多，加载状态有对应交互反馈，无卡顿、重复加载问题||

### 15\.2 UI 视觉验收

- **风格统一**：全页面遵循黏土风设计规范，圆角、边框、双阴影、粉彩配色统一，无风格冲突元素，未使用emoji图标、无违规反模式设计

- **字体规范**：标题Fredoka、正文Nunito字体正常加载，各场景字号、行高严格匹配规范，字重使用准确，文字层级清晰

- **色彩合规**：主色调、情感色、评分色、文字边框色统一复用规范变量，文字对比度≥4\.5:1，满足无障碍要求

- **交互视觉**：所有可点击元素hover、按下、激活态样式正常，卡片点击缩放、弹性动画流畅，动画时长符合150\-300ms规范

- **响应式适配**：手机、平板、桌面端布局自适应，卡片尺寸、列数、间距适配准确，无内容溢出、留白异常问题

### 15\.3 性能验收

- **页面加载**：首页、详情页、地图页首次加载时长≤1s，无白屏、长时间加载卡顿现象

- **列表性能**：瀑布流列表滚动流畅，千条数据无卡顿、掉帧，依托高性能列表组件实现顺滑滚动效果

- **动画性能**：所有交互动画、弹性过渡动画流畅，无掉帧、拖拽卡顿问题，支持无障碍动画禁用配置

- **接口响应**：常规接口请求响应时长≤500ms，图片上传、OCR识别复杂接口响应时长≤2s，超时时有友好提示

### 15\.4 兼容性验收

- **设备兼容**：适配主流移动端手机、平板设备，不同屏幕尺寸、分辨率布局正常展示

- **系统兼容**：适配iOS、Android主流系统版本，功能、UI、交互无适配bug

- **模式兼容**：支持浅色模式正常展示，样式渲染无误，可适配系统深色模式配置

### 15\.5 异常场景验收

- **网络异常**：断网、弱网环境下，接口请求失败、图片加载失败有明确文字提示，支持重试操作

- **数据异常**：空列表、无地点、无评分等空状态有友好占位展示，无空白报错页面

- **操作异常**：上传超大文件、非法图片、重复提交数据等违规操作，有拦截提示，系统无崩溃

- **OCR异常**：图片模糊、无有效文字导致识别失败时，提示清晰，可手动输入文字兜底


---

## 附录：变更记录

| 日期 | 变更内容 | 处理方式 |
|------|----------|----------|
| 2026-05-09 | Web端图片上传400报错（FormData在Web平台不兼容RN的{uri,name,type}格式） | 前端uploadImage函数增加Web平台判断，使用fetch+Blob方式构造FormData |
| 2026-05-09 | 星星评分色应为黄色，骷髅评分色应为紫色 | 更新PRD 3.3评分色：star改为#FFD93D暖黄，skull改为#9B7EDE葡萄紫 |
| 2026-05-09 | 骷髅图标不应纯色填充，需保留矢量描边细节 | 更新PRD 5.3组件规范，skull始终使用fill:none描边模式 |
| 2026-05-09 | 评分标签旁不需要"(滑动选择星星)"等括号说明 | 更新PRD 5.2/5.3，评分标签仅显示"评分"二字 |
| 2026-05-09 | 价格输入框前不需要单独的¥符号 | 更新PRD页面结构，价格输入框内置不可删除的浅色¥前缀 |
| 2026-05-09 | 去除首页“零食记”标题，筛选栏置顶 | 更新PRD页面结构，首页不再显示应用标题，筛选Tab置顶 |
| 2026-05-09 | 去除“全部”分类，仅保留红榜/黑榜切换 | 更新首页筛选逻辑，默认红榜，无“全部”选项 |
| 2026-05-09 | 头尾栏高度过大，UI元素比例过大 | 压缩header/footer padding、筛选按钮、输入框等UI元素尺寸，符合简约布局 |
| 2026-05-09 | 底部添加按钮改为圆角矩形，适配导航栏高度 | 更新PRD 5.4组件规范，圆形改为圆角矩形，去掉凸起效果 |
| 2026-05-09 | 首页右上角增加设置入口，新增设置页面 | 新增 SettingsScreen 页面，含配置/个人信息 Tab，配置页提供 OCR/地图/AI服务接入入口 |
| 2026-05-09 | 实现OCR实际识别与名称气泡填充功能 | 更新 AddSnackScreen 逻辑，识别后展示语义气泡，支持多选填充至名称栏 |
| 2026-05-09 | 增强 OCR 报错引导，处理服务未开通异常 | 后端增加错误码校验，当由于阿里云服务未开通导致识别失败时，提供明确的开通引导 |
| 2026-05-12 | 服务端启动失败：OCR SDK 接口名称错误 | 将不存在的 RecognizeCommonCharacter 改回 SDK 实际支持的 RecognizeCharacter，修复 TS 编译错误 |
| 2026-05-12 | OCR 403 报错：使用了错误的 SDK 版本和 Endpoint | 根据阿里云官方文档，将 SDK 从旧版 ocr20191230 迁移至新版 ocr-api20210707，使用 RecognizeAllText 统一识别接口，Endpoint 修正为 ocr-api.cn-hangzhou.aliyuncs.com |
---

## 六、Bug 修复记录

| 日期 | 问题描述 | 修复方案 |
| --- | --- | --- |
| 2026-05-13 | 添加零食页面切换黑榜时报错 `setFilter is not defined` | 修正 `app/add.tsx` 中的变量名，由 `setFilter` 改为 `setListType`，并移除冗余事件。 |

> （注：文档内容包含 AI 生成与人工修正部分）
