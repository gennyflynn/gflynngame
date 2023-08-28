import React, { useContext } from 'react';
import { SocketContext } from './SocketContext';

export function ConnectionState() {
    const {socketConnected} = useContext(SocketContext)
    return <p>State: {'' + socketConnected}</p>
}