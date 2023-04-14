import React, { useState, useEffect, useContext } from 'react';
import "./UserList.css";
import UserItems from "./UserItems";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../ChatBody';

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

export default function UserList() {
  const [allUsers, setAllUsers] = useState<ChanUser[]>([]);
  const socket = useContext(SocketContext);
  let location = useLocation();

  useEffect(() => {
    socket.on("NewUserJoin", (value:any) => {
      setAllUsers((data:any) => {
        for (var i in data){
          if (data[i].username === value.username)
            return data;
        }
        return [...data, value];
      });
    })
  }, [socket]);
  
  useEffect(() => {
    if (location.pathname !== "/Chat"){
      let id = Number(location.pathname.split("/")[2]);
      console.log("id channel:"+ id);
      socket.emit("join",{chatId:id, username:"mderome"}); // Ne pas oblier MDP
      getAllUserInChat(id).then((value: any) => { // **** MODIFIER ID DU CHANNEL ****
        console.log(value);
        setAllUsers(value);
      })
    }
  }, [location.pathname, socket]);

  return (
      <div className="main__userlist">

        <div className="userlist__heading">
          <h2>Users</h2>
        </div>

        <div className="userlist__items">
            {allUsers.map((item:any, index:number) => {
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
