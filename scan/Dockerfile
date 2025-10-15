# Usa una imagen base de Python slim para mantener el tamaño reducido
FROM python:3.11-slim

# Etiqueta para identificar el propósito de la imagen
LABEL maintainer="devops-grupo11"
LABEL description="Contenedor para ejecutar escaneos de seguridad con Trivy y Checkov."

# Variables de entorno para evitar diálogos interactivos durante la instalación
ENV DEBIAN_FRONTEND=noninteractive

# Instala las dependencias necesarias para Trivy
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    gnupg \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Instala Trivy
RUN wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor > /usr/share/keyrings/trivy.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" > /etc/apt/sources.list.d/trivy.list \
    && apt-get update \
    && apt-get install -y trivy

# Instala Checkov usando pip
RUN pip install --no-cache-dir checkov

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia todo el contexto del proyecto al directorio de trabajo
# Esto es necesario para que checkov pueda analizar los Dockerfiles
COPY . .

# Hace que el script de escaneo sea ejecutable
RUN chmod +x ./scan.sh

# Define el punto de entrada para que el contenedor ejecute el script de escaneo
ENTRYPOINT ["./scan.sh"]
