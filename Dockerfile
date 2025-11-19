# ---- STAGE 1: BUILD ----
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# ---- STAGE 2: RUNTIME ----
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
