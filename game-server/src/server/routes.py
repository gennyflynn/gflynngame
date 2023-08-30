from typing import List, Optional
from uuid import uuid1

from .game.enums import PartyMembership, SecretRole, Vote

from .game.user import User

from .game.lobby import Lobby
from server.app import socketio
from flask_socketio import join_room, send
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
        # workaround because it doesnt seem to be possible to emit to all users in a room
        for sid in lobby.users.keys():
            socketio.emit(event="lobby/join/user", data=roomJoinData, to=sid)

        # when the lobby is joined, the user who joins needs a list of every one else in the lobby.
        # users in the room already need to be updated with the new user.
        # we should use their names and not IDs. 

    else:
        socketio.emit(event=GAME_EXCEPTIONS.LOBBY_NOT_FOUND.value, to=sid)


@socketio.on("lobby/create")
def handle_create_lobby(sid, data):
    # refactor so that the lobby ID is returned from the lobby manager.
    lobby = lobby_manager.create_lobby()
    lobby.join_lobby(User(
        sid=sid,
        name=data['name'],
    ))
    join_room(lobby.lobby_id)
    socketio.emit(event="lobby/create/success", data={"lobbyId": lobby.lobby_id}, to=sid)

@socketio.on("game/start")
def handle_start_game(sid, data):
    lobby_id = data['lobbyId']
    lobby = lobby_manager.get_lobby(lobby_id)
    game = lobby.start_game()
    chancellor_candidate = game.chancellor_candidate().name

    for user in game.users.values():
        hitler = (
            game.users[game.hitler_user_id].name 
            if user.profile.party_membership is PartyMembership.FASCIST 
            else ""
        )
        
        send_fascist_info = user.profile.party_membership is PartyMembership.FASCIST and user.profile.role is SecretRole.FASCIST  
        fascists = [ game.users[id].name for id in game.fascists_user_ids ] if send_fascist_info else []

        resp = {
            "partyMembership": user.profile.party_membership.value,
            "role": user.profile.role.value,
            "chancellorCandidate": chancellor_candidate,
            "hitler": hitler,
            "fascists": fascists
        }
        socketio.emit(event="game/start", data=resp, to=user.sid)


@socketio.on("game/president/nominate")
def handle_nominate(sid, data):
    lobby_id = data['lobbyId']
    lobby = lobby_manager.get_lobby(lobby_id)

    if lobby:
        # This is where I would emit to the entire room but I cannot.
        for user in lobby.users.values():
            # Emit back to users which candidate was nominated.
            socketio.emit(event="game/president/nominate", data=data, to=user.sid)


@socketio.on("game/president/vote")
def handle_vote(sid, data):
    lobby_id = data['lobbyId']
    game = lobby_manager.get_lobby(lobby_id).game
    vote = data['vote']
    vote = Vote(str(vote))
    result = game.vote(vote)

    print(game.vote_manager)

    if result:
        # we can also just be smart on the server and know when the vote is over,
        for sid in game.users.keys():
            socketio.emit('game/vote/pass', data={"votePassed": result.value}, to=sid)

            if result is Vote.YES:
                print("vote passed!")
            else:
                print("vote failed.")
            print(game.vote_manager)
        
        game.reset_vote()


@socketio.on("game/chancellor/cards")
def chancellor_cards(sid, data):
    lobby_id = data['lobbyId']
    game = lobby_manager.get_lobby(lobby_id).game 

    # randomly selected cards to only go to the user who is chancellor.
    cards = [game.pick_a_card().value for _ in range(3)]

    socketio.emit("game/chancellor/cards", data={"cards": cards}, to=sid)


@socketio.on("game/president/card")
def president_card_pick():
    pass


"""


VoteTracker():
    liberal_cards_passed = 0
    fascist_cards_passed = 0

    def pass_card(card: PartyMembership):
        if card == ParyMembership.LIBERAL:
            liberal_cards_passed += 1
        else:
            fascist_cards_passed += 1


    def winner() -> Optional[PartyMembership]:
        if liberal_cards_passed == 5:
            return PartyMemberShip.LIBERAL
        elif fascist_cards_passed == 6:
            return PartyMemberShip.FASCIST

        return None
    


"""

# @socketio.on("join")
# def handle_start_game(sid, data: Optional[any]):
#     if data:
#         print(f'\n\n\n\n join data: {data}\n\n\n\n')
#     lobby = lobbies[data['lobby_id']]
#     lobby.start_game()
# would be nice to have an association
#  between the user and their lobby.
# can ask the lobby manager -> what lobby and game the user is in.
# For display purposes, we will want to have list of other users in the game. 


# need to add cleanup function for when a client disconnects to remove them 
# from the lobby and game. 


"""
Some response design ideas:

General Game State:
    resp = {
        party_membership: PartyMembership
        role: SecretRole
        chancellor: bool
        # Chancellor candidate will be empty always. 
        # We can define this is always send back the response.
        chancellor_candidate: bool
    }

On Card Selection
resp = {
    // This will be a list of 3
    cards: [
        PartyMembership
    ], 
}
"""