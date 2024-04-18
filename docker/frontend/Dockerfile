FROM node:20.10.0

WORKDIR /app

COPY ./app/frontend/package*.json ./

COPY ./app/frontend/.env.local /app/.env.local

RUN npm install
