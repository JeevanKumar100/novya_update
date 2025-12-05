# novya-frontend-main/Dockerfile
# Multi-stage build: build React app, then serve with nginx

# Build stage
FROM node:18 AS builder
ARG NPM_VERSION
ENV NODE_ENV=production
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Only try to upgrade npm if NPM_VERSION is a non-empty, sane value.
# This handles cases where build-arg is not provided or accidentally set to literal "".
RUN set -eux; \
    case "$NPM_VERSION" in \
      ''|\"\" ) echo "No NPM_VERSION provided — skipping npm upgrade"; ;; \
      * ) echo "Installing npm@$NPM_VERSION"; npm install -g "npm@$NPM_VERSION"; ;; \
    esac

# Minimal .npmrc to reduce permission/network problems
RUN printf "unsafe-perm=true\nfetch-retries=5\nfetch-retry-factor=2\nstrict-ssl=true\n" > .npmrc

# Install dependencies deterministically; fallback to legacy-peer-deps on first failure
RUN npm ci --prefer-offline --no-audit --progress=false || \
    { echo "npm ci failed — retrying with legacy-peer-deps"; npm ci --legacy-peer-deps --prefer-offline --no-audit --progress=false; }

# Copy source and build
COPY . .
RUN npm run build

# Production runner
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
