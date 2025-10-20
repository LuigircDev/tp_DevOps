FROM mysql:8.4

# Copia el script SQL al lugar donde MySQL lo ejecuta automáticamente al inicio
COPY init-scripts/tablas.sql /docker-entrypoint-initdb.d

USER mysql

# HEALTHCHECK para verificar que MySQL está listo
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD mysqladmin ping -h localhost -u "${MYSQL_USER_Healthchecker}" -p"${MYSQL_PASSWORD_Healthchecker}" || exit 1