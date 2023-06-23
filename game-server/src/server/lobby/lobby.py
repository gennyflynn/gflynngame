from typing import List
from dataclasses import dataclass

from ..game.game import Game
from ..lobby.user import User
from .constants import (
    NUMBER_OF_LIBERALS_PER_GAME, 
    NUMBER_OF_FASCISTS_PER_GAME, 
    NUMBER_FASCIST_CARDS, 
    NUMBER_LIBERAL_CARDS
)

import uuid

MIN_NUMBER_OF_PLAYERS = 5
MAX_NUMBER_OF_PLAYERS = 10

@dataclass
class Lobby:
    is_active: bool
    lobby_id: uuid
    game: Game
    users: List[User]

    def start_game(self):
        if len(self.players) < MIN_NUMBER_OF_PLAYERS:
            raise Exception(msg="Not enough players to start game.")
        
        is_active = True
        
        game=game(
            num_players=len(self.player_ids),
            num_liberals=NUMBER_OF_LIBERALS_PER_GAME[len(self.player_ids)],
            num_fasiscts=NUMBER_OF_FASCISTS_PER_GAME[len(self.player_ids)],
            num_liberal_cards=NUMBER_LIBERAL_CARDS,
            num_fascist_cards=NUMBER_FASCIST_CARDS,
        )

    def join_lobby(self, player_id: str):
        if len(self.player_ids) == MAX_NUMBER_OF_PLAYERS:
            raise Exception(msg="This lobby is full. Please try a different lobby ID.")

        self.player_ids.append(player_id)
    
    def is_full(self):
        return len(self.player) == MAX_NUMBER_OF_PLAYERS

    def add_user(self, user: User):
        self.users.append(user)