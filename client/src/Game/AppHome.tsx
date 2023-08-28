import React from "react";
import { SocketContextProvider } from "./SocketContext";
import { ConnectionState } from "./ConnectionState";
import { GameContextProvider } from "./GameContext";
import GameRouter from "./GameRouter";

export default function AppHome() {
    return (
    <div className="AppHome">
      <SocketContextProvider>
        <GameContextProvider>
          <GameRouter/>
          <ConnectionState />
        </GameContextProvider>
      </SocketContextProvider>
    </div>
    )
}