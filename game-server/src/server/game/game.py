from dataclasses import dataclass


@dataclass
class Game:
    num_players: int 
    num_liberals: int
    num_fascists: int
    num_liberal_cards: int
    num_fascist_cards: int

