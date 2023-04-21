import React, { useEffect, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import ChatList from './ChanList/ChanList';
import ChatContent from './ChatContent/ChatContent';
import UserList from './UserList/UserList';
import './ChatBody.css';

export const SocketContext = createContext({} as Socket);

const ChatBody: React.FC = () => {
  const socket = io(`${import.meta.env.VITE_BACKEND_URL}` + '/chat', {transports:["websocket"], autoConnect:false, reconnection:true,reconnectionAttempts: 3, reconnectionDelay: 1000});
  let location = useLocation();

  useEffect(() => {
    socket.connect();
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      <div className='main__chatbody'>
        <ChatList />
        {location.pathname === '/Chat' ? null :
          (
            <>
              <ChatContent/>
              <UserList/>
            </>
          )}
      </div>
    </SocketContext.Provider>
  );
};

export default ChatBody;