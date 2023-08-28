import { useContext, useMemo } from "react";
import { GameContext } from "./GameContext";
import Game from "./AppHome";
import Lobby from "./Lobby";
import Home from "./Home";

export default function GameRouter() {
    const { lobbyId, inGame } = useContext(GameContext);

    const componentToShow = useMemo(() => {
        if (lobbyId && inGame) {
            return <Game />;
        } else if (lobbyId && !inGame) {
            return <Lobby />; 
        } else return <Home />;
    }, [lobbyId, inGame]);

    return componentToShow;
}