import mysql.connector
import os

def get_db_connection():
    try:
        # connection = mysql.connector.connect(
        connection = mysql.connector.connect(
            host="todo-mysql",
            database=f"{os.getenv('MYSQL_DATABASE')}",
            user=f"{os.getenv('MYSQL_USER')}",
            passwd=f"{os.getenv('MYSQL_PASSWORD')}",
            port=int(os.getenv('MYSQL_PORT')),
            raise_on_warnings=True
        )

        if connection.is_connected():
            # print("Conexión exitosa a la BD")
            return connection

    except mysql.connector.Error as error:
        print(error)
        print(f"No se pudo conectar: {error}")