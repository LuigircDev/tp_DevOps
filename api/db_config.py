import mysql.connector

def get_db_connection():
    try:
        # connection = mysql.connector.connect(
        connection = mysql.connector.connect(
            host="localhost",
            user="",
            passwd="",
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci',
            raise_on_warnings=True
        )

        if connection.is_connected():
            # print("Conexión exitosa a la BD")
            return connection

    except mysql.connector.Error as error:
        print(error)
        print(f"No se pudo conectar: {error}")