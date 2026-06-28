# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm install

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app

# Dependencies vom Builder kopieren
COPY --from=builder /build/node_modules ./node_modules
# App-Code kopieren
COPY . .

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]