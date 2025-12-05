# frontend/Dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production image, serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
# optional: add your custom nginx conf if needed
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
