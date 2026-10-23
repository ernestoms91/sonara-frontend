# ============================================
# ETAPA 1: Builder
# ============================================
FROM git.rsa.icrt.cu:5000/rsa/registry/node:24.15.0-alpine AS builder

# Configurar proxy
ENV HTTP_PROXY=http://10.3.9.38:8080
ENV HTTPS_PROXY=http://10.3.9.38:8080
ENV NO_PROXY=localhost,127.0.0.1,.local,.icrt.cu,git.rsa.icrt.cu,10.3.9.38

# Instalar herramientas de compilación
RUN apk add --no-cache python3 make g++

# Instalar pnpm
RUN npm install -g pnpm@9.15.0

# Configurar pnpm
RUN pnpm config set proxy http://10.3.9.38:8080 && \
    pnpm config set https-proxy http://10.3.9.38:8080 && \
    pnpm config set no-proxy "localhost,127.0.0.1,.local,.icrt.cu,git.rsa.icrt.cu,10.3.9.38"

WORKDIR /app

# Copiar SOLO package.json y pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile --ignore-scripts=false

# COPIA TODOS LOS ARCHIVOS (incluyendo el código fuente)
COPY . .

# VERIFICAR que no hay workspace y forzar build
RUN rm -f pnpm-workspace.yaml && \
    pnpm build

# ============================================
# ETAPA 2: Runner (producción)
# ============================================
FROM git.rsa.icrt.cu:5000/rsa/registry/node:24.15.0-alpine AS runner

ENV HTTP_PROXY=http://10.3.9.38:8080
ENV HTTPS_PROXY=http://10.3.9.38:8080
ENV NO_PROXY=localhost,127.0.0.1,.local,.icrt.cu,git.rsa.icrt.cu,10.3.9.38

RUN npm install -g pnpm@9.15.0

RUN pnpm config set proxy http://10.3.9.38:8080 && \
    pnpm config set https-proxy http://10.3.9.38:8080 && \
    pnpm config set no-proxy "localhost,127.0.0.1,.local,.icrt.cu,git.rsa.icrt.cu,10.3.9.38"

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

RUN mkdir -p /app /home/nextjs/.pnpm && \
    chown -R nextjs:nodejs /app /home/nextjs/.pnpm && \
    chmod -R 755 /app /home/nextjs/.pnpm

USER nextjs

WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info
ENV PNPM_HOME=/home/nextjs/.pnpm

CMD ["pnpm", "start"]