import React, { useState, useEffect, useContext, useMemo } from "react";
// import { SocketContext } from './SocketContext';
import { GameContext } from "./GameContext";
import { SecretHitlerContext } from "./SecretHitlerContext";
import { Vote } from "./SecretHitler";
import { SocketContext } from "./SocketContext";
import { COLORS } from "../styles/colors";
import styled from "styled-components";


export default function Game(){
    // Might have to refactor into a Secret Hitler Context later. 
    const { name, usersInLobby, lobbyId } = useContext(GameContext);
    const { chancellor, role, hitler, partyMembership, fascists } = useContext(SecretHitlerContext);
    const { socket } = useContext(SocketContext);
    const [ president, setPresident ] = useState<string | undefined>(undefined)
    const [ result, setResult ] = useState<Vote | undefined>()
    const [ votes, setVotes ] = useState<Vote[]>([])

    function choosePresident(event: any){
        event.preventDefault()
        socket.emit("game/president/nominate", socket.id, {
            'lobbyId': lobbyId,
            'presidentialCandidate': event.target.presidentSelect.value
        })
        console.log(event.target.presidentSelect.value, " is president")
        
    }
    function voteForPresident(event: any){
        event.preventDefault()
        socket.emit("game/president/vote", socket.id, {
            'lobbyId': lobbyId,
            'vote': event.target.vote.value
        })
        console.log(event.target.vote.value, " is your vote")
    }

    useEffect(() => {
        socket.on("game/president/nominate", (data) => {
            setPresident(data.presidentialCandidate)
            console.log("recieved president candidate ", data.presidentialCandidate)
        })

        socket.on("game/president/pass", (data) => {
            setResult(data.votePassed)
            setVotes(data.votes)
        })
    }, [socket])

    
    const showPresidentSelect = useMemo(() => {
        return chancellor === name && president === undefined
    }, [chancellor, name, president])

    const showWaitingMessage = useMemo(() => {
        return chancellor !== name && president === undefined
    },[chancellor, name, president])

    const showVoteResult = useMemo(() => {
        return result !== undefined && votes.length === usersInLobby.length
    }, [result, usersInLobby.length, votes.length])

    const showVote = useMemo(() => {
        return president !== undefined && !showVoteResult
    }, [president, showVoteResult])

    const votePassed = useMemo(() => {
        return result === Vote.Yes
    },[result])


    return (
        <div>
          <h3>Game</h3>
          <div>Chancellor - {chancellor}</div>
          <div>President - {president}</div>
          <div>Party Membership - {partyMembership}</div>
          <div>Role - {role}</div>
          <div>Hitler - {hitler}</div>
          <div>Fascists - {fascists}</div>
      
            {/* Refactor the following part into a separate component */}
            {showPresidentSelect && (
                <form onSubmit={choosePresident}>
                <select id='presidentSelect' name="presidentSelect">
                    {usersInLobby.filter(user => user !== name).map(user => (
                    <option key={user} value={user}>{user}</option>
                    ))}
                </select>
                <button type="submit">Choose President</button>
                </form>
            ) }{showWaitingMessage && (
                <div>Waiting for {chancellor} to choose a president.</div>
            )}
            {showVote && (
                <div>
                    <div>Vote For President {president}</div>
                    <form onSubmit={voteForPresident}>
                        <input type="radio" id="yes" name="vote" value={Vote.Yes} />
                        <label htmlFor="yes">Yes</label>              
                        <input type="radio" id="no" name="vote" value={Vote.No} />
                        <label htmlFor="no">No</label>
                    <button type="submit">Vote</button>
                    </form>
                </div>
            )}
            {showVoteResult && (
                <div>
                    <div>Vote <VoteSpan pass={votePassed}>{votePassed ? "Passed" : "Failed"}</VoteSpan> </div>
                    {votePassed && <h3>{president} is now president</h3>}
                    <div>
                        Votes:{" "}
                        {votes.map((vote) => (
                            <VoteSpan pass={vote === Vote.Yes}>
                                {vote}
                            </VoteSpan>
                        ))}
                    </div>
                </div>
            )}
            </div>
      );
}

const VoteSpan = styled.span<{pass: boolean}>`
    color:${({ pass }) => pass? COLORS.Green1 : COLORS.Red1};
`


/** Functionally what are the steps to a secret hitler game?
 * 
 * One person who is chancellor selects a presidental candidate.
 * Everyone votes on said candidate.
 * Chancellor picks 3 cards from the deck.
 * Chancellor discards one card.
 * President picks one card to discard.
 * Remaining card is played.
 * Next Chancellor is selected + the rounds continue.
 * 
 * There are special rules too but I don't remember them. lol. 
 */