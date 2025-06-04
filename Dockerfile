FROM node:20.17.0-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/webapp/package*.json ./packages/webapp/
COPY packages/adminui/package*.json ./packages/adminui/
COPY packages/server/package*.json ./packages/server/

RUN npm ci --workspaces --include-workspace-root

COPY typescript ./typescript

COPY packages/shared ./packages/shared
RUN npm run build --workspace @way-to-bot/shared

COPY packages/adminui ./packages/adminui
RUN npm run build --workspace @way-to-bot/adminui

COPY packages/server ./packages/server
RUN npm run build --workspace @way-to-bot/server

COPY packages/webapp ./packages/webapp
RUN npm run build --workspace @way-to-bot/webapp

COPY . .

FROM node:20.17.0-slim AS server

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

COPY --from=builder /app/packages/server/package.json ./packages/server/package.json
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/server/.env ./packages/server/.env
COPY --from=builder /app/packages/server/bin ./packages/server/bin

RUN npm ci --production

FROM nginx:alpine AS web
COPY --from=builder /app/packages/webapp/dist /usr/share/nginx/html/webapp
COPY --from=builder /app/packages/adminui/dist /usr/share/nginx/html/admin
CMD ["nginx", "-g", "daemon off;"]
