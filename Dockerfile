ARG NODE_IMAGE=node:20-alpine
ARG NGINX_IMAGE=nginx:1.25-alpine

FROM ${NODE_IMAGE} AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM ${NGINX_IMAGE}

ENV TZ=Asia/Shanghai

COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html/api_platform
