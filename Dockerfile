# Stage 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy application source
COPY src/ ./src/

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production Stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install curl for container healthchecks
RUN apk add --no-cache wget

# Copy package definitions and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code and assets from builder
COPY --from=builder /app/dist ./dist
COPY src/db/init.sql ./dist/db/init.sql

# Set non-root security context
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

CMD ["node", "dist/server.js"]
