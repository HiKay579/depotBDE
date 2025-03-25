FROM node:18-alpine AS base

# Installation de PNPM
RUN npm install -g pnpm

# ---
# Étape de construction (build)
# ---
FROM base AS builder
WORKDIR /app

# Variables d'environnement pour la construction
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NEXT_TELEMETRY_DISABLED=1

# Copier les fichiers de configuration
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY postcss.config.mjs ./
COPY next.config.mjs ./

# Copier le schéma Prisma pour générer le client
COPY prisma ./prisma/

# Installation des dépendances
RUN pnpm install --frozen-lockfile

# Génération du client Prisma AVANT de construire l'application
RUN npx prisma generate

# Copier le reste du code source
COPY . .

# Construire l'application
RUN pnpm run build

# ---
# Étape d'exécution (production)
# ---
FROM base AS runner
WORKDIR /app

# Variables d'environnement pour la production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3007

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Créer le répertoire pour les uploads et donner les permissions
RUN mkdir -p /app/uploads
RUN chmod 777 /app/uploads

# Copier les fichiers compilés depuis l'étape de construction
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.pnpm/@prisma+client* ./node_modules/.pnpm/@prisma+client*
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

# Définir les bonnes permissions
RUN chown -R nextjs:nodejs /app

# Utiliser l'utilisateur non-root
USER nextjs

# Exposer le port
EXPOSE 3007

# Démarrer l'application
CMD ["node", "server.js"]