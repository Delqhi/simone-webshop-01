# OpenDocs Production Dockerfile
# Best Practices February 2026 - Enterprise Grade
# Multi-stage build for optimal security and performance

# Stage 1: Base image with Node.js 20 (LTS)
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Build the application
FROM base AS builder

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production image
FROM base AS runner

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 opendocs

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy server.js and other necessary files
COPY server.js ./
COPY .env ./

# Set ownership
RUN chown -R opendocs:nodejs /app

# Switch to non-root user
USER opendocs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "server.js"]

# Labels for better container management
LABEL org.opencontainers.image.title="OpenDocs"
LABEL org.opencontainers.image.description="Open Source Documentation Platform"
LABEL org.opencontainers.image.version="0.0.0"
LABEL org.opencontainers.image.created="2026-02-10"
LABEL org.opencontainers.image.authors="OpenDocs Team"