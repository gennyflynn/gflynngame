from enum import Enum

class PartyMembership(Enum):
    FASCIST = "fascist"
    LIBERAL = "liberal"

class SecretRole(Enum):
    HITLER = "hitler"
    FASCIST = PartyMembership.FASCIST.value
    LIBERAL = PartyMembership.LIBERAL.value