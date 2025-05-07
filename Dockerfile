FROM node:20.17.0-alpine AS builder

WORKDIR /index

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/webapp/package.json ./packages/webapp/
COPY packages/adminui/package.json ./packages/adminui/
COPY packages/server/package.json ./packages/server/

RUN npm install --workspace @way-to-bot/shared
RUN npm install --workspace @way-to-bot/webapp
RUN npm install --workspace @way-to-bot/adminui
RUN npm install --workspace @way-to-bot/server

COPY typescript ./typescript
COPY packages/shared ./packages/shared
COPY packages/webapp ./packages/webapp
COPY packages/adminui ./packages/adminui
COPY packages/server ./packages/server

RUN npm run build --workspace @way-to-bot/webapp
RUN npm run build --workspace @way-to-bot/adminui

RUN npm run build --workspace @way-to-bot/server
RUN npm run typeorm:migrate --workspace @way-to-bot/server

FROM node:20.17.0-alpine AS server
WORKDIR /index
COPY --from=builder /index/packages/server/dist ./dist
COPY --from=builder /index/packages/server/.env ./.env
COPY --from=builder /index/packages/server/package.json ./package.json
COPY --from=builder /index/package-lock.json ./package-lock.json
RUN npm install --production
EXPOSE 3000
CMD ["npx", "env-cmd", "-f", ".env", "node", "dist/index.js"]

FROM nginx:alpine AS web
COPY --from=builder /index/packages/webapp/dist /usr/share/nginx/html/webapp
COPY --from=builder /index/packages/adminui/dist /usr/share/nginx/html/admin
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
