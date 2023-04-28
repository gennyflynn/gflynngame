from server.app import socketio
from flask_socketio import emit

@socketio.on("connect")
def handle_connect():
    emit("connected")
    print('\n\n\n client connected\n\n')


@socketio.on("disconnect")
def handle_disconnect():
    print("\n\ndisconnected\n\n")