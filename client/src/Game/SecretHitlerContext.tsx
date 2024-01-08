import { useState, createContext } from "react";
import { GameState, PartyMembership, Role } from "./SecretHitler";

export type SecretHitlerContextType = {
    chancellor: string;
    president: string;
    partyMembership: PartyMembership | undefined;
    role: Role | undefined;
    hitler: string;
    fascists: string[];
    gameState: GameState,
    policies: PartyMembership[],
    setChancellor: (chancellor: string) => void;
    setPresident: (president: string) => void;
    setPartyMembership: (partyMembership: PartyMembership) => void;
    setRole: (role: Role) => void;
    setHitler: (hitler: string) => void;
    setFascists(fascists: string[]): void;
    setGameState(state: GameState): void;
    setPolicies(policies: PartyMembership[]): void;
}

export const SecretHitlerContext = createContext<SecretHitlerContextType>({
    chancellor: "",
    president: "",
    partyMembership: undefined,
    role: undefined,
    hitler: "",
    fascists: [],
    gameState: GameState.PassPresidentCandidacy,
    policies: [],
    setChancellor: () => {},
    setPresident: () => {},
    setPartyMembership: () => {},
    setRole: () => {},
    setHitler: () => {},
    setFascists: () => {},
    setGameState: () => {},
    setPolicies: () => {},
})

export function SecretHitlerContextProvider({children}: any) {
    const [ chancellor, setChancellor ] = useState("")
    const [ president, setPresident ] = useState<string>("")
    const [ partyMembership, setPartyMembership ] = useState<PartyMembership | undefined>(undefined)
    const [ role, setRole ] = useState<Role | undefined>(undefined)
    const [ hitler, setHitler ] = useState("")
    const [ fascists, setFascists ] = useState<string[]>([])
    const [ gameState, setGameState ] = useState<GameState>(GameState.PassPresidentCandidacy)
    const [ policies, setPolicies ] = useState<PartyMembership[]>([])

    return (<SecretHitlerContext.Provider value={{
        chancellor,
        president,
        partyMembership,
        role,
        hitler,
        fascists,
        gameState,
        policies,
        setChancellor,
        setPresident,
        setPartyMembership,
        setRole,
        setHitler,
        setFascists,
        setGameState,
        setPolicies
    }}>{children}</SecretHitlerContext.Provider>)
}

