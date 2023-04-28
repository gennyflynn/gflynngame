#Todo: figure out why imports are messed up
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS


app = Flask(__name__)

app.config['SECRET_KEY'] = 'dev-secret-key'
socketio = SocketIO(app, logger=True, cors_allowed_origins="*")


CORS(app)

from server.routes import *

if __name__ == '__main__':
    socketio.run(app, debug=True)

