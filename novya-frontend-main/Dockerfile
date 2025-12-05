# novya-frontend-main/Dockerfile
FROM node:18 AS builder

# declare build arg with default empty so it's defined during build even if not passed
ARG NPM_VERSION=""

ENV NODE_ENV=production
WORKDIR /app

# copy package manifest for caching
COPY package*.json ./

# safe conditional npm upgrade: NPM_VERSION is defined (maybe empty)
RUN set -eux; \
    case "$NPM_VERSION" in \
      "" ) echo "No NPM_VERSION provided — skipping npm upgrade" ;; \
      * ) echo "Installing npm@$NPM_VERSION" ; npm install -g "npm@$NPM_VERSION" ;; \
    esac

# small .npmrc to reduce network/permission issues
RUN printf "unsafe-perm=true\nfetch-retries=5\nfetch-retry-factor=2\nstrict-ssl=true\n" > .npmrc

# install deps (prefer stable reproducible install)
RUN npm ci --prefer-offline --no-audit --progress=false || \
    { echo "npm ci failed - retrying with legacy-peer-deps"; npm ci --legacy-peer-deps --prefer-offline --no-audit --progress=false; }

COPY . .
RUN npm run build

FROM nginx:stable-alpine AS runner
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
