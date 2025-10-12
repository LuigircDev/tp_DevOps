# TP Integrador 2025 - Parte 1

# Dockerización Segura y Docker compose
Bienvenidos a este primer trabajo práctico de la materia DevOps. El objetivo es que, trabajando en grupos de 3 a 4 personas, apliquen conceptos clave de desarrollo y operaciones, enfocándose en la containerización con Docker. Van a crear una aplicación web simple, pero con un **énfasis en la seguridad y la gestión de secretos**, para simular escenarios reales de producción. Esto les ayudará a entender cómo integrar prácticas DevOps en el ciclo de vida de una app.

## Requisitos
1. Python 3.x - shell (Linux)
2. Cliente MySQL. ej: Dbeaver, https://dbeaver.io/download/ 
3. Docker, docker compose
4. Node (o podes usar otro lenguaje)
5. Cliente HTTP 

## Objetivo
Aplicar conocimientos adquiridos en la materia Desarrollo y Operaciones para levantar una aplicación con contenedores en su host, compuesto de 3 microservicios utilizando un proxy para que tanto front y back salgan por el mismo dominio.

Fomentar el trabajo en equipo, la documentación clara y la presentación de resultados.

## Objetivos específicos
- Dockerizar microservicios
- Comprender el manejo de docker compose
- Implementar medidas de seguridad en contenedores, incluyendo la gestión de secretos sensibles (como claves API o contraseñas).
- Proponer mejoras al trabajo entregado
- Documentar errores y soluciones aplicadas.


## Descripción de la Actividad
Van a desarrollar y presentar una aplicación dockerizada que consiste en una API simple. Por ejemplo:
- Backend: [API REST](./api/) con conexión a [DB](./db/). En carpeta DB se dejan script `.sql` para usar en un MySQL o MariaDB, el que mas les guste. 
    > Aclaración: Se deja este pero pueden buscar otra API con otra DB
- Frontend/Servidor: Usen Nginx para servir la web de forma estitica y la API como reverse proxy, asegurando que la app sea accesible vía HTTP/HTTPS. En la carpeta [nginx](./nginx/) se deja el `nginx.conf`, puede requerir cambios
    > Aclaración: si son 4 es necesario que agreguen otro microservicio, puede ser otra web, no es necesario que esté conectado al back. Con que sea accesible es suficiente.
- Seguridad: Aseguren la app contra vulnerabilidades comunes. Gestionen secretos (ej.: una clave de API o credenciales de base de datos) de forma segura, evitando hardcodearlos.

> Trabajen colaborativamente usando Git (GitLab para el repositorio grupal). Asegúrense de que la app sea **reproducible**: cualquiera debería poder clonar el repo y ejecutarla con un comando simple.



## Puntos de entrega
### 1. Archivos ignorados correctamente:
- `.gitignore`. Pueden ayudarse de esta [página](https://www.toptal.com/developers/gitignore/) 
### 2. Por cada microservicio:
- `Dockerfile`: El archivo principal para construir la imagen de cada microservicio. Optimicen con multi-stage builds si es posible, para reducir el tamaño.
- `.dockerignore`: Para excluir archivos innecesarios y mejorar la eficiencia del build.
### 3. docker compose
- docker-compose.yml: importante que las imágenes están previamente creada en tu local, no va a ser válido que el docker-compose genere la imagen.
### 4. Un archivo `README.md`: 
- con explicación/introducción de lo que contiene el/s repositorio/s
- Diagrama de arquitectura. Pueden linkear una imagen que este en el mismo repo. 
- Importante agregar seccion con **posibles mejoras** que identifiquen.
- Tambien pueden linkear a los otros archivos `*.md`
### 5. Glosario de errores
- Un archivo `ERRORES.md`: Con errores que se presentaron y como lo resolvieron.
### 6. Documentación de Seguridad
- Un archivo `SEGURIDAD.md`:
    - Cómo gestionaron secretos (ej.: usando variables de entorno).
    - Resultados de escaneos de seguridad (incluyan capturas o logs).
    - Mejores prácticas aplicadas (ej.: principio de menor privilegio, imágenes base oficiales).
### 7. Script de Ejecución
- Un archivo bash o Makefile que automatice el build, run y pruebas de la app (ej.: `run.sh` que levante el contenedor con `docker run`). 
- Incluir alguna prueba de que todo quedó levantado ok, aparte del `docker ps`.
  
  > **Importante**: acá por temas de reproductibilidad podemos pedir que den de baja todos los contendores/volúmenes/redes/etc y volver a levantar todo. 

## Herramientas Recomendadas
Para hacer el TP más robusto, usen estas herramientas (instálenlas localmente o en su entorno de desarrollo):
- Gestión de Secretos:
    - detect-secrets: Escanea el código en busca de secretos expuestos antes de commitear.
    - docker run --env-file: Carga variables de entorno desde un archivo seguro (ej.: .env) durante la ejecución del contenedor.
- Seguridad en Contenedores:
    - trivy: Escanea la imagen Docker en busca de vulnerabilidades en paquetes y dependencias.
    - checkov: Analiza el Dockerfile y configuraciones IaC para detectar issues de seguridad.
> Ejemplo de flujo: Buildeen la imagen, escanéenla con Trivy, corrijan issues, y documenten los fixes.



## Material
- Documentación oficial correspondiente
- Clases. [Material extra](https://labsys.frc.utn.edu.ar/gitlab/desarrollo-y-operaciones-devops/material/material-de-lectura)
- Chat GPT (importante que entiendan las respuesta que estan copiando/utilizando)

## Metodología de TP
- Las soluciones propuestas serán presentadas en vivo, durante el horario de clases, de forma presencial. El grupo entero participa, y el resto de la clase puede hacer preguntas o comentarios. Usaremos esto para feedback grupal: **¿Qué salió bien? ¿Qué se podría mejorar?**
- Todos los puntos solicitados deberán quedar en los repositorios creados y distribuidos para este TP, proyecto que no este subido su ultima versión en la rama main (o la rama default) no será considerado al momento de cargar a nota.
- En clase, cada grupo demostrará la app corriendo en Docker, explicando las decisiones de diseño y cómo manejaron la seguridad. Duración: 10-15 minutos por grupo. Durante la presentación podemos realizar preguntas conceptuales. 

### Criterios de Evaluación:
- Funcionalidad de la app (30%).
- Calidad de la dockerización y optimizaciones (30%).
- Manejo de seguridad y secretos (20%).
- Documentación clara y script de ejecución (10%).
- Presentación y trabajo en equipo (10%).
> Hay una nota grupal y una nota individual para evaluar la participación de todos los integrantes

>Si hay dudas, no duden en contactarnos por los medios establecidos.

