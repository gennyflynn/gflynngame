import React, { useState } from "react";
import styled from "styled-components";
import { socket } from "../Socket/socket";

export default function Home() {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const gameTitle = "secret hitler"

    function joinLobby(event: any) {
        event.preventDefault()
        // setIsLoading(true);

        socket.emit("lobby/join", socket.id, {'lobby_id': roomId, 'name': name})
    }

    function createLobby(){
        // update so this reads the lobby ID from the response and sets it here. 
        socket.emit("lobby/create", socket.id, {'name': name})
    }

    function startGame(){
        socket.emit("game/start", socket.id, {'lobby_id': roomId})
    }

    return (
        <HomeWrapper>
            <Title>{gameTitle}</Title>
            <form onSubmit={joinLobby}>
                <input type="text" onChange={ e => setName(e.target.value)} placeholder="Enter your name"></input>
                <input type="text" onChange={ e => setRoomId(e.target.value)} placeholder="Lobby ID"></input>
                <button type="submit" disabled={isLoading}>Join Lobby</button>
            </form>
            <button onClick={createLobby}>Create Lobby</button>
            <button onClick={startGame}>Start Game</button>
        </HomeWrapper>
    )
}


const HomeWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Title = styled.div``;