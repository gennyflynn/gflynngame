import React, { useContext } from "react";
import { SocketContext } from './SocketContext';
import { GameContext } from "./GameContext";

export default function Game(){
    const { socket } = useContext(SocketContext);
    const { lobbyId } = useContext(GameContext);
    
    function startGame() {
        socket.emit("game/start", socket.id, {'lobbyId': lobbyId})
    }
    return (
        <div>
            <title>Game</title>
            <button onClick={startGame}>Start Game</button>
        </div>
    )
}