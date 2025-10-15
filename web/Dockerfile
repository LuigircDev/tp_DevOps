# Etapa 1: Build de la aplicación React
FROM node:16-alpine AS build
WORKDIR /app

# Copia archivos de dependencias
COPY package*.json ./
RUN npm install

# Copia el esto del código fuente (los archivos .js, .css, la carpeta src, etc...)
COPY . ./
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/ssl /etc/nginx/ssl

# Crear usuario no root y darle permisos para acceder al html y los certificados
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /usr/share/nginx/html /etc/nginx/ssl

USER appuser

EXPOSE 80
EXPOSE 443

# HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# La opción daemon off hace que el proceso se ejecute en primer plano y no se acabe, esto es muy importante ya que 
# un contenedor de Docker se mantiene en ejecución mientras el proceso principal que se inició en él siga activo.
# Si ese proceso principal termina, Docker asume que la tarea del contenedor ha finalizado y lo detiene.
CMD ["nginx", "-g", "daemon off;"]