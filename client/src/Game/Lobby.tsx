import { useContext, useEffect } from "react";
import { GameContext } from "./GameContext";
import { socket } from "../Socket/socket";

export default function Lobby() {
    const { lobbyId, usersInLobby, setUsersInLobby } = useContext(GameContext);

    useEffect(() => {
        socket.on("lobby/join/user", (data) => {
            setUsersInLobby([...usersInLobby, data.newUserName])
        })

    }, [setUsersInLobby, usersInLobby])

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