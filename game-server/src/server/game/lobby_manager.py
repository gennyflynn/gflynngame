from typing import Dict
from uuid import UUID
from .lobby import Lobby
from .game_exceptions import GAME_EXCEPTIONS

class LobbyManager:
    lobbies: Dict[str, Lobby]

    def __init__(self):
        self.lobbies = {}
        print('Created lobby manager')

    def create_lobby(self, lobby_id: str):
        if self.get_lobby(lobby_id):
            raise Exception(msg=GAME_EXCEPTIONS.FAILED_TO_CREATE_LOBBY.value)
        lobby = Lobby(lobby_id=lobby_id)
        self.lobbies.update({lobby_id: lobby})
        return lobby
    
    def get_lobby(self, lobby_id: str):
        return self.lobbies.get(lobby_id, None)
    
    def __str__(self) -> str:
        return f"LobbyManager(lobbies={self.lobbies})"