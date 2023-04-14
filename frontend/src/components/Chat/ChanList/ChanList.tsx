import React, { useState, useEffect } from 'react';
import './ChanList.css';
import ChanItems from './ChanItems';
import axios from 'axios';
import { SocketContext } from '../ChatBody';
import { useContext } from 'react';


// async function createNewChannel(name: string, password: string, isPrivate: boolean) {

//   let data = JSON.stringify({
//     "chatName": name,
//     "username": "esafar",
//     "isPrivate": isPrivate,
//     "password": password
//   });


//   let config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: 'http://localhost:3333/chat/newchat',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     data: data
//   };

//   axios.request(config)
//     .then((response: any) => {
//       return JSON.stringify(response.data);
//     })
//     .catch((error: any) => {
//       console.log(error);
//     });
//   return [];
// }

async function getAllChannels(username: string) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_BACKEND_URL}` + '/chat/channels/' + username,
    headers: {}
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

// async function getme(username: string) {
//   let config = {
//     method: 'get',
//     maxBodyLength: Infinity,
//     url: 'http://localhost:3333/users/me' + username,
//     headers: {}
//   };

//   const value = axios.request(config)
//     .then((response) => {
//       return response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//       return [];
//     });

//   return (value);
// }

const FormButton = () => {
  const socket = useContext(SocketContext)
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(`Name: ${name}, Password: ${password}, Private: ${isPrivate}`);
    // createNewChannel(name, password, isPrivate);
    socket.emit("create channel", {chatName:name, Password:password, isPrivate:isPrivate, username:"esafar"})
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
    <div>
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
    </div>
  );
}

interface Channel {
  id: number;
  channelName: string;
  active: boolean;
  isOnline: boolean;
}

export default function ChanList() {
  const socket = useContext(SocketContext)
  const [allChannels, setAllChannels] = useState<Channel[]>([])
  //const allChannels = ALL_CHAN;


  useEffect(() => {
    socket.on("Channel Created", (value:any) => {
      setAllChannels(data => {
        for (var i in data){
          if (data[i].id === value.id)
            return data;
        }
        return ([...data, value]);
      });
      console.log("New Channel");
    });

    
  }, [socket]);
  
  useEffect(() => {    
    getAllChannels("esafar").then((value: any) => {
      console.log(value);
      setAllChannels(value);
    })
  }, []);

  return (
    <div className="main__chatlist">

      <div className="chatlist__heading">
        <h2>Channels</h2>
      </div>

      <FormButton />

      <div className="chatlist__items">
        {allChannels.map((item, index) => {
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

    </div>
  );
}
