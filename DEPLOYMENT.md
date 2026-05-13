# 零食记 (SnackRater) - 阿里云部署指南

本文档指导如何将“零食记”应用（包含 Node.js 后端与 Expo Web 前端）部署到阿里云 ECS 服务器上，以便您可以通过手机浏览器随时访问。

---

## 一、 服务器环境准备

请确保您的阿里云 ECS 服务器（推荐操作系统：Ubuntu 22.04 或 CentOS 7/8）已安装以下基础环境：

### 1. 安装 Node.js 与 npm
建议安装 Node.js v18 或更高版本：
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs   # Ubuntu 系统
# 或 yum install -y nodejs       # CentOS 系统
```

### 2. 安装全局工具 (pnpm 和 pm2)
```bash
npm install -g pnpm pm2
```

### 3. 安装 Nginx
用于托管前端静态文件并提供反向代理：
```bash
sudo apt-get install -y nginx    # Ubuntu 系统
# 或 sudo yum install -y nginx   # CentOS 系统
```

---

## 二、 后端服务部署 (Server)

后端是一个基于 Express 的 Node.js 服务，运行在 `9091` 端口。

1. **拉取代码**：将代码克隆或上传到服务器指定目录（例如 `/var/www/SnackExploration`）。
2. **进入后端目录**：
   ```bash
   cd /var/www/SnackExploration/server
   ```
3. **安装依赖**：
   ```bash
   pnpm install
   ```
4. **编译 TypeScript**：
   ```bash
   pnpm run build
   ```
   *编译成功后，会生成 `dist` 目录。*
5. **使用 PM2 启动后台服务**：
   ```bash
   pm2 start dist/index.js --name "snack-server"
   ```
6. **设置 PM2 开机自启**：
   ```bash
   pm2 startup
   pm2 save
   ```

> **验证**：执行 `curl http://localhost:9091/api/v1/snacks`，若返回 JSON 数据说明后端启动成功。

---

## 三、 前端 Web 部署 (Client)

前端使用 Expo 构建 Web 静态页面。

1. **进入前端目录**：
   ```bash
   cd /var/www/SnackExploration/client
   ```
2. **安装依赖**：
   ```bash
   pnpm install
   ```
3. **配置环境变量**：
   在打包前端之前，需要告诉前端后端的真实地址。如果您的服务器公网 IP 是 `123.45.67.89`，请在 `client` 目录下创建一个 `.env.production` 文件（或直接导出环境变量）：
   ```bash
   export EXPO_PUBLIC_BACKEND_BASE_URL=http://123.45.67.89:9091/api/v1
   ```
4. **执行 Web 打包**：
   ```bash
   npx expo export --platform web
   ```
   *打包完成后，会在 `client/dist` 目录下生成静态文件。*

---

## 四、 配置 Nginx 访问

我们需要配置 Nginx 将服务器的 `80` 端口请求指向前端打包好的 `dist` 目录。

1. **编辑 Nginx 配置文件**：
   ```bash
   sudo nano /etc/nginx/sites-available/snack
   # 或者在 CentOS 上：sudo nano /etc/nginx/conf.d/snack.conf
   ```
2. **写入以下配置** (请将 `server_name` 换成你的公网 IP 或域名)：
   ```nginx
   server {
       listen 80;
       server_name 123.45.67.89; # 替换为你的阿里云公网 IP 或域名

       # 托管前端静态文件
       location / {
           root /var/www/SnackExploration/client/dist;
           index index.html;
           try_files $uri $uri/ /index.html; # 支持单页应用前端路由
       }

       # 后端 API 反向代理 (可选：如果您不想让前端直接访问 9091 端口，可在此处代理)
       # 如果上面 EXPO_PUBLIC_BACKEND_BASE_URL 配置的是 http://IP:9091，则不需要这段。
       # 如果配置为 /api/v1，则需要解除以下注释：
       # location /api/ {
       #     proxy_pass http://127.0.0.1:9091;
       #     proxy_set_header Host $host;
       #     proxy_set_header X-Real-IP $remote_addr;
       # }
   }
   ```
3. **启用配置并重启 Nginx**：
   ```bash
   sudo ln -s /etc/nginx/sites-available/snack /etc/nginx/sites-enabled/
   sudo nginx -t     # 测试配置是否有语法错误
   sudo systemctl restart nginx
   ```

---

## 五、 阿里云安全组与网络配置

要在手机浏览器中访问，**必须**在阿里云控制台开放相应端口：

1. 登录 [阿里云 ECS 控制台](https://ecs.console.aliyun.com/)。
2. 找到您的实例，点击 **安全组** -> **配置规则**。
3. **入方向** 添加以下规则：
   - 协议类型：**HTTP (80)**，授权对象：`0.0.0.0/0` (用于访问前端页面)。
   - 协议类型：**自定义 TCP**，目的：`9091`，授权对象：`0.0.0.0/0` (用于前端直连调用后端 API；若使用 Nginx 代理了 API，则可不开放)。

---

## 六、 访问体验

部署完成后，打开手机浏览器，输入您的服务器公网 IP：
`http://123.45.67.89`

即可随时随地记录和查看您的零食红黑榜！后续如果有数据或图片更新，会保存在服务器后端的 `server/data/` 目录中。
