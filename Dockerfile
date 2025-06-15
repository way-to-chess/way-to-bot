FROM node:20.17.0-slim AS base

ARG ENV=dev
ENV BUILD_ENV=$ENV

WORKDIR /app

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/server/package*.json ./packages/server/
COPY packages/adminui/package*.json ./packages/adminui/
COPY packages/webapp/package*.json ./packages/webapp/
RUN npm ci --frozen-lockfile --no-audit

COPY typescript ./typescript

COPY packages/shared ./packages/shared
RUN npm run build --workspace @way-to-bot/shared

FROM base AS server-build
COPY packages/server ./packages/server
RUN --mount=type=cache,target=/app/.npm \
    npm run build --workspace @way-to-bot/server

FROM base AS admin-build
COPY packages/adminui ./packages/adminui
COPY packages/adminui/.env.${BUILD_ENV} ./packages/adminui/.env
RUN --mount=type=cache,target=/app/.npm \
    npm run build --workspace @way-to-bot/adminui

FROM base AS webapp-build
COPY packages/webapp ./packages/webapp
COPY packages/webapp/.env.${BUILD_ENV} ./packages/webapp/.env
RUN --mount=type=cache,target=/app/.npm \
    npm run build --workspace @way-to-bot/webapp


FROM node:20.17.0-slim AS server
WORKDIR /app
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/package-lock.json ./package-lock.json
COPY --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --from=base /app/packages/shared/package.json ./packages/shared/package.json

COPY --from=server-build /app/packages/server/package.json ./packages/server/package.json
COPY --from=server-build /app/packages/server/dist ./packages/server/dist
COPY --from=server-build /app/packages/server/bin ./packages/server/bin

RUN npm ci --production --workspaces --include-workspace-root

FROM nginx:alpine AS web
COPY --from=admin-build /app/packages/adminui/dist /usr/share/nginx/html/admin
COPY --from=webapp-build /app/packages/webapp/dist /usr/share/nginx/html/webapp
COPY nginx/service_unavailable /usr/share/nginx/html/service_unavailable

CMD ["nginx", "-g", "daemon off;"]
