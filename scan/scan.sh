#!/usr/bin/env bash

set -eu

# Directorio de salida para los reportes
OUTPUT_DIR="./seguridad"
TRIVY_DIR="$OUTPUT_DIR/trivy"
CHECKOV_DIR="$OUTPUT_DIR/checkov"

# Lista de imágenes a escanear
IMAGENES=("todo-mysql:latest" "todo-api:latest" "todo-web:latest")

# Lista de Dockerfiles a revisar
DOCKERFILES=(
  "./db/Dockerfile"
  "./api/Dockerfile"
  "./web/Dockerfile"
)

command -v trivy >/dev/null 2>&1 || { echo "❌ Error: Trivy no está instalado. Instálalo con: sudo apt install trivy -y"; exit 1; }
command -v checkov >/dev/null 2>&1 || { echo "❌ Error: Checkov no está instalado. Instálalo con: pip install checkov"; exit 1; }

# Crear directorios de salida si no existen
mkdir -p "$TRIVY_DIR" "$CHECKOV_DIR"

# Fecha para los reportes
FECHA=$(date +"%Y-%m-%d_%H-%M-%S")

echo "🔍 Iniciando escaneo de imágenes con Trivy..."

for imagen in "${IMAGENES[@]}"; do
  echo "📦 Escaneando imagen: $imagen"
  salida="$TRIVY_DIR/$(echo "$imagen" | tr ':/' '__')_$FECHA.txt"

  trivy image --severity HIGH,CRITICAL "$imagen" > "$salida" || true
  echo "✅ Reporte guardado en: $salida"
done

echo "🔎 Analizando Dockerfiles con Checkov..."

for dockerfile in "${DOCKERFILES[@]}"; do
  if [[ -f "$dockerfile" ]]; then
    nombre=$(basename "$(dirname "$dockerfile")")
    salida="$CHECKOV_DIR/checkov_${nombre}_$FECHA.txt"

    echo "🧱 Analizando: $dockerfile"
    checkov -f "$dockerfile" > "$salida" || true
    echo "✅ Reporte guardado en: $salida"
  else
    echo "⚠️  No se encontró: $dockerfile (omitido)"
  fi
done

echo "🛡️  Escaneo de seguridad completado."
echo "📁 Todos los reportes están en el directorio '$OUTPUT_DIR/'"