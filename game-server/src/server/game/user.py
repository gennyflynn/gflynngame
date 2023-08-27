from dataclasses import dataclass
from typing import Optional
import uuid
from .player_profile import PlayerProfile

@dataclass
class User:
    sid: str
    name: str
    profile = Optional[PlayerProfile]

    
    def __str__(self) -> str:
        return f"User(sid={self.sid}, name={self.name}, profile={self.profile})"