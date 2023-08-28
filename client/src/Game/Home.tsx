import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { socket } from "../Socket/socket";
import { GameContext } from "./GameContext";

export type LobbyType = {
    lobbyId: string,
}

export default function Home() {
    const [roomId, setRoomId] = useState("");
    const { name, setName, setLobbyId, usersInLobby, setUsersInLobby } = useContext(GameContext);
    
    const gameTitle = "secret hitler"

    function joinLobby(event: any) {
        event.preventDefault()
        socket.emit("lobby/join", socket.id, {'lobbyId': roomId, 'name': name})
    }

    function createLobby(){
        // Update so this reads the lobby ID from the response and sets it here. 
        socket.emit("lobby/create", socket.id, {'name': name})
    }

    function startGame(){
        socket.emit("game/start", socket.id, {'lobbyId': roomId})
    }

    useEffect(() => {
        socket.on("lobby/join/success", (data) => {
            setUsersInLobby(data.usersInRoom)
            setLobbyId(data.lobbyId)
        })
        socket.on("lobby/create/success", (data) => {
            setUsersInLobby([name])
            setLobbyId(data.lobbyId)
        })
        return () => {
            // This will clean up the component when it unmounts.
            socket.off("lobby/join/success");
            socket.off("lobby/create/success");
        };
    }, [name, setLobbyId, setUsersInLobby])

    // TODO: add form validation. 
    return (
        <HomeWrapper>
            <Title>{gameTitle}</Title>
            <form onSubmit={joinLobby}>
                <input type="text" onChange={ e => setName(e.target.value)} placeholder="Enter your name"></input>
                <input type="text" onChange={ e => setRoomId(e.target.value)} placeholder="Lobby ID"></input>
                <button type="submit">Join Lobby</button>
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