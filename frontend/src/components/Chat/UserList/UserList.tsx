import React, { useState, useEffect } from 'react';
import "./UserList.css";
import UserItems from "./UserItems";
import axios from 'axios';

interface ChanUser {
  image: string;
  id: number;
  username: string;
  active: boolean;
  isOnline: boolean;
}

async function getAllUserInChat(id: number){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:3333/chat/channels/users/'+id,
    headers: { }
  };
  
  const value = axios.request(config)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.log(error);
    return [];
  });

  return (value);
}


async function getAllBanUserInChat(id: number){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:3333/chat/channels/users/'+id,
    headers: { }
  };
  
  const value = axios.request(config)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.log(error);
    return [];
  });

  return (value);
}


export default function UserList() {
  const [allUsers, setAllUsers] = useState<ChanUser[]>([]);
  const [allbannUsers, setAllbanUsers] = useState<ChanUser[]>([]);
  //const allUsers = allChatUsers;


    
  useEffect(() => {    
    getAllUserInChat(1).then((value: any) => {
      setAllUsers(value);
    })

  }, []);    

  useEffect(() => {    
    getAllBanUserInChat(1).then((value: any) => {
      setAllbanUsers(value);
    })

  }, []);
  allUsers.map((item:any, index) => console.log(item));
  return (
      <div className="main__userlist">

        <div className="userlist__heading">
          <p>Users of the channel</p>
        </div>

        <div className="userlist__items">
            {allUsers.map((item, index) => {
              return (
                <UserItems
                  name={item.username}
                  key={item.id}
                  animationDelay={index + 1}
                  active={item.active ? "active" : ""}
                  isOnline={item.isOnline ? "active" : ""}
                  image={item.image}
                />
              );
            })}
          </div>

      </div>
    );
  
}
