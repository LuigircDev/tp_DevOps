# Glosario de Errores

---
El modulo que hay que importar no es db, si no db_config
```bash
Traceback (most recent call last):
  File "/home/utn/repos-devops/tp-devops-grupo11/api/api.py", line 3, in <module>
    from db import get_db_connection  # Importamos la función para obtener la conexión a la base de datos
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
ModuleNotFoundError: No module named 'db'
```
Correción:
```python
from db_config import get_db_connection  # Importamos la función para obtener la conexión a la base de datos
```
---
No se estaba pudiendo acceder a la api a través del nginx porque faltaba agregar la barra (/) al final del proxy pass
```bash
172.21.0.1 - - [13/Oct/2025:03:19:21 +0000] "GET /api/todos HTTP/1.1" 404 39 "http://localhost:80/api/todos" "PostmanRuntime/7.46.0" "-"
```
```nginx
    # Reverse proxy hacia Flask (API)
    location /api/ {
        proxy_pass http://todo-api:5000/; <--- faltaba el slash al final
        proxy_http_version 1.1;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
```
---
El script run.sh fallaba porque no existían las imagenes, por lo que hubo que modificar el script para que las cree si no existen
```bash
✘ todo-web Error pull access denied for todo-web, repository does not exist or may require 'docker login': denied: requested access to the resource is denied

```

---
Al crear los certificados en el equipo host, solo este tiene permisos para leer la key, por lo que el usuario del contenedor no podrá leerla. Por eso le damos permisos con chmod para que otros usuarios puedan leerlo. Si bien no es lo ideal, lo hacemos por ser un entorno de desarrollo aún. La solución ideal para un entorno de desarrollo sería implementar docker secrets junto a docker swarm.
```bash
chmod 644 "$SSL_DIR"/cert.key
```