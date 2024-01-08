import React, { useState, useEffect, useContext } from "react";
// import { SocketContext } from './SocketContext';
import { GameContext } from "./GameContext";
import { SecretHitlerContext } from "./SecretHitlerContext";
import { SocketContext } from "./SocketContext";
// import { COLORS } from "../styles/colors";
// import styled from "styled-components";
import { VoteContainer } from "./Vote";
import { GameState } from "./SecretHitler";
import { CardSelector } from "./CardSelector";



export default function Game(){
    const { name, usersInLobby, lobbyId } = useContext(GameContext);
    const { chancellor, role, hitler, partyMembership, fascists, president, setPresident, gameState, setGameState, setChancellor, policies } = useContext(SecretHitlerContext);
    const { socket } = useContext(SocketContext);
    const [ candidate, setCandidate ] = useState("")

    function choosePresident(event: any){
        event.preventDefault()
        socket.emit("game/president/nominate", socket.id, {
            'lobbyId': lobbyId,
            'presidentialCandidate': event.target.presidentSelect.value
        })
        console.log(event.target.presidentSelect.value, " is president")
        
    }

    useEffect(() => {
        const presidentNominateListener = (data: any) => {
            console.log("recieved president candidate ", data.presidentialCandidate)
            setGameState(GameState.ChancellorNominate)
            setCandidate(data.presidentialCandidate)

        }
        const chancellorNewListener = (data: any) => {
            console.log('recieved chancellor', data.chancellor)
            setChancellor(data.chancellor)
            setCandidate("")
        }

        socket.on("game/president/nominate", presidentNominateListener)
        socket.on("game/chancellor/new", chancellorNewListener)

        return () => {
            socket.off("game/president/nominate")
            socket.off("game/chancellor/new")
        }

    }, [setChancellor, setGameState, setPresident, socket])


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
          {policies.length > 1 && (
            <div>Policies Passed: 
                {policies.map((policy, idx) => (<div key={idx}>{policy}</div>))}
            </div>
          )}

            {gameState === GameState.PassPresidentCandidacy && <PresidentSelect onSubmit={choosePresident} usersInLobby={usersInLobby} name={name} chancellor={chancellor}></PresidentSelect>}
            {gameState === GameState.ChancellorNominate && <VoteContainer candidate={candidate}/>}
            {gameState === GameState.LegislativeSession && <CardSelector/>}
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
