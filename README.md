# TP Integrador 2025 - Parte 1 - Grupo 11

## Introducción

Este repositorio contiene la solución del **Grupo 11** para el **TP Integrador (Parte 1)** propuesto por la cátedra de **Desarrollo y Operaciones DevOps**.  
La entrega implementa una aplicación web dockerizada compuesta por:

- **Backend [`api/`]**: API REST en Python conectada a la base de datos.
- **Base de datos [`db/`]**: servicio MySQL inicializado con scripts SQL.
- **Frontend/Servidor [`web/`]**: Nginx sirviendo contenido estático y actuando como reverse proxy para la API.
- **Orquestación**: definida con `docker-compose.yml` y automatizada mediante el script `run.sh`.

## Integrantes

**Cimatti, Benjamín**  
Legajo: 94312  

**Morales Demaría, Lucio**  
Legajo: 94289  

**Rivera Cuffaro, Luigi**  
Legajo: 91353

## Arquitectura general
![arquitectura](/doc/img/Arquitectura-TP-DevOps.jpg)

#### *Notas*
- Nginx expone el sitio y enruta las solicitudes `/api` a la API.
- La API se comunica con la base mediante credenciales gestionadas por variables de entorno.
- Todos los servicios corren en una red interna definida por docker compose.

## Ejecución

#### *Primera ejecución*
   ```sh
   ./run.sh build
   ```

#### *Si las imagenes ya existen:*
   ```sh
   ./run.sh
   ```

#### *Verificación:*
   - Web: [http://localhost:80](http://localhost:80) ó [https://localhost:443](https://localhost:443) 
   - API: [http://localhost:80/api/](http://localhost:80/api/) ó [https://localhost:443/api/](https://localhost:443/api/)
   - DB: [http://localhost:80/api/todos](http://localhost:80/api/todos) ó [https://localhost:443/api/todos](https://localhost:443/api/todos)


#### *Detener los contedores:*
   ```sh
   ./run.sh down
   ```

#### *Ejecutar escaneos con Checkov y Trivy:*

```bash
bash scan.sh
```
Los reportes se guardan en la carpeta `/doc/seguridad/`

##### *Prerrequisito para escanear (instalar checov y trivy):*

```bash
# Instalar Trivy
sudo apt-get install wget apt-transport-https
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```

```bash
# Crear entorno virtual
python3 -m venv .checkov_env
source .checkov_env/bin/activate
# Instalar Checkov
pip install checkov
```

## Estructura relevante del repositorio

```bash
.
├── api                  # Código de la API, Dockerfile y dependencias
├── db                   # Dockerfile e init-scripts/ con SQL de creación de tablas
│   └── init-scripts
├── doc                  # Documentación sobre ENUNCIADO, ERRORES, SEGURIDAD
│   └── seguridad        # Directorio donde se guardan las salidas de los escaneos
│       ├── checkov
│       └── trivy
└── web                  # Dockerfile, nginx/nginx.conf y assets del frontend
│   └── nginx
│       └── ssl          # Directorio donde se crean los certificados autofirmados
├── docker-compose.yml   # Define servicios, redes y dependencias
├── run.sh               # Script para build, run y comprobaciones de los contenedores
└── scan.sh              # Utilidades de escaneo de seguridad con Checkov y Trivy
```

## Posibles mejoras
- Implementar HTTPS end-to-end sin certificados autofirmados.
- Gestionar secretos con `docker secrets`; evitar variables de entorno en texto plano.
- Observabilidad: logs estructurados, dashboards y alertas básicas.
- Automatizar escaneos con checkov y trivy en el docker-compose

## Documentación relacionada

- [Enunciado del TP](doc/ENUNCIADO.md)  
- [Errores que se fueron presentando a lo largo del desarrollo, y como los solucionamos](doc/ERRORES.md)  
- [Como gestionamos la seguridad y resultados de chequeos](doc/SEGURIDAD.md)