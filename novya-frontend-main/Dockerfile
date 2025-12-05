# novya-frontend-main/Dockerfile
# Multi-stage build for a Create-React-App / react-scripts project.

# ---- build stage ----
FROM node:18 AS builder
ARG NPM_VERSION=""
WORKDIR /app

# If you need to enforce a specific npm, pass NPM_VERSION as a build-arg.
RUN if [ -n "$NPM_VERSION" ]; then npm install -g "npm@$NPM_VERSION"; fi

# Copy package manifest first to leverage Docker layer cache
COPY package*.json ./

# Ensure npm installs devDependencies so tools like react-scripts are available.
# Do NOT set NODE_ENV=production before installing.
# Create a small .npmrc to reduce permission/network friction
RUN printf "unsafe-perm=true\nfetch-retries=5\nfetch-retry-factor=2\nstrict-ssl=true\n" > .npmrc

# Use npm ci for reproducible installs (will install devDependencies because NODE_ENV not set)
RUN npm ci --prefer-offline --no-audit --progress=false || \
    { echo "npm ci failed - retrying with legacy-peer-deps"; npm ci --legacy-peer-deps --prefer-offline --no-audit --progress=false; }

# Copy app sources and run the build
COPY . .
# Now set production NODE_ENV for the build command (some libs read it)
ENV NODE_ENV=production
RUN npm run build

# ---- runtime stage ----
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
