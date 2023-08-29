import { createContext, useState } from "react";

/** TODO: 
 *    - add user name
 *    - add users in lobby
 *    - rename to lobby context
 */
export type GameContextType = {
    lobbyId: string | null;
    inGame: boolean;
    name: string;
    usersInLobby: string[];
    isGameCreator: boolean;
    setLobbyId: (lobbyId: string) => void;
    setInGame: (inGame: boolean) => void;
    setName: (name: string) => void;
    setUsersInLobby: (users: string[]) => void;
    setIsGameCreator: (isGameCreator: boolean) => void;
  };

export const GameContext = createContext<GameContextType>({
    lobbyId: null,
    inGame: false,
    name: "",
    usersInLobby: [],
    isGameCreator: false,
    setLobbyId: () => {},
    setInGame: () => {},
    setName: () => {},
    setUsersInLobby: () => {},
    setIsGameCreator: () => {},
});

export function GameContextProvider({children}: any) {
    const [lobbyId, setLobbyId]= useState<string | null>(null);
    const [inGame, setInGame] = useState(false);
    const [name, setName] = useState("");
    const [usersInLobby, setUsersInLobby] = useState<string[]>([]);
    const [isGameCreator, setIsGameCreator] = useState(false);

    return (
        <GameContext.Provider 
        value={{
            lobbyId, 
            setLobbyId, 
            inGame, 
            setInGame, 
            name, 
            setName, 
            usersInLobby, 
            setUsersInLobby,
            isGameCreator,
            setIsGameCreator}}>
        {children}
        </GameContext.Provider>
    );
}