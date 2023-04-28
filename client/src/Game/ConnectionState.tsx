import React from 'react';

export function ConnectionState({ isConnected }: {isConnected : any}) {
    return <p>State: {'' + isConnected}</p>
}