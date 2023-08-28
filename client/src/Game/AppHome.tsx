import React, { useState, useEffect } from "react";
import { socket } from "../Socket/socket";
import { ConnectionState } from "./ConnectionState";
import { GameContextProvider } from "./GameContext";
import GameRouter from "./GameRouter";

export default function AppHome() {
    const [isConnected, setIsConnected]: any = useState(socket.connected);
    
    function onConnect() {
      setIsConnected(true)
    }
  
    function onDisconnect(){
      setIsConnected(false)
    }
  
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    const useEffect = () => {
      socket.connect();
    }
    
    return (
    <div className="Game">
      <GameContextProvider>
        <GameRouter/>
        <ConnectionState isConnected={ isConnected } />
      </GameContextProvider>
    </div>
    )
}