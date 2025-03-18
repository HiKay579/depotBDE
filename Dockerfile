FROM node:18-alpine

WORKDIR /app

# Installation de PNPM
RUN npm install -g pnpm

# Variables d'environnement
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3007

# Fichiers de configuration
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY postcss.config.mjs ./
COPY next.config.mjs ./


# Installation des dépendances
RUN pnpm install --frozen-lockfile


# Création du répertoire pour stocker les fichiers uploadés
RUN mkdir -p /app/uploads
RUN chmod 777 /app/uploads

# Copie du code source
COPY . .

# Build
RUN pnpm run build

# Port pour l'application
EXPOSE 3007

CMD ["node", ".next/standalone/server.js"]