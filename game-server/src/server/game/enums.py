from enum import Enum

class PartyMembership(Enum):
    FASCIST = "fascist"
    LIBERAL = "liberal"

class SecretRole(PartyMembership):
    HITLER = "hitler"