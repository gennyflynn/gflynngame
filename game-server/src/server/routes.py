from typing import List
from uuid import uuid1

from .game.user import User

from .game.lobby import Lobby
from server.app import socketio
from flask_socketio import join_room
from server.extensions import lobby_manager
from .game.game_exceptions import GAME_EXCEPTIONS

@socketio.on("connect")
def handle_connect():
    socketio.emit("connected")
    print('\n\n\n client connected\n\n')


@socketio.on("disconnect")
def handle_disconnect():
    print("\n\ndisconnected\n\n")


@socketio.on("lobby/join")
def handle_join_lobby(sid, data):
    lobby_id = data['lobby_id']
    lobby = lobby_manager.get_lobby(lobby_id)

    if lobby:
        if lobby.is_full():
            socketio.emit(GAME_EXCEPTIONS.LOBBY_IS_FULL.value)

        if lobby.is_active:
            socketio.emit(GAME_EXCEPTIONS.ONGOING_GAME.value)

        join_room(lobby_id)
       
        lobby.join_lobby(User(
            sid=sid,
            name=data['name'],
        ))

        socketio.emit(event="lobby/join/success", data={"lobbyId": lobby_id})
    else:
        socketio.emit(GAME_EXCEPTIONS.LOBBY_NOT_FOUND.value)


@socketio.on("lobby/create")
def handle_create_lobby(sid, data):
    # refactor so that the lobby ID is returned from the lobby manager.
    lobby_id = uuid1()
    
    join_room(lobby_id)

    lobby = lobby_manager.create_lobby(str(lobby_id))

    lobby.join_lobby(User(
        sid=sid,
        name=data['name'],
    ))

    data = {
        "lobbyId": str(lobby_id),
    }
    socketio.emit(event="lobby/create/success", data=data)


@socketio.on("game/start")
def handle_start_game(sid, data):
    lobby_id = data['lobby_id']

    lobby = lobby_manager.get_lobby(lobby_id)

    lobby.start_game()

    socketio.emit("game/start/success", {"message":'started game...'}, room=lobby_id)
#     lobby = lobbies[data['lobby_id']]
#     lobby.start_game()
# would be nice to have an association
#  between the user and their lobby.
# can ask the lobby manager -> what lobby and game the user is in.
# For display purposes, we will want to have list of other users in the game. 