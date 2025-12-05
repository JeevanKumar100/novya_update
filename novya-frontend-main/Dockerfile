# novya-frontend-main/Dockerfile
FROM node:18 AS builder
WORKDIR /app

# since build context is ./novya-frontend-main, package.json is at root of context
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
