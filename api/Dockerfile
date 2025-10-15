# Etapa de construcción
FROM python:3.9-slim AS builder

WORKDIR /usr/src/app

COPY requirements.txt ./

# "--no-cache-dir" hace que las dependencias no se guarden en cache,
# esto lo hacemos para que la imagen sea más liviana
RUN pip install --no-cache-dir -r requirements.txt

# Etapa de ejecución de la app
FROM python:3.9-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

COPY . .

# Crear usuario no root
RUN useradd -m appuser
USER appuser

# HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD python3 -c 'import sys' || exit 1

CMD ["python", "api.py"]