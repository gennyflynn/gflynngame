from dataclasses import dataclass

from enums import PartyMembership
from enums import SecretRole

@dataclass
class Player:
    party_membership: PartyMembership
    role: SecretRole
