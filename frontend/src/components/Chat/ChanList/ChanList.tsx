import React, { useState, useEffect } from 'react';
import './ChanList.css';
import ChanItems from './ChanItems';
import axios from 'axios';
import { SocketContext } from '../../../pages/ChatPage';
import { useContext } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


async function getAllChannels(accessToken:string) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_BACKEND_URL}` + '/chat/channels/',
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

function MenuChat({name, channels}:{name:string, channels:any}){
  return (
<Accordion 
        style={{width:"95%",backgroundColor:'rgba(52, 52, 52, 0)',color:'black', boxShadow:'none'}}
        >
            
          <AccordionSummary
            style={{backgroundColor:'rgba(255, 255, 255, 1)', borderRadius:'10px'}}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
            <Typography>{name}</Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{padding:"0px", display:"flex", flexDirection:"column", alignItems:"center"}}
            >
            <div className="chatlist__items">
              
              {channels.map((item:any, index:number) => {
                // console.log(item.channelName);
                // console.log(item.id);
                return (
                  <ChanItems
                  name={item.channelName}
                  id_channel={item.id}
                  key={item.id}
                  animationDelay={index + 1}
                  active={item.active ? "active" : ""}
                  isOnline={item.isOnline ? "active" : ""}
                  />
                  );
                })}
            </div>
          </AccordionDetails>
        </Accordion>
  );
}

const FormButton = () => {
  const socket = useContext(SocketContext)
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [username, setUsername] = useState('');
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    getUsername(token);
    console.log(`Name: ${name}, Password: ${password}, Private: ${isPrivate}, Username: ${username}`);
    socket.emit("create channel", {chatName:name, Password:password, isPrivate:isPrivate, username:username})
    setIsOpen(false);
  }

  const handleInputChange = (e: any) => {
    const { name, value, checked } = e.target;
    if (name === 'name') {
      setName(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'isPrivate') {
      setIsPrivate(checked);
    }
  }

  return (
    <>
      <button className="btn" onClick={() => setIsOpen(true)}>
        <i className='fa fa-plus'> </i>
        <span>New Channel</span>
      </button>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" id="name" name="name" value={name} onChange={handleInputChange} className="channel_input" maxLength={20} />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={handleInputChange} className="channel_input" maxLength={10} />
              </div>
              <div >
                <label >is Private:</label>
                <input type="checkbox" id="isPrivate" name="isPrivate" checked={isPrivate} onChange={handleInputChange} className="channel_input" />
              </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

interface Channel {
  id: number;
  channelName: string;
  active: boolean;
  isOnline: boolean;
}

export default function ChanList() {
	const [name, setName] = useState('');
  const socket = useContext(SocketContext)
  const [myChannels, setMyChannels] = useState<Channel[]>([]);
  const [channelsToJoin, setChannelToJoin] = useState<Channel[]>([]);
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
    socket.on("Channel Created", (value:any) => {
      if (value.client_id === socket.id){
        setMyChannels(data => {
          for (var i in data){
            if (data[i].id === value.id)
              return data;
          }
          return ([...data, value]);
        });
      }
      else{
        setChannelToJoin(data => {
          for (var i in data){
            if (data[i].id === value.id)
              return data;
          }
          return ([...data, value]);
        });
      }
      console.log("New Channel");
    });

    socket.on("Joined", (value:any) => {
      let channel:any = undefined;
      setChannelToJoin(data => {
        for (var i in data){
          if (data[i].id === value.chatId){
            channel = data[i];
            return data.filter((channel: Channel) => channel.id !== value.chatId);
          }
        }
        return data;
      });
      if (channel === undefined)
        return;
      setMyChannels(data => {
        for (var i in data){
          if (data[i].id === value.id)
            return data;
        }
        return ([...data, {channelName:channel.channelName, id:channel.id, active:false, isOnline:false}]);
      });
    }
    );
  }, [socket]);
  
  useEffect(() => {
      // getUsername();
    if (token !== ''){
      getAllChannels(token).then((value: any) => {
        setMyChannels(value.MyChannels);
        setChannelToJoin(value.ChannelsToJoin);
      })
    }
  }, [token]);

  return (
    <div className="main__chatlist">

      <div className="chatlist__heading">
        <h2 style={{fontFamily: 'Kocak', color: 'white', textShadow: '1px 1px 1px black'}}>Channels</h2>
      </div>

      <FormButton />
      <div className='accordion-chats'>
          <MenuChat name={"My Channels"} channels={myChannels}/>
          <MenuChat name={"Channels to Join"} channels={channelsToJoin}/>
        </div>
    </div>
  );
}
