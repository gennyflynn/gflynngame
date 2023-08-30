from typing import List
from .enums import Vote

class VoteManager():
    votes: List[Vote]
    num_votes: int
    
    def __init__(self, num_votes: int):
        self.votes = []
        self.num_votes = num_votes

    def count_vote(self, vote: Vote):
        self.votes.append(vote)

        return self.vote_result()
    
    def vote_result(self):
        if len(self.votes) < self.num_votes:
            return None
        
        if self.votes.count(Vote.YES) > self.votes.count(Vote.NO):
            return Vote.YES
        else:
            return Vote.NO
    
    def reset(self):
        self.votes = []
        self.num_votes = 0

    def __str__(self):
        return f'VoteManager(num_votes={self.num_votes}, votes={self.votes})'