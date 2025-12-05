# novya-frontend-main/Dockerfile
# Multi-stage build: build React app, then serve with nginx

FROM node:18 AS builder

# Optional: set an npm version when building if your lockfile needs it.
# Build with: docker build --build-arg NPM_VERSION=11.6.4 ...
ARG NPM_VERSION=""

ENV NODE_ENV=production
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Optionally upgrade npm if lockfile requires newer npm
RUN if [ -n "$NPM_VERSION" ]; then npm install -g "npm@$NPM_VERSION"; fi

# Create a lightweight .npmrc to reduce permission & network issues
RUN printf "unsafe-perm=true\nfetch-retries=5\nfetch-retry-factor=2\nstrict-ssl=true\n" > .npmrc

# Install dependencies deterministically; fallback to legacy-peer-deps on failure
RUN npm ci --prefer-offline --no-audit --progress=false || \
    { echo "npm ci failed — retrying with legacy-peer-deps"; npm ci --legacy-peer-deps --prefer-offline --no-audit --progress=false; }

# Copy the rest of app and build
COPY . .
RUN npm run build

# Runner: nginx serving the build output
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
