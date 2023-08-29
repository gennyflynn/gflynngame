import { useState, createContext } from "react";
import { PartyMembership, Role } from "./SecretHitler";

export type SecretHitlerContextType = {
    chancellor: string;
    partyMembership: PartyMembership | undefined;
    role: Role | undefined;
    hitler: string;
    fascists: string[];
    setChancellor: (chancellor: string) => void;
    setPartyMembership: (partyMembership: PartyMembership) => void;
    setRole: (role: Role) => void;
    setHitler: (hitler: string) => void;
    setFascists(fascists: string[]): void;
}

export const SecretHitlerContext = createContext<SecretHitlerContextType>({
    chancellor: "",
    partyMembership: undefined,
    role: undefined,
    hitler: "",
    fascists: [],
    setChancellor: () => {},
    setPartyMembership: () => {},
    setRole: () => {},
    setHitler: () => {},
    setFascists: () => {},
})

export function SecretHitlerContextProvider({children}: any) {
    const [ chancellor, setChancellor ] = useState("")
    const [ partyMembership, setPartyMembership ] = useState<PartyMembership | undefined>(undefined);
    const [ role, setRole ] = useState<Role | undefined>(undefined);
    const [ hitler, setHitler ] = useState("")
    const [fascists, setFascists] = useState<string[]>([])

    return (<SecretHitlerContext.Provider value={{
        chancellor,
        partyMembership,
        role,
        hitler,
        fascists,
        setChancellor,
        setPartyMembership,
        setRole,
        setHitler,
        setFascists
    }}>{children}</SecretHitlerContext.Provider>)
}