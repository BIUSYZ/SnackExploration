# 零食记 (SnackRater) - 前后端接口文档

本文档详细描述了“零食记”项目的后端 API 规范，供前端开发及系统集成使用。

## 一、 基本信息

- **Base URL**: `http://localhost:9091/api/v1` (或根据环境变量 `EXPO_PUBLIC_BACKEND_BASE_URL` 配置)
- **数据格式**: 请求与响应均使用 `application/json` (除文件上传外)
- **响应结构**:
  ```json
  {
    "success": true,
    "data": {}, // 业务数据
    "error": "错误信息" // 仅 success 为 false 时存在
  }
  ```

---

## 二、 零食管理接口 (Snacks)

### 2.1 获取零食列表
- **接口地址**: `GET /snacks`
- **查询参数**:
  - `filter` (String, 可选): `red` (红榜) 或 `black` (黑榜)。若不传则返回全部。
- **返回示例**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid-string",
        "title": "麻辣薯片",
        "imageUrl": "/uploads/xxx.jpg",
        "listType": "red",
        "rating": 5,
        "description": "非常脆，够味！",
        "price": 5.5,
        "createdAt": "2024-05-13T10:00:00Z"
      }
    ]
  }
  ```

### 2.2 获取单个零食详情
- **接口地址**: `GET /snacks/:id`
- **返回示例**: 同上，返回单个对象。

### 2.3 新增零食记录
- **接口地址**: `POST /snacks`
- **请求体**:
  ```json
  {
    "title": "名称 (必填)",
    "imageUrl": "图片URL (必填)",
    "listType": "red | black (必填)",
    "rating": 1-5 (必填)",
    "description": "短评 (可选)",
    "price": "价格 (可选, Number)",
    "category": "分类 (可选)"
  }
  ```
- **返回示例**: 成功返回 201 状态码及新增的对象数据。

### 2.4 删除零食记录
- **接口地址**: `DELETE /snacks/:id`
- **返回示例**: `{"success": true}`

---

## 三、 图片上传接口 (Upload)

### 3.1 上传零食照片
- **接口地址**: `POST /upload`
- **请求头**: `Content-Type: multipart/form-data`
- **请求体**: `image` (File 字段)
- **返回示例**:
  ```json
  {
    "success": true,
    "data": {
      "url": "/uploads/generated-uuid.jpg"
    }
  }
  ```

---

## 四、 OCR 文字识别接口 (OCR)

### 4.1 识别图片文字
- **接口地址**: `POST /ocr`
- **说明**: 需先在设置页面配置阿里云密钥。后端会下载本地图片并调用阿里云 `RecognizeAllText` 接口。
- **请求体**:
  ```json
  {
    "imageUrl": "/uploads/xxx.jpg"
  }
  ```
- **返回示例**:
  ```json
  {
    "success": true,
    "data": {
      "tokens": ["乐事", "薯片", "经典原味", "150g"]
    }
  }
  ```
- **特殊错误码**:
  - `400`: OCR 密钥未配置。
  - `403`: 阿里云服务未开通（欠费或未购买）。

---

## 五、 系统配置接口 (Config)

### 5.1 获取系统配置
- **接口地址**: `GET /config`
- **说明**: 敏感信息（如密钥）会被掩码处理（显示为 `****`）。
- **返回示例**:
  ```json
  {
    "success": true,
    "data": {
      "ocrProvider": "Aliyun",
      "ocrKey": "LTAI****4XYZ",
      "ocrSecret": "********",
      "hasKey": true,
      "hasSecret": true
    }
  }
  ```

### 5.2 更新系统配置
- **接口地址**: `POST /config`
- **请求体**:
  ```json
  {
    "ocrKey": "新的 AccessKey",
    "ocrSecret": "新的 AccessSecret"
  }
  ```
- **返回示例**: `{"success": true, "message": "Settings saved successfully"}`

---

## 六、 错误处理规范

接口采用标准 HTTP 状态码：
- `200/201`: 成功
- `400`: 参数错误或业务逻辑拒绝
- `403`: 权限不足或服务未授权
- `404`: 资源不存在
- `500`: 服务器内部错误（通常伴随 `error` 描述）
