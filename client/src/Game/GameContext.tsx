import { createContext, useState } from "react";

export type GameContextType = {
    lobbyId: string | null;
    inGame: boolean;
    setLobbyId: (lobbyId: string) => void;
    setInGame: (inGame: boolean) => void;
  };

export const GameContext = createContext<GameContextType>({
    lobbyId: null,
    inGame: false,
    setLobbyId: () => {},
    setInGame: () => {},
});

export function GameContextProvider({children}: any) {
    const [lobbyId, setLobbyId]= useState<string | null>(null);
    const [inGame, setInGame] = useState(false);

    return (
        <GameContext.Provider value={{lobbyId, setLobbyId, inGame, setInGame}}>
        {children}
        </GameContext.Provider>
    );
}