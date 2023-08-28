import { createContext, useEffect, useState } from 'react';
import {io, Socket} from 'socket.io-client'

const URL = "http://localhost:5000";

export const socket = io(URL);

export type SocketContextType = {
    socket: Socket;
    socketConnected: boolean;
    setSocketConnected: (socketConnected: boolean) => void;
}

export const SocketContext = createContext<SocketContextType>({
    socket: socket,
    socketConnected: false,
    setSocketConnected: () => {}
});

export const SocketContextProvider = ({children}: any) => {
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {
            setSocketConnected(true);
        });
        socket.on('disconnect', () => {
            setSocketConnected(false);
        });
        socket.connect()
        return () => {
            // Cleanup socket connection.
            socket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={{socket, socketConnected, setSocketConnected}}>{children}</SocketContext.Provider>
}