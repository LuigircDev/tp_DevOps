# SEGURIDAD

## Gestión de secretos

- **Variables de entorno con `.env`**
  - `todo-mysql` y `todo-api` cargan variables desde `env_file: .env`.

- **Certificados TLS (Transport Layer Security)**
  - `todo-web` monta `./web/nginx/ssl/cert.crt` y `cert.key` como volumen de solo lectura (`:ro`).

---

## Resultados de escaneos
Luego de ejecutar el siguiente comando, se podrán ver los reportes en la carpeta `/doc/seguridad/`
```bash
bash scan.sh
```

---

## Mejores prácticas aplicadas

### Imágenes y builds
- Multi-stage builds en `api/` y `web/` para reducir tamaño y superficie de ataque.
- Imágenes base oficiales y minimalistas (`python:3.9-slim`, `nginx:stable-alpine`, `node:16-alpine`).
- Instalacion de dependencias con `--no-cache` (pip) y no incluir herramientas de build en la etapa final.

### Usuarios y permisos
- API corre como usuario no-root (`USER appuser`).
- Volúmenes con permisos mínimos. Certs montados como `:ro`.

### Red y exposición
- Sólo `todo-web` expone puertos (80/443). `todo-api` y `todo-mysql` permanecen internos en `app-network`.

### TLS y cabeceras de seguridad
- TLS configurado en 443 con certificados autofirmados montados.
- Redirección 80→443 en `nginx.conf` (está comentado, pero está)

### Healthchecks y observabilidad
- Healthchecks básicos definidos en `api`, `web` y `db`.

### Base de datos
- Usuario de aplicación sin privilegios de administración.
- Persistencia en volumen dedicado `mysql-data`. Restringir acceso a nivel host.