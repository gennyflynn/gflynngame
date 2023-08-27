from typing import Dict, List
from dataclasses import dataclass
from random import randint

from .game import Game
from .user import User
from .constants import (
    NUMBER_OF_LIBERALS_PER_GAME, 
    NUMBER_OF_FASCISTS_PER_GAME, 
    NUMBER_FASCIST_CARDS, 
    NUMBER_LIBERAL_CARDS
)
from .game_exceptions import GAME_EXCEPTIONS

import uuid

MIN_NUMBER_OF_PLAYERS = 5
MAX_NUMBER_OF_PLAYERS = 10


class Lobby:
    lobby_id: uuid
    users: Dict[str, User]
    is_active: bool
    game: Game

    def __init__(self, lobby_id: uuid):
        self.is_active = False
        self.lobby_id = lobby_id
        self.game = None
        self.users = {}


    def start_game(self):
        if len(self.users) < MIN_NUMBER_OF_PLAYERS:
            raise Exception(msg=GAME_EXCEPTIONS.NOT_ENOUGH_PLAYERS)
        
        self.game = Game(self.users)
        is_active = True
        return self.game
        
    def join_lobby(self, user: User):
        if self.is_full():
            raise Exception(msg=GAME_EXCEPTIONS.LOBBY_IS_FULL)
        if self.is_active:
            raise Exception(msg=GAME_EXCEPTIONS.ONGOING_GAME)

        self.users.update({user.sid: user})
    
    def is_full(self):
        return len(self.users) == MAX_NUMBER_OF_PLAYERS

    def __str__(self) -> str:
        return f"Lobby(lobby_id={self.lobby_id}, users={self.users}, is_active={self.is_active})"