#!/bin/bash

# SnackRater 自动化部署脚本 (在阿里云服务器上运行)
# 使用方法: ./deploy.sh

echo "====================================="
echo "🚀 开始部署 SnackRater (零食记) 最新版本"
echo "====================================="

# 1. 拉取最新代码
echo "📦 1. 拉取最新代码..."
git pull origin master

# 2. 部署后端
echo "⚙️ 2. 开始构建后端服务..."
cd server
pnpm install
pnpm run build
pm2 restart snack-server || pm2 start dist/index.js --name "snack-server"
cd ..

# 3. 部署前端 Web
echo "🌐 3. 开始构建前端 Web 静态文件..."
cd client
pnpm install

# (可选) 如果你还没有配置环境变量，可以在这里强制注入公网IP
export EXPO_PUBLIC_BACKEND_BASE_URL=http://8.147.62.207:9091/api/v1

npx expo export --platform web
cd ..

echo "====================================="
echo "✅ 部署完成！"
echo "后端状态可使用 'pm2 status' 查看。"
echo "====================================="
