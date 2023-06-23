import React, { useState } from "react";
import styled from "styled-components";
import { socket } from "../Socket/socket";

export default function Home() {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const gameTitle = "game-anon"

    function joinLobby(event: any) {
        event.preventDefault()
        // setIsLoading(true);

        // hmm can emit like a real time anonymous voting platform
        socket.emit("lobby/create", socket.id, {'name': 'genny'})
        
    }

    return (
        <HomeWrapper>
            <Title>{gameTitle}</Title>
            <form onSubmit={joinLobby}>
                <input type="text" onChange={ e => setName(e.target.value)} placeholder="Enter your name"></input>
                <input type="text" onChange={ e => setRoomId(e.target.value)} placeholder="Lobby ID"></input>
                <button type="submit" disabled={isLoading}>Submit</button>
            </form>
        </HomeWrapper>
    )
}


const HomeWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const Title = styled.div``;