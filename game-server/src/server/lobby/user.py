from dataclasses import dataclass
import uuid

@dataclass
class User: 
    sid: str
    name: str
    lobby_id: uuid

