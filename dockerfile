# Dockerfile - Multi-stage build para Sonara Frontend
# Usa Node.js 24 LTS (Krypton) - la versión LTS más reciente

# ============================================
# ETAPA 1: Builder
# ============================================
FROM node:24-alpine AS builder

# Instalar pnpm (versión estable)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN pnpm build

# ============================================
# ETAPA 2: Runner (producción)
# ============================================
FROM node:24-alpine AS runner

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Establecer directorio de trabajo
WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar solo lo necesario del builder
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copiar node_modules solo con dependencias de producción
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Cambiar al usuario no-root
USER nextjs

# Puerto expuesto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación
CMD ["pnpm", "start"]