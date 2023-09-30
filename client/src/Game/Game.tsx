import React, { useState, useEffect, useContext, useMemo } from "react";
// import { SocketContext } from './SocketContext';
import { GameContext } from "./GameContext";
import { SecretHitlerContext } from "./SecretHitlerContext";
import { SocketContext } from "./SocketContext";
// import { COLORS } from "../styles/colors";
// import styled from "styled-components";
import { VoteContainer } from "./Vote";
import { Vote } from "./SecretHitler";

enum GameState {
    PassPresidentCandidacy = "PassPresidentCandidacy",
    ChancellorNominate = "ChancellorNominate",
    GovernmentVote = "GovernmentVote",
    PresidentSelect = "PresidentSelect",
    LegislativeSession = "LegislativeSession"
}


export default function Game(){
    // Might have to refactor into a Secret Hitler Context later. 
    const { name, usersInLobby, lobbyId } = useContext(GameContext);
    const { chancellor, role, hitler, partyMembership, fascists, president, setPresident } = useContext(SecretHitlerContext);
    const { socket } = useContext(SocketContext);
    const [ result, setResult ] = useState<Vote | undefined>()
    const [ votes, setVotes ] = useState<Vote[]>([])
    const [gameState, setGameState] = useState<GameState>(GameState.PassPresidentCandidacy)

    function choosePresident(event: any){
        event.preventDefault()
        socket.emit("game/president/nominate", socket.id, {
            'lobbyId': lobbyId,
            'presidentialCandidate': event.target.presidentSelect.value
        })
        console.log(event.target.presidentSelect.value, " is president")
        
    }

    useEffect(() => {
        socket.on("game/president/nominate", (data) => {
            setPresident(data.presidentialCandidate)
            console.log("recieved president candidate ", data.presidentialCandidate)
            setGameState(GameState.ChancellorNominate)
        })

        socket.on("game/president/pass", (data) => {
            console.log('recieved president pass', data)
            setResult(data.votePassed)
            setVotes(data.votes)
        })
    }, [setPresident, socket])



    return (
        <div>
          <h3>Game</h3>
          <div>{name}</div>
          <div>Chancellor - {chancellor}</div>
          <div>President - {president}</div>
          <div>Party Membership - {partyMembership}</div>
          <div>Role - {role}</div>
          <div>Hitler - {hitler}</div>
          <div>Fascists - {fascists}</div>

            {gameState === GameState.PassPresidentCandidacy && <PresidentSelect onSubmit={choosePresident} usersInLobby={usersInLobby} name={name} chancellor={chancellor}></PresidentSelect>}
            {gameState === GameState.ChancellorNominate && <VoteContainer votes={votes} result={result}/>}
            

        </div>
      );
}


type SelectProps = {
    onSubmit: (event: any) => void, 
    usersInLobby: string[],
    name: string, 
    chancellor: string
}


function PresidentSelect({onSubmit, usersInLobby, name, chancellor}: SelectProps){
    return (
        <div>
            {name === chancellor ? (
            <form onSubmit={onSubmit}>
            <select id='presidentSelect' name="presidentSelect">
                {usersInLobby.filter(user => user !== name).map(user => (
                <option key={user} value={user}>{user}</option>
                ))}
            </select>
            <button type="submit">Choose President</button>
            </form>) : <div>Waiting for {chancellor} to choose a president.</div>}
        </div>
    )            
}