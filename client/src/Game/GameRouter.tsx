import { useContext, useMemo } from "react";
import { GameContext } from "./GameContext";
import Game from "./Game";
import Lobby from "./Lobby";
import Home from "./Home";
import { SecretHitlerContextProvider } from "./SecretHitlerContext";


export default function GameRouter() {
    const { lobbyId, inGame } = useContext(GameContext);

    const componentToShow = useMemo(() => {
        if (lobbyId && inGame) {
            return <Game />;
        } else if (lobbyId && !inGame) {
            return <Lobby />; 
        } else return <Home />;
    }, [lobbyId, inGame]);

    return ( 
        <SecretHitlerContextProvider>
            {componentToShow}
        </SecretHitlerContextProvider>)
    ;
}