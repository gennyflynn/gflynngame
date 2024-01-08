import { useContext, useEffect, useMemo, useState } from "react";
import { SocketContext } from "./SocketContext";
import { GameState, Vote } from "./SecretHitler";
import { GameContext } from "./GameContext";
import { SecretHitlerContext } from "./SecretHitlerContext";
import styled from "styled-components";
import { COLORS } from "../styles/colors";

enum VoteState {
    VoteForPresident = "VoteForPresident",
    VoteWait = "VoteWait",
    VoteResult = "VoteResult"
}

export function VoteContainer({candidate}: {candidate: string}) {
    const { socket } = useContext(SocketContext);
    const { name, lobbyId } = useContext(GameContext);
    const { chancellor, setGameState, setPresident, setChancellor } = useContext(SecretHitlerContext);
    const [ vote, setVote ] = useState<Vote | undefined>()
    const [ voteState, setVoteState ] = useState<VoteState>(VoteState.VoteForPresident)
    const [ result, setResult ] = useState<Vote | undefined>()
    const [ votes, setVotes ] = useState<Vote[]>([])


    function voteForPresident(event: any){
        event.preventDefault()
        socket.emit("game/president/vote", socket.id, {
            'lobbyId': lobbyId,
            'vote': event.target.vote.value
        })
        setVote(event.target.vote.value)
        setVoteState(VoteState.VoteWait)
    }


    useEffect(() => {
        const changeGameState = (pass: boolean) => {
            setTimeout(() => {
                if (pass){
                    setGameState(GameState.LegislativeSession)
                    if (chancellor === name){
                        socket.emit("game/chancellor/cards", socket.id, {
                            'lobbyId': lobbyId,  
                        })
                    }
                } else {
                    // TODO: make this a function existing else where.
                    setChancellor("")
                    setPresident("")
                    if (chancellor === name) {
                        socket.emit("game/chancellor/new", socket.id, {
                            'lobbyId': lobbyId,
                        })
                    }
                    setGameState(GameState.PassPresidentCandidacy)
                    setVoteState(VoteState.VoteForPresident)
                }
            }, 7000)
        }

        const presidentPassListener = (data: any) => {
            console.log('recieved president pass', data)
            setPresident(candidate)
            setResult(data.votePassed)
            setVotes(data.votes) 
            setVoteState(VoteState.VoteResult)
            changeGameState(data.votePassed === Vote.Yes)
        }

        socket.on("game/president/pass", presidentPassListener)

        return () => {
            socket.off("game/president/pass")
        }
    }, [candidate, chancellor, lobbyId, name, setChancellor, setGameState, setPresident, socket])

    const votePassed = useMemo(() => {
        return result === Vote.Yes
    }, [result])

    return (
        <VoteContainerWrapper>
            {voteState === VoteState.VoteResult ? (
                <div>
                    <h4>Vote <VoteSpan pass={votePassed}>{votePassed ? "Passed" : "Failed"}</VoteSpan> </h4>
                    {votePassed && <h3>{candidate} is now president</h3>}
                    <div>
                        Votes:{" "}
                        {votes.map((vote) => (
                            <VoteSpan key={vote} pass={vote === Vote.Yes}>
                                {vote}
                            </VoteSpan>
                        ))}
                    </div>
                </div>
            ):            
            <div>
                <h4>Vote for {candidate}</h4>
                { voteState === VoteState.VoteWait &&  (
                    <div>You voted: {vote}</div>
                )}
                {voteState === VoteState.VoteForPresident && ( 
                
                    <form onSubmit={voteForPresident}>
                        <input type="radio" id="yes" name="vote" value={Vote.Yes} />
                        <label htmlFor="yes">Yes</label>              
                        <input type="radio" id="no" name="vote" value={Vote.No} />
                        <label htmlFor="no">No</label>
                        <button type="submit">Vote</button>
                    </form>
                )}
            </div>}
        </VoteContainerWrapper>
    )
}

const VoteSpan = styled.span<{pass: boolean}>`
    color:${({ pass }) => pass? COLORS.Green1 : COLORS.Red1};
`

const VoteContainerWrapper = styled.div`
    display: flex;
`;

