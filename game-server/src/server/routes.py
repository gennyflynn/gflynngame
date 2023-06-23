from typing import List
from uuid import uuid1

from .lobby.user import User

from .lobby.lobby import Lobby
from server.app import socketio
from flask_socketio import emit, join_room


lobbies = {}

@socketio.on("connect")
def handle_connect():
    emit("connected")
    print('\n\n\n client connected\n\n')


@socketio.on("disconnect")
def handle_disconnect():
    print("\n\ndisconnected\n\n")


@socketio.on("lobby/join")
def handle_join_lobby(sid, data):
    lobby_id = data['lobby_id']

    lobby = lobbies.get(lobby_id, None)

    if lobby:
        if lobby.is_full():
            emit("Unable to join lobby: max number of players.")
       
        lobby.add_user(User(
            sid=sid,
            name=data['name'],
            lobby_id=lobby_id
        ))
        
        join_room(lobby_id)

        emit('joined lobby: lobby_id')
    else:
        emit('could not join lobby: lobby does not exist.')


@socketio.on("lobby/create")
def handle_create_lobby(sid, data):
    lobby_id = uuid1()
    
    join_room(lobby_id)

    lobbies.update({
        lobby_id: Lobby(
            is_active=False,
            lobby_id=lobby_id,
            users=User(
                sid=sid,
                name=data['name'],
                lobby_id=lobby_id
            )
        )
    })

    emit('lobby_id: {lobby_id}')