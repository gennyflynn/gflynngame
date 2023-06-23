import React, { useEffect, useState } from "react";
import { socket } from "../Socket/socket";
import { ConnectionManager } from "./ConnectionManager";
import { ConnectionState } from "./ConnectionState";
import { Events } from "./Event";
import Home from "./Home";

export default function Game() {
    const [isConnected, setIsConnected]: any = useState(socket.connected);
    const [fooEvents, setFooEvents]: any = useState([]);
    
    useEffect(() => {
      function onConnect() {
        setIsConnected(true)
      }
  
      function onDisconnect(){
        setIsConnected(false)
      }
  
      function onFooEvent(value: any) {
        setFooEvents((previous: any) => [...previous, value])
      }
  
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('foo', onFooEvent);
  
      return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off('foo', onFooEvent);
      };
    }, []);
    return (
    <div className="Game">
        <Home></Home>
        <ConnectionState isConnected={ isConnected } />
        <Events events={ fooEvents } />
        <ConnectionManager />
    </div>
    )
}