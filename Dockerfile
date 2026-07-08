# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /build
COPY package*.json ./
# Nutzt die exakte package-lock.json und ignoriert devDependencies
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Sicherheit: Non-root User anlegen (ID 1001 löst den Konflikt mit dem Node-User)
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser

# Dependencies vom Builder kopieren UND dem appuser zuweisen
COPY --from=builder --chown=appuser:appgroup /build/node_modules ./node_modules

# App-Code kopieren UND dem appuser zuweisen
COPY --chown=appuser:appgroup . .

# Ab hier läuft der Container nicht mehr als root
USER appuser
EXPOSE 3000

# Health Check (prüft ob die App reagiert)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { if (res.statusCode !== 200) process.exit(1); })" || exit 1

ENV NODE_ENV=production
ENV PORT=3000

# Startbefehl
CMD ["npm", "start"]