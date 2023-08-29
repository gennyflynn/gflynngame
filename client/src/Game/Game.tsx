import React, { useState, useEffect, useContext } from "react";
// import { SocketContext } from './SocketContext';
import { GameContext } from "./GameContext";
import { SecretHitlerContext } from "./SecretHitlerContext";


export default function Game(){
    // Might have to refactor into a Secret Hitler Context later. 
    const { name, usersInLobby } = useContext(GameContext);
    const { chancellor, role, hitler, partyMembership, fascists } = useContext(SecretHitlerContext);

    function choosePresident(event: any){
        event.preventDefault()
        // socket.emit("game/choosePresident", socket.id, {'name': name})
        console.log('president chosen is ... ', event.target.presidentSelect.value)
    }


    return (
        <div>
            <h3>Game</h3>
            <div>Chancellor - {chancellor}</div>
            <div>Party Membership - {partyMembership}</div>
            <div>Role - {role}</div>
            <div>Hitler - {hitler}</div>
            <div>Fascists - {fascists}</div>
            {chancellor === name ? (
                <form onSubmit={choosePresident}>
                    <select id='presidentSelect' name="presidentSelect">
                        {
                            usersInLobby.filter(user => user !== name).map(user => (
                                <option key={user} value={user}>{user}</option>
                            ))
                        }
                    </select>
                    <button type="submit">Choose President</button>
                </form>
            ): <div>Waiting for {chancellor} to choose a president.</div>}
        </div>
    )
}



/** Functionally what are the steps to a secret hitler game?
 * 
 * One person who is chancellor selects a presidental candidate.
 * Everyone votes on said candidate.
 * Chancellor picks 3 cards from the deck.
 * Chancellor discards one card.
 * President picks one card to discard.
 * Remaining card is played.
 * Next Chancellor is selected + the rounds continue.
 * 
 * There are special rules too but I don't remember them. lol. 
 */