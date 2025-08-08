FROM node:20.17.0-slim AS base

ARG ENV=local
ENV BUILD_ENV=$ENV

RUN npm install -g pnpm@latest

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY typescript ./typescript

RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

FROM base AS build-shared
RUN pnpm --filter @way-to-bot/shared build

FROM build-shared AS build-server
RUN pnpm --filter @way-to-bot/server build

FROM build-shared AS build-web
COPY packages/adminui/.env.${BUILD_ENV} ./packages/adminui/.env
COPY packages/webapp/.env.${BUILD_ENV} ./packages/webapp/.env
RUN pnpm --filter @way-to-bot/adminui build && \
    pnpm --filter @way-to-bot/webapp build

FROM node:20.17.0-slim AS server

RUN npm install -g pnpm@latest
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY --from=build-shared /app/packages/shared/package.json ./packages/shared/
COPY --from=build-shared /app/packages/shared/dist ./packages/shared/dist
COPY --from=build-server /app/packages/server/package.json ./packages/server/
COPY --from=build-server /app/packages/server/dist ./packages/server/dist
COPY --from=build-server /app/packages/server/bin ./packages/server/bin
COPY --from=build-server /app/packages/server/scripts ./packages/server/scripts

RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --prod

EXPOSE 3000

FROM nginx:stable AS web
COPY --from=build-web /app/packages/adminui/dist /usr/share/nginx/html/admin
COPY --from=build-web /app/packages/webapp/dist /usr/share/nginx/html/webapp
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
