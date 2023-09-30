import { useContext, useMemo, useState } from "react";
import { SocketContext } from "./SocketContext";
import { Vote } from "./SecretHitler";
import { GameContext } from "./GameContext";
import { SecretHitlerContext } from "./SecretHitlerContext";
import styled from "styled-components";
import { COLORS } from "../styles/colors";


type VoteContainerProps = {
    votes: Vote[];
    result: Vote | undefined;
}

enum VoteState {
    VoteForPresident = "VoteForPresident",
    VoteWait = "VoteWait",
    VoteResult = "VoteResult"
}

export function VoteContainer({votes, result}: VoteContainerProps) {
    const { socket } = useContext(SocketContext);
    const { lobbyId, usersInLobby } = useContext(GameContext);
    const { president } = useContext(SecretHitlerContext);
    const [ vote, setVote ] = useState<Vote | undefined>()
    const [ voteState, setVoteState ] = useState<VoteState>(VoteState.VoteForPresident)


    function voteForPresident(event: any){
        event.preventDefault()
        socket.emit("game/president/vote", socket.id, {
            'lobbyId': lobbyId,
            'vote': event.target.vote.value
        })
        setVote(event.target.vote.value)
        setVoteState(VoteState.VoteWait)
    }

    const votePassed = useMemo(() => {
        return result === Vote.Yes
    }, [result])

    return (
        <VoteContainerWrapper>
            {voteState === VoteState.VoteResult && (
                <div>
                    <div>Vote <VoteSpan pass={votePassed}>{votePassed ? "Passed" : "Failed"}</VoteSpan> </div>
                    {votePassed && <h3>{president} is now president</h3>}
                    <div>
                        Votes:{" "}
                        {votes.map((vote) => (
                            <VoteSpan pass={vote === Vote.Yes}>
                                {vote}
                            </VoteSpan>
                        ))}
                    </div>
                </div>
            )}            
            { voteState === VoteState.VoteWait &&  (
                <div>You voted: {vote}</div>
            )}
            {voteState === VoteState.VoteForPresident && ( 
            <div>
                <form onSubmit={voteForPresident}>
                    <input type="radio" id="yes" name="vote" value={Vote.Yes} />
                    <label htmlFor="yes">Yes</label>              
                    <input type="radio" id="no" name="vote" value={Vote.No} />
                    <label htmlFor="no">No</label>
                    <button type="submit">Vote</button>
                </form>
            </div>
            )}
        </VoteContainerWrapper>
    )
}

const VoteSpan = styled.span<{pass: boolean}>`
    color:${({ pass }) => pass? COLORS.Green1 : COLORS.Red1};
`

const VoteContainerWrapper = styled.div`
    display: flex;
`;