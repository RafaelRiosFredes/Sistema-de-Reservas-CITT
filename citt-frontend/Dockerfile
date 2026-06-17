# ETAPA 1: Construcción (Build)
# instalacion de paquetes y compilacion de la aplicación React/Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código y construimos la versión de producción
COPY . .
RUN npm run build

# ETAPA 2: Servidor Web (Nginx)
# Usamos Nginx para servir los archivos estáticos de forma ultra rápida
FROM nginx:alpine

# Eliminamos la configuración por defecto de Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados de React (dist) desde la Etapa 1 a la carpeta pública de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 5173 para coincidir con el entorno de desarrollo original
EXPOSE 5173

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
