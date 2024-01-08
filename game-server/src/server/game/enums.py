from enum import Enum

class PartyMembership(Enum):
    FASCIST = "Fascist"
    LIBERAL = "Liberal"

class SecretRole(Enum):
    HITLER = "hitler"
    FASCIST = PartyMembership.FASCIST.value
    LIBERAL = PartyMembership.LIBERAL.value

class Vote(Enum):
    YES = "Yes"
    NO = "No"