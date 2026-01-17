FROM node:18-alpine

# 安装系统依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev \
    curl

WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 创建必要的目录
RUN mkdir -p uploads/chunks uploads/photos uploads/thumbnails uploads/temp

# 设置权限
RUN chown -R node:node /app
USER node

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# 暴露端口
EXPOSE 5000

# 启动命令
CMD ["node", "src/server.js"]
