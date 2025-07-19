FROM node:20.17.0-slim AS base

ARG ENV=dev
ENV BUILD_ENV=$ENV

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

COPY packages/shared/package.json ./packages/shared/
COPY packages/server/package.json ./packages/server/
COPY packages/adminui/package.json ./packages/adminui/
COPY packages/webapp/package.json ./packages/webapp/

# Устанавливаем зависимости с кэшированием pnpm store
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

COPY typescript ./typescript

FROM base AS shared-build
COPY packages/shared ./packages/shared
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm --filter @way-to-bot/shared build

FROM base AS server-build
COPY --from=shared-build /app/packages/shared ./packages/shared
COPY packages/server ./packages/server
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm --filter @way-to-bot/server build

FROM base AS admin-build
COPY --from=shared-build /app/packages/shared ./packages/shared
COPY packages/adminui ./packages/adminui
COPY packages/adminui/.env.${BUILD_ENV} ./packages/adminui/.env
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm --filter @way-to-bot/adminui build

FROM base AS webapp-build
COPY --from=shared-build /app/packages/shared ./packages/shared
COPY packages/webapp ./packages/webapp
COPY packages/webapp/.env.${BUILD_ENV} ./packages/webapp/.env
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm --filter @way-to-bot/webapp build

FROM node:20.17.0-slim AS server
RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --from=shared-build /app/packages/shared/package.json ./packages/shared/
COPY --from=shared-build /app/packages/shared/dist ./packages/shared/dist
COPY --from=server-build /app/packages/server/package.json ./packages/server/
COPY --from=server-build /app/packages/server/dist ./packages/server/dist
COPY --from=server-build /app/packages/server/bin ./packages/server/bin
COPY --from=server-build /app/packages/server/scripts ./packages/server/scripts

# Устанавливаем только production зависимости с кэшированием
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --prod

EXPOSE 3000

# Production образ для nginx
FROM nginx:stable AS web
COPY --from=admin-build /app/packages/adminui/dist /usr/share/nginx/html/admin
COPY --from=webapp-build /app/packages/webapp/dist /usr/share/nginx/html/webapp

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
