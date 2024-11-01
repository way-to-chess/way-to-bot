FROM node:18.13.0-alpine as server_builder

WORKDIR /app

COPY package.*.json ./
COPY /packages/server/package.*.json ./
COPY /packages/shared/package.*.json ./
COPY /packages/webapp/package.*.json ./
COPY . .

RUN npm install