from dataclasses import dataclass

from .enums import PartyMembership
from .enums import SecretRole

@dataclass
class PlayerProfile():
    party_membership: PartyMembership
    role: SecretRole
