import React, { useState, useEffect, useContext } from 'react';
import "./UserList.css";
import UserItems from "./UserItems";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../../../pages/ChatPage';


interface ChanUser {
  image: string;
  id: number;
  username: string;
  active: boolean;
  isOnline: boolean;
}

async function getAllUserInChat(id: number,accessToken: string){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_BACKEND_URL}` + '/chat/channels/users/'+id,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    }
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

function ListSection({name, listUsers, privilege}: {name: string, listUsers: any, privilege: boolean}){
  return (
    <div className='list__section'>
      <div className="userlist__heading">
        <h2 style={{fontFamily: 'Kocak', color: 'white', textShadow: '1px 1px 1px black'}}>{name}</h2>
      </div>
      <div className="userlist__items">
        {listUsers.map((item:any, index:number) => {
          return (
            <UserItems
              privilege={privilege}
              category={name}
              name={item.username}
              key={item.id}
              animationDelay={index + 1}
              active={item.active ? "active" : ""}
              isOnline={item.status ? "active" : ""}
              image={item.avatarUrl}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function UserList() {
  const [channelStatus, setChannelStatus] = useState<boolean>(false);
  const [allAdmins, setAllAdmins] = useState<ChanUser[]>([]);
  const [allMembers, setAllMembers] = useState<ChanUser[]>([]);
  const [allMuted, setAllMuted] = useState<ChanUser[]>([]);
  const [allBanned, setAllBanned] = useState<ChanUser[]>([]);
  const socket = useContext(SocketContext);
  let location = useLocation();
  const [username, setUsername] = useState<string>()
  const [token, setToken] = useState('');

  useEffect(() => {
		if (token !== '') {
			console.log("Le token est valide !", token);
			getUsername(token);
		}
		let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if (cookieToken) {
			setToken(cookieToken);
		}
	}, [token]);

  async function getUsername(accessToken: string): Promise<any> {
    try {
        const response = await fetch('http://localhost:3333/users/me/username/get', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${accessToken}`
          },
        });
        const data = await response.json();
        if (data) {
          setUsername(data.username);
        }
        // return data;
      } catch (error) {
  
        console.error(error);
        // handle error
      }
    }

  useEffect(() => {
    socket.on("NewUserJoin", (value:any) => {
      setAllMembers((data:any) => {
        for (var i in data){
          if (data[i].username === value.username)
            return data;
        }
        return [...data, value];
      });
      
    })
  }, [socket]);
  
  useEffect(() => {
    if (location.pathname !== "/Chat" && token !== ''){
      let id = Number(location.pathname.split("/")[2]);
      getAllUserInChat(id,token).then((value: any) => {
        if (value.status === "none")
          return;
        else if (value.status === "admin")
          setChannelStatus(true);
        else
          setChannelStatus(false);
        setAllAdmins(value.admins);
        setAllMembers(value.members);
        setAllMuted(value.muted);
        setAllBanned(value.banned);
      })
    }
    }, [location.pathname, socket, token]);

  return (
      <div className="main__userlist">
        <ListSection name="Admins" listUsers={allAdmins} privilege={channelStatus}/>
        <ListSection name="Members" listUsers={allMembers} privilege={channelStatus}/>
        <ListSection name="Muted" listUsers={allMuted} privilege={channelStatus}/>
        <ListSection name="Banned" listUsers={allBanned} privilege={channelStatus}/>
      </div>
    );
  
}
