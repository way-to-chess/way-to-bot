FROM node:20.10.0-alpine as client_builder

WORKDIR /app

COPY package.*.json ./
COPY . .

RUN npm install
