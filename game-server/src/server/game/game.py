from dataclasses import dataclass
from random import randint, shuffle
from typing import List, Dict, Iterator
from .vote_manager import VoteManager
from .player_profile import PlayerProfile
from .user import User
from .enums import PartyMembership, SecretRole, Vote

from .constants import (
    NUMBER_OF_LIBERALS_PER_GAME, 
    NUMBER_OF_FASCISTS_PER_GAME, 
    NUMBER_FASCIST_CARDS, 
    NUMBER_LIBERAL_CARDS
)


class Game:
    users: Dict[str, User]
    cards: List[PartyMembership]
    card_iter: Iterator
    chancellor_candidate_iter: Iterator
    hitler_user_id: str
    fascists_user_ids: List[str]
    vote_manager: VoteManager
    chancellor_user_id: str
    president_user_id: str

    def __init__(self, users: Dict[str, User]):
        # Setup the random cards.
        self.cards = [
            PartyMembership.FASCIST
            for i in range(11)
        ]
        self.cards.extend([
            PartyMembership.LIBERAL
            for i in range(6)
        ])

        shuffle(self.cards)
        self.card_iter = iter(self.cards)

        # Assign roles, hitler, and start chancellor rotation.
        self.users = users
        self.chancellor_candidate_iter = iter(self.users.keys())

        self.assign_roles()

        self.vote_manager = VoteManager(len(self.users))


    def pick_a_card(self) -> PartyMembership:
        card = next(self.card_iter, None)

        if card is None:
            return self.reset_cards()
        return card
    

    def assign_roles(self):
        num_players = len(self.users)
        num_liberals = NUMBER_OF_LIBERALS_PER_GAME[num_players]
        user_ids = list(self.users.keys())
        shuffle(user_ids)

        for id in user_ids[:num_liberals]:
            user = self.users[id]
            user.profile = PlayerProfile(
                party_membership=PartyMembership.LIBERAL,
                role=SecretRole.LIBERAL
            )

        self.fascists_user_ids = []

        for id in user_ids[num_liberals:]:
            user = self.users[id]
            user.profile = PlayerProfile(
                party_membership=PartyMembership.FASCIST,
                role=SecretRole.FASCIST
            ) 
            self.fascists_user_ids.append(id)

        # Remove Hitler from list.
        self.fascists_user_ids.pop()
        self.users[user_ids[-1]].profile = PlayerProfile(
            party_membership=PartyMembership.FASCIST,
            role=SecretRole.HITLER
        )
        self.hitler_user_id = user_ids[-1]

    def random_party(self):
        party = randint(1, 2)
        if party == 1:
            return PartyMembership.LIBERAL
        else:
            return PartyMembership.FASCIST
    

    def reset_cards(self):
        shuffle(self.cards)
        self.card_iter = iter(self.cards)
        return next(self.card_iter)

    
    def chancellor_candidate(self):
        candidate = next(self.chancellor_candidate_iter, None)
        self.chancellor_user_id = candidate

        if candidate is None:
            self.chancellor_candidate_iter = iter(self.users.keys())
            return self.users[next(self.chancellor_candidate_iter)]
        
        return self.users[candidate]
    
    
    def vote(self, vote: Vote):
        return self.vote_manager.count_vote(vote)
    
    
    def reset_vote(self):
        self.vote_manager.reset()

    def set_president(self, user_name: str):
        # breakpoint()
        for user in self.users.values():
            if user.name == user_name: 
                self.president_user_id = user.sid
                return user.sid
            

