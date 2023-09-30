import React from "react";
import { SocketContextProvider } from "./SocketContext";
import { ConnectionState } from "./ConnectionState";
import { GameContextProvider } from "./GameContext";
import GameRouter from "./GameRouter";
import styled from "styled-components";

export default function AppHome() {
    return (
    <Home className="AppHome">
      <SocketContextProvider>
        <GameContextProvider>
          <h2>Secret Assassin</h2>
          <GameRouter/>
          <ConnectionState />
        </GameContextProvider>
      </SocketContextProvider>
    </Home>
    )
}

const Home = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;