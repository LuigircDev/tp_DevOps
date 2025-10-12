from flask import Flask
from flask_cors import CORS  # Habilita CORS para permitir solicitudes desde diferentes dominios

app = Flask(__name__)  # Inicializamos la aplicación Flask
CORS(app)  # Habilitamos CORS para permitir peticiones desde clientes externos