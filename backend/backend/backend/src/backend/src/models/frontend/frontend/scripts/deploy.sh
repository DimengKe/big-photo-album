#!/bin/bash

# 100GB超大图片相册部署脚本

set -e

echo "🚀 开始部署100GB超大图片相册..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，请先安装Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 停止现有服务
echo "🛑 停止现有服务..."
docker-compose down 2>/dev/null || true

# 清理旧镜像
echo "🧹 清理资源..."
docker system prune -f

# 构建和启动服务
echo "🔨 构建服务..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ 服务启动成功！"
else
    echo "❌ 服务启动失败，请查看日志：docker-compose logs"
    exit 1
fi

# 显示访问信息
echo ""
echo "🎉 部署完成！"
echo "========================"
echo "🌐 前端访问: http://localhost"
echo "🔧 后端API: http://localhost:5000"
echo "📊 健康检查: http://localhost:5000/health"
echo "📁 上传目录: ./uploads/"
echo ""
echo "📋 常用命令:"
echo "  查看日志: docker-compose logs -f"
echo "  停止服务: docker-compose down"
echo "  重启服务: docker-compose restart"
echo "  备份数据: docker-compose exec mongodb mongodump"
echo "========================"
