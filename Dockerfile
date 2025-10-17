# syntax=docker/dockerfile:1.7

# 构建阶段：使用 Node 构建静态文件
FROM node:20-alpine AS builder

WORKDIR /app

# 使用 corepack 管理 pnpm
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# 复制 lock 文件并安装依赖
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# 复制源码并构建（保持占位符，无需 env 注入）
COPY . .
RUN pnpm build

# 运行阶段：使用 Nginx 服务静态文件
FROM nginx:alpine

# 复制构建产物到 Nginx html 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 安装 envsubst（用于运行时替换）
RUN apk add --no-cache gettext

# 创建启动脚本：替换 HTML 占位符，然后启动 Nginx
RUN echo '#!/bin/sh\n\
set -e\n\
# 替换 index.html 中的 ${API_URL}\n\
envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp && mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html\n\
# 启动 Nginx\n\
exec nginx -g "daemon off;"' > /start.sh && chmod +x /start.sh

# 暴露 80 端口（Nginx 默认，Dokploy 易映射）
EXPOSE 80

# 使用脚本启动，注入运行时 env
ENV API_URL=https://game-api.micromatrix.org  # 默认值，Dokploy 可覆盖
CMD ["/start.sh"]