from .game.user import User
from .game.lobby_manager import LobbyManager

lobby_manager = LobbyManager()

# # create a dumb lobby for now while I test.
# lobby = lobby_manager.create_lobby()


# lobby.join_lobby(User(
#     sid="1",
#     name="1",  
# ))