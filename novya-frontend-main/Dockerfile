# novya-frontend-main/Dockerfile
### build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

### production stage
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# optionally copy custom nginx config:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
