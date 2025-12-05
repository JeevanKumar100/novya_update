# novya-frontend-main/Dockerfile
# Multi-stage build: build React app, then serve with nginx
FROM node:18 AS builder

# Optional: set an npm version when building if your lockfile needs it.
# Example: docker build --build-arg NPM_VERSION=11.6.4 ...
ARG NPM_VERSION=""
ARG CI=true

ENV NODE_ENV=production
WORKDIR /app

# Copy lock and package first to leverage Docker cache
COPY package*.json ./

# Optional: upgrade npm to match lockfile version if you need to
RUN if [ -n "$NPM_VERSION" ]; then \
      npm install -g "npm@$NPM_VERSION"; \
    fi

# Create a lightweight .npmrc to help avoid permission/network issues in CI
RUN printf "unsafe-perm=true\nfetch-retries=5\nfetch-retry-factor=2\nstrict-ssl=true\n" > .npmrc

# Install dependencies using npm ci (deterministic)
# Use flags to be more CI-friendly and stable
RUN npm ci --prefer-offline --no-audit --progress=false || \
    { echo "npm ci failed — retrying with legacy peer deps"; npm ci --legacy-peer-deps --prefer-offline --no-audit --progress=false; }

# Copy the rest of the frontend code and build
COPY . .

# Ensure build uses production env
RUN npm run build

# Production image (nginx)
FROM nginx:stable-alpine AS runner
# Remove default nginx index (optional) and copy build
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: copy a custom nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# run as non-root for extra safety (nginx in this image runs as root -> but exposing default)
CMD ["nginx", "-g", "daemon off;"]
