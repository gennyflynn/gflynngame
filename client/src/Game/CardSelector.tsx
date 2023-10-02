import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "./GameContext";
import { SecretHitlerContext } from "./SecretHitlerContext";
import { SocketContext } from "./SocketContext";
import styled from "styled-components";
import { PartyMembership } from "./SecretHitler";
// import { COLORS } from "../styles/colors";



export function CardSelector() {
    const { socket } = useContext(SocketContext);
    const { chancellor, president } = useContext(SecretHitlerContext)
    const { name } = useContext(GameContext)
    const [ cards, setCards ] = useState<PartyMembership[]>([])


    function cardSelect(event: any) {
        event.preventDefault()
    }

    useEffect(() => {
        const presidentCardsListener = (data: any) => {
            console.log('president cards', data)
            setCards(data.cards)
        }
        const chancellorCardsListener = (data: any) => {
            console.log('chancellor cards', data)
            setCards(data.cards)
        }
        socket.on("game/president/cards", presidentCardsListener)
        socket.on("game/chancellor/cards", chancellorCardsListener)
        return () => {
            socket.off("game/president/cards")
            socket.off("game/chancellor/cards")
        }
    })

    return (
        <CardSelectContainer>
            {name === chancellor ? (
                <form onSubmit={cardSelect}>
                    <h4>Select a Card to Discard</h4>
                    {cards.map(card => (
                        <div>
                            <input type="radio" id={card} name="card" value={card}></input>
                            <label htmlFor={card}>{card}</label>
                        </div>
                    ))}
                    <button type="submit">Discard</button>
                </form>
            ): <div>Chancellor is picking cards.</div>}
            {name === president && (
                <div>President Cards: {cards}</div>
            )}
        </CardSelectContainer>
        
    )
}

const CardSelectContainer = styled.div`
    display:flex
`;