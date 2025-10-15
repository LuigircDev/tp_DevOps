#!/usr/bin/env bash

set -eu

# Configuración
declare -A IMAGENES=(
  ["db"]="todo-mysql:latest"
  ["api"]="todo-api:latest"
  ["web"]="todo-web:latest"
)

CARPETAS=("db" "api" "web")
CONTENEDORES=("todo-mysql" "todo-api" "todo-web")

SSL_DIR="./web/nginx/ssl"
CERT_CRT="$SSL_DIR/cert.crt"
CERT_KEY="$SSL_DIR/cert.key"

# Funciones auxiliares
imagen_existe() {
  local nombre=$1
  docker image inspect "$nombre" > /dev/null 2>&1
}

# Generar certificado autofirmado si no existe
generar_certificado_ssl() {
  echo "🔒 Verificando certificados SSL..."

  if [[ -f "$CERT_CRT" && -f "$CERT_KEY" ]]; then
    echo "✅ Certificados SSL encontrados."
  else
    echo "⚙️  No se encontraron certificados. Creando nuevos certificados autofirmados..."
    mkdir -p "$SSL_DIR"

    openssl req -x509 -nodes -days 365 \
      -newkey rsa:2048 \
      -keyout "$CERT_KEY" \
      -out "$CERT_CRT" \
      -subj "/C=AR/ST=BuenosAires/L=BuenosAires/O=TodoApp/OU=Dev/CN=localhost"

    echo "✅ Certificados SSL generados en '$SSL_DIR'."
  fi
}

# --- Control principal ---

ACCION="${1:-}"

# Si el primer argumento es "down", apaga los servicios
if [[ "$ACCION" == "down" ]]; then
  echo "🛑 Apagando servicios con docker compose..."
  docker compose down
  echo "✅ Servicios detenidos."
  exit 0
fi

# Verificar/generar certificados antes de levantar servicios
generar_certificado_ssl

# Si el primer argumento es "build", realiza el build
if [[ "$ACCION" == "build" ]]; then
  echo "⚙️  Iniciando proceso de build..."
  for carpeta in "${CARPETAS[@]}"; do
    imagen="${IMAGENES[$carpeta]}"

    if imagen_existe "$imagen"; then
      echo "📦 La imagen '$imagen' ya existe. Reconstruyendo..."
    else
      echo "🚧 La imagen '$imagen' no existe. Construyendo por primera vez..."
    fi

    docker build -t "$imagen" "./$carpeta"
  done
  echo "✅ Build completo."
fi

# Eliminar contenedores existentes si están corriendo
echo "🧹 Eliminando contenedores existentes si están corriendo..."
for nombre in "${CONTENEDORES[@]}"; do
  if docker ps -a --format '{{.Names}}' | grep -q "^$nombre$"; then
    echo "🗑️  Eliminando contenedor '$nombre'..."
    docker rm -f "$nombre"
  fi
done

# Levantar con docker compose
echo "🚀 Levantando servicios con docker compose..."
docker compose up -d

echo "✅ Todo listo."