import React, { Component } from 'react';
import ChatList from './ChanList/ChanList';
import ChatContent from './ChatContent/ChatContent';
import UserList from './UserList/UserList';
import './ChatBody.css';
import { useLocation } from 'react-router-dom';



const ChatBody: React.FC = () => {
  let location = useLocation();

  return (
    <div className='main__chatbody'>
      <ChatList />
      {location.pathname === '/Chat' ? null :
        (
          <>
            <ChatContent />
            <UserList />
          </>
        )}
    </div>
  );
};

export default ChatBody;
