import { useContext, useEffect } from "react";
import { GameContext } from "./GameContext";
import { SocketContext } from "./SocketContext";

export default function Lobby() {
    const { lobbyId, usersInLobby, setUsersInLobby } = useContext(GameContext);
    const {socket} = useContext(SocketContext);

    useEffect(() => {
        // lobby/join/user
        socket.on("lobby/join/user", (data) => {
            setUsersInLobby([...usersInLobby, data.newUserName]) 
        })

    }, [setUsersInLobby, socket, usersInLobby])

    return (
    <div>Lobby {lobbyId}
        <div>Players in Lobby</div>
        <ul>
            {usersInLobby.map((user) => (
                <li key={user}>{user}</li>
            ))}
        </ul>
    </div>
    )
}