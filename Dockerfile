# ---- STAGE 1: BUILD ----
# Cambiamos node:18-alpine por node:18-slim para evitar problemas de librerías
FROM node:20-bullseye-slim as build


WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# ---- STAGE 2: RUNTIME ----
# Usamos la base Debian (slim) que tiene mejor soporte de red/SSL que Alpine
FROM node:20-bullseye-slim as deploy

# 👇 ESTO ES VITAL: Instalamos certificados actualizados para que no falle el SSL
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app .

# Actualicé esto a 3434 para que coincida con tu código Node.js
EXPOSE 3434

CMD ["npm", "start"]