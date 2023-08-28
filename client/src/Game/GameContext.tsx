import { createContext, useState } from "react";

/** TODO: 
 *    - add user name
 *    - add users in lobby
 */
export type GameContextType = {
    lobbyId: string | null;
    inGame: boolean;
    name: string;
    usersInLobby: string[];
    setLobbyId: (lobbyId: string) => void;
    setInGame: (inGame: boolean) => void;
    setName: (name: string) => void;
    setUsersInLobby: (users: string[]) => void;
  };

export const GameContext = createContext<GameContextType>({
    lobbyId: null,
    inGame: false,
    name: "",
    usersInLobby: [],
    setLobbyId: () => {},
    setInGame: () => {},
    setName: () => {},
    setUsersInLobby: () => {},
});

export function GameContextProvider({children}: any) {
    const [lobbyId, setLobbyId]= useState<string | null>(null);
    const [inGame, setInGame] = useState(false);
    const [name, setName] = useState("");
    const [usersInLobby, setUsersInLobby] = useState<string[]>([]);

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
            setUsersInLobby}}>
        {children}
        </GameContext.Provider>
    );
}