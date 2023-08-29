import { useContext, useEffect } from "react";
import { GameContext } from "./GameContext";
import { SocketContext } from "./SocketContext";
import styled from "styled-components";
import { COLORS } from "../styles/colors";
import { SecretHitlerContext } from "./SecretHitlerContext";

export default function Lobby() {
    const { lobbyId, usersInLobby, isGameCreator, name, setUsersInLobby, setInGame } = useContext(GameContext);
    const { socket } = useContext(SocketContext);
    const {setChancellor, setPartyMembership, setRole, setHitler, setFascists} = useContext(SecretHitlerContext);

    function startGame(){
        socket.emit("game/start", socket.id, {'lobbyId': lobbyId})
    }

    useEffect(() => {
        socket.on("lobby/join/user", (data) => {
            setUsersInLobby([...usersInLobby, data.newUserName]) 
        })

        socket.on("game/start", (data) => {
            setChancellor(data.chancellorCandidate)
            setPartyMembership(data.partyMembership)
            setRole(data.role)
            setHitler(data.hitler)
            setFascists(data.fascists)
            setInGame(true)
        })

        return () => {
            socket.off("lobby/join/user");
        };

    }, [socket, setUsersInLobby, usersInLobby, lobbyId, setInGame, setChancellor, setPartyMembership, setRole, setHitler, setFascists])

    return (
    <div>
        <h3>Lobby {lobbyId}</h3>
        <div>Players in Lobby</div>
        <ul>
            <LobbyListElement isUser={true} key={name}>{name}</LobbyListElement>
            {usersInLobby.filter(user => user !== name).map((user) => (
                <LobbyListElement isUser={user === name}key={user}>{user}</LobbyListElement>
            ))}
        </ul>
        {isGameCreator? <button onClick={startGame}>Start Game</button> : <div>Waiting for host to start game. </div>}
    </div>
    )
}

const LobbyListElement = styled.li<{isUser: boolean}>`
    color:${({isUser }) => isUser? COLORS.Blue1 : COLORS.Black1};
`
