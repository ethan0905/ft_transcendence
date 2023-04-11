import React, {Component} from 'react';
import ChatList from './ChanList/ChanList';
import ChatContent from './ChatContent/ChatContent';
import UserList from './UserList/UserList';
import './ChatBody.css';

export default class ChatBody extends Component {
  render() {
    return (
      <div className='main__chatbody'>
          <ChatList />
          <ChatContent />
          <UserList />
      </div>
    );
  }
}