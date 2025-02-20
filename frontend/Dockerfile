# Базовый образ Node.js для сборки приложения
FROM node:18-alpine3.20 AS build
WORKDIR /app
COPY package*.json ./
RUN corepack enable
RUN yarn set version berry 
RUN yarn install
COPY . .
RUN yarn build
ENV NODE_ENV production
COPY nginx.conf /etc/nginx/nginx.conf

# Финальный образ Nginx для развертывания приложения
FROM nginx:1.27.4-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

# Запуск Nginx в фоновом режиме
CMD ["nginx", "-g", "daemon off;"]
