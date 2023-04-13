import React, {Component} from 'react';
import ChatList from './ChanList/ChanList';
import ChatContent from './ChatContent/ChatContent';
import UserList from './UserList/UserList';
import './ChatBody.css';



const ChatBody: React.FC = () => {
  return (
    <div className='main__chatbody'>
      <ChatList />
      <ChatContent />
      <UserList />
    </div>
  );
};

export default ChatBody;
