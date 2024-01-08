import React, { useState, useEffect, useContext, useMemo } from "react";
import { GameContext } from "./GameContext";
import { SecretHitlerContext } from "./SecretHitlerContext";
import { SocketContext } from "./SocketContext";
import styled from "styled-components";
import { PartyMembership } from "./SecretHitler";
// import { COLORS } from "../styles/colors";

enum SelectorState {
    ChancellorDiscard = "ChancellorDiscard",
    PresidentSelect = "PresidentSelect",
    PresidentWaiting = "PresidentWaiting",
    CardPassed = "CardPassed",
    Waiting = "Waiting"
}


export function CardSelector() {
    const { socket } = useContext(SocketContext);
    const { chancellor, president } = useContext(SecretHitlerContext)
    const { name, lobbyId } = useContext(GameContext)
    const [ cards, setCards ] = useState<PartyMembership[]>([])
    const [ passedCard, setPassedCard ] = useState('')

    const [selectorState, setSelectorState] = useState<SelectorState>( 
        name === chancellor ? 
        SelectorState.ChancellorDiscard 
        : name === president ? 
        SelectorState.PresidentWaiting 
        : SelectorState.Waiting
    )

    function cardSelect(event: any) {
        event.preventDefault()
        const cardIdx = event.target.card.value

        cards.splice(cardIdx, 1)
        socket.emit(
            "game/chancellor/cards/discard", 
            socket.id, 
            {
                'lobbyId': lobbyId, 
                'cards': cards
            })
        
        setSelectorState(SelectorState.Waiting)
    }

    function cardPass(event: any) {
        event.preventDefault()
        const cardIdx = event.target.card.value

        socket.emit("game/president/cards/pass", socket.id, {'lobbyId': lobbyId, "card": cards[cardIdx]})

        console.log(cards[event.target.card.value])
    }

    useEffect(() => {
        const presidentCardsListener = (data: any) => {
            console.log('president cards', data)
            setCards(data.cards)
            setSelectorState(SelectorState.PresidentSelect)
        }
        const chancellorCardsListener = (data: any) => {
            console.log('chancellor cards', data)
            setCards(data.cards)
        }
        const cardPassListenter = (data: any) => {
            console.log('card to pass', data.card)
            setPassedCard(data.card)
            setSelectorState(SelectorState.CardPassed)
        }
        socket.on("game/president/cards", presidentCardsListener)
        socket.on("game/chancellor/cards", chancellorCardsListener)
        socket.on("game/president/cards/pass", cardPassListenter)
        return () => {
            socket.off("game/president/cards")
            socket.off("game/chancellor/cards")
            socket.off("game/president/cards/pass")
        }
    })

    return (
        <CardSelectContainer>
            {selectorState === SelectorState.ChancellorDiscard && (
                <form onSubmit={cardSelect}>
                    <h4>Select a Card to Discard</h4>
                    {cards.map((card, idx) => (
                        <div>
                            <input type="radio" id={`${idx}`} name="card" value={idx}></input>
                            <label htmlFor={card}>{card}</label>
                        </div>
                    ))}
                    <button type="submit">Discard</button>
                </form>
            )}
            {selectorState === SelectorState.PresidentWaiting && (
                <div>Waiting for cards from chancellor.</div>
            )}

            {selectorState === SelectorState.PresidentSelect && (
                <div>
                    <form onSubmit={cardPass}>
                    <h4>Select a Card to Pass</h4>
                    {cards.map((card, idx) => (
                        <div>
                            <input type="radio" id={`${idx}`} name="card" value={idx}></input>
                            <label htmlFor={card}>{card}</label>
                        </div>
                    ))}
                    <button type="submit">Pass</button>
                    </form>
                </div>
            )}

            {(selectorState === SelectorState.Waiting) && (
                <div>Waiting</div>
            )}

            {(selectorState === SelectorState.CardPassed && (
                <div>Card passed {passedCard}</div>
            )
            )}

        </CardSelectContainer>
        
    )
}

const CardSelectContainer = styled.div`
    display:flex
`;