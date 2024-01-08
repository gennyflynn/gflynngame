from typing import List
from .enums import PartyMembership

class PolicyManager():
    policies: List[PartyMembership]
    
    def __init__(self):
        self.policies = []

    def pass_card(self, policy: PartyMembership):
        self.policies.append(policy)

        return self.game_over()
    
    def game_over(self):
        if self.policies.count(PartyMembership.FASCIST) == 5:
            return PartyMembership.FASCIST
        elif self.policies.count(PartyMembership.LIBERAL) == 5:
            return PartyMembership.LIBERAL
        
