from enum import Enum, auto

class GAME_EXCEPTIONS(Enum):
    LOBBY_IS_FULL = "lobby_is_full"
    LOBBY_NOT_FOUND = "lobby_not_found"
    NOT_ENOUGH_PLAYERS = "not_enough_players"
    ONGOING_GAME = "ongoing_game"
    FAILED_TO_CREATE_LOBBY = "failed_to_create_lobby"