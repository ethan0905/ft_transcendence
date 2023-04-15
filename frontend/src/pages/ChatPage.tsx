import ChatBody from '../components/Chat/ChatBody'
import Sidebar from '../components/Sidebar/Sidebar'
import { createContext } from 'react'
import {io, Socket} from 'socket.io-client'
import { useState } from 'react'
export const SocketContext = createContext({} as Socket);

export default function ChatPage() {
  const [socket, setSocket] = useState(io(`${process.env.REACT_APP_BACKEND_URL}` + '/chat', {transports:["websocket"], autoConnect:false, reconnection:true,reconnectionAttempts: 3, reconnectionDelay: 1000}));

  return (
    <>
      <SocketContext.Provider value={socket}>
        <Sidebar />
        <ChatBody />
      </SocketContext.Provider>
    </>
  )
}
