import React, { useState, useEffect, useContext } from 'react';
import "./UserList.css";
import UserItems from "./UserItems";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../../../pages/ChatPage';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);


interface ChanUser {
  image: string;
  id: number;
  username: string;
  active: boolean;
  isOnline: boolean;
}

async function getPeopleToInvite(accessToken: string, channelId:number): Promise<any> {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_BACKEND_URL}` + '/chat/channels/' + channelId+"/peopletoinvite",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    }
  };
  
  const value = await axios.request(config).then((value:any) => {
    return value.data;
  }).catch(() => {
    return [];
  })
  return (value);
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

const InviteFriendChannel = async (channelId:number, token:string) => {
  const listUsers = await getPeopleToInvite(token, channelId);

  const selection = await MySwal.fire({
    title: 'Invite Friends',
    input: 'select',
    inputOptions: listUsers,
    inputPlaceholder: 'Select friends to invite',
    showCancelButton: true,
  })
  return {confirm: selection.isConfirmed, value:listUsers[Number(selection.value)]};
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

    socket.on("ban", (value:any) => {
      let bannedUser:any = undefined;
      setAllAdmins((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            bannedUser = data[i];
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      setAllMembers((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            bannedUser = data[i];
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      setAllMuted((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            bannedUser = data[i];
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      if (bannedUser === undefined)
        return;
      setAllBanned((data:any) => {
        for (var i in data){
          if (data[i].username === value.username)
            return data;
        }
        return [...data, {username:bannedUser.username, avatarUrl:bannedUser.avatarUrl, id:bannedUser.id, status:bannedUser.status, active:bannedUser.active}];
      });

    });

    socket.on("kick", (value:any) => {
      setAllAdmins((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      setAllMembers((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      setAllMuted((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
    });

    socket.on("mute", (value:any) => {
      let mutedUser:any = undefined;
      setAllAdmins((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            mutedUser = data[i];
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      setAllMembers((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            mutedUser = data[i];
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      if (mutedUser === undefined)
        return;
      setAllMuted((data:any) => {
        for (var i in data){
          if (data[i].username === value.username)
            return data;
        }
        return [...data, {username:mutedUser.username, avatarUrl:mutedUser.avatarUrl, id:mutedUser.id, status:mutedUser.status, active:mutedUser.active}];
      });
    });

    socket.on("unmute", (value:any) => {
      let unmutedUser:any = undefined;
      setAllMuted((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            unmutedUser = data[i];
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      if (unmutedUser === undefined)
        return;
      setAllMembers((data:any) => {
        for (var i in data){
          if (data[i].username === value.username)
            return data;
        }
        return [...data, {username:unmutedUser.username, avatarUrl:unmutedUser.avatarUrl, id:unmutedUser.id, status:unmutedUser.status, active:unmutedUser.active}];
      });
    });

    socket.on("set-admin", (value:any) => {
      let newAdmin:any = undefined;
      setAllMembers((data:any) => {
        for (var i in data){
          if (data[i].username === value.username){
            newAdmin = data[i];
            return data.filter((item:any) => item.username !== value.username);
          }
        }
        return data;
      });
      if (newAdmin === undefined)
        return;
      setAllAdmins((data:any) => {
        for (var i in data){
          if (data[i].username === value.username)
            return data;
        }
        return [...data, {username:newAdmin.username, avatarUrl:newAdmin.avatarUrl, id:newAdmin.id, status:newAdmin.status, active:newAdmin.active}];
      });
    });

    socket.on("quit", (value:any) => {
      setAllAdmins((data:any) => {return data.filter((item:any) => item.username !== value.username)});
      setAllMembers((data:any) => {return data.filter((item:any) => item.username !== value.username)});
      setAllMuted((data:any) => {return data.filter((item:any) => item.username !== value.username)});
    });
  }, [socket]);
  
  useEffect(() => {
    if (location.pathname !== "/Chat" && token !== ''){
      let id = Number(location.pathname.split("/")[2]);
      getAllUserInChat(id,token).then((value: any) => {
        if (value.status === "none")
          return;
        else if (value.status === "admin" && !value.isDM)
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
        <div className="flex flex-col gap-[5px] w-1/2">
          {channelStatus && <button className='button__inviteChannel' onClick={() => {
            InviteFriendChannel(Number(location.pathname.split("/")[2]),token).then((value:any) => {
              if (value.confirm){
                socket.emit("invit", {username:value.value, chatId:Number(location.pathname.split("/")[2])})
              }
            })
          }}>Invite</button>}
          <button className='button__quitChannel' onClick={() => {
            socket.emit("quit", {chatId:Number(location.pathname.split("/")[2])});
          }}>Quit Channel</button>
        </div>
      </div>
    );
  
}
