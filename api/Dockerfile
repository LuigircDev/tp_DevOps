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

CMD ["python", "api.py"]