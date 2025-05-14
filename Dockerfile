FROM node:20.17.0-alpine AS builder

WORKDIR /app

# COPY
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/webapp/package.json ./packages/webapp/
COPY packages/adminui/package.json ./packages/adminui/
COPY packages/server/package.json ./packages/server/

COPY . .

# INSTALL
RUN npm install --workspace @way-to-bot/shared
RUN npm install --workspace @way-to-bot/webapp
RUN npm install --workspace @way-to-bot/adminui
RUN npm install --workspace @way-to-bot/server

# BUILD
RUN npm run build --workspace @way-to-bot/shared

RUN npm run build --workspace @way-to-bot/webapp

#RUN npm run build --workspace @way-to-bot/adminui

RUN npm run build --workspace @way-to-bot/server
#RUN npm run typeorm:migrate --workspace @way-to-bot/server

FROM node:20.17.0-alpine AS server

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json

COPY --from=builder /app/packages/server/package.json ./package.json
COPY --from=builder /app/packages/server/dist ./dist
COPY --from=builder /app/packages/server/.env ./.env
COPY --from=builder /app/packages/server/bin ./packages/server/bin

RUN npm install --production

FROM nginx:alpine AS web
COPY --from=builder /app/packages/webapp/dist /usr/share/nginx/html/webapp
#COPY --from=builder /app/packages/adminui/dist /usr/share/nginx/html/admin
CMD ["nginx", "-g", "daemon off;"]
