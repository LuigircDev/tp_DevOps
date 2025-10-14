#!/usr/bin/env bash

set -euo pipefail

# Configuración
declare -A IMAGENES=(
  ["db"]="todo-mysql:latest"
  ["api"]="todo-api:latest"
  ["web"]="todo-web:latest"
)

CARPETAS=("db" "api" "web")
CONTENEDORES=("todo-mysql" "todo-api" "todo-web")

# Verifica si una imagen existe localmente
imagen_existe() {
  local nombre=$1
  docker image inspect "$nombre" > /dev/null 2>&1
}

# Verifica si hubo cambios con git en una carpeta
hay_cambios() {
  local carpeta=$1
  if git diff --quiet HEAD -- "$carpeta"; then
    return 1  # No hay cambios
  else
    return 0  # Hay cambios
  fi
}

# Build de imágenes
echo "🔍 Verificando imágenes y cambios..."
for carpeta in "${CARPETAS[@]}"; do
  imagen="${IMAGENES[$carpeta]}"

  if imagen_existe "$imagen"; then
    echo "📦 Imagen '$imagen' ya existe."

    if hay_cambios "$carpeta"; then
      echo "⚙️  Cambios detectados en '$carpeta', reconstruyendo '$imagen'..."
      docker build -t "$imagen" "./$carpeta"
    else
      echo "✅ Sin cambios en '$carpeta', no se buildea."
    fi
  else
    echo "🚧 Imagen '$imagen' no existe. Buildeando por primera vez..."
    docker build -t "$imagen" "./$carpeta"
  fi
done

# Eliminar contenedores si están corriendo
echo "🧹 Eliminando contenedores existentes si están corriendo..."
for nombre in "${CONTENEDORES[@]}"; do
  if docker ps -a --format '{{.Names}}' | grep -q "^$nombre$"; then
    echo "🛑 Eliminando contenedor '$nombre'..."
    docker rm -f "$nombre"
  fi
done

# Levantar con docker compose
echo "🚀 Levantando servicios con docker compose..."
docker compose up -d

echo "✅ Todo listo."