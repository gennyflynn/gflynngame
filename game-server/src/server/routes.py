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
    lobby_id = data['lobbyId']
    lobby = lobby_manager.get_lobby(lobby_id)

    if lobby:
        if lobby.is_full():
            socketio.emit(GAME_EXCEPTIONS.LOBBY_IS_FULL.value)

        if lobby.is_active:
            socketio.emit(GAME_EXCEPTIONS.ONGOING_GAME.value)
       
        lobby.join_lobby(User(
            sid=sid,
            name=data['name'],
        ))
        userJoindata = {
            "lobbyId": str(lobby_id),
            "usersInRoom": [user.name for _, user in lobby.users.items()]
        }
        roomJoinData = {
            "lobbyId": str(lobby_id),
            "newUserName": data['name'],
        }
        join_room(lobby_id)
        socketio.emit(event="lobby/join/success", data=userJoindata, to=sid)
        socketio.emit(event="lobby/join/user", data=roomJoinData, to=lobby_id)

        # when the lobby is joined, the user who joins needs a list of every one else in the lobby.
        # users in the room already need to be updated with the new user.
        # we should use their names and not IDs. 

    else:
        socketio.emit(event=GAME_EXCEPTIONS.LOBBY_NOT_FOUND.value, to=sid)


@socketio.on("lobby/create")
def handle_create_lobby(sid, data):
    # refactor so that the lobby ID is returned from the lobby manager.
    lobby_id = uuid1()

    lobby = lobby_manager.create_lobby(str(lobby_id))

    lobby.join_lobby(User(
        sid=sid,
        name=data['name'],
    ))
    join_room(lobby_id)

    socketio.emit(event="lobby/create/success", data={"lobbyId": str(lobby_id)}, to=sid)


@socketio.on("game/start")
def handle_start_game(sid, data):
    lobby_id = data['lobbyId']

    lobby = lobby_manager.get_lobby(lobby_id)

    lobby.start_game()

    socketio.emit("game/start/success", {"message":'started game...'}, room=lobby_id)
#     lobby = lobbies[data['lobby_id']]
#     lobby.start_game()
# would be nice to have an association
#  between the user and their lobby.
# can ask the lobby manager -> what lobby and game the user is in.
# For display purposes, we will want to have list of other users in the game. 


# need to add cleanup function for when a client disconnects to remove them 
# from the lobby and game. 