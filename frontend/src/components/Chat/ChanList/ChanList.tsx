import React, { useState, useEffect } from 'react';
import './ChanList.css';
import ChanItems from './ChanItems';
import axios from 'axios';
import { SocketContext } from '../ChatBody';
import { useContext } from 'react';

async function getAllChannels(username: any) {
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
  const [allChannels, setAllChannels] = useState<Channel[]>([])
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

  // async function getUsername(): Promise<any> {
  // let accessToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  // try {
	// 		const response = await fetch(`http://localhost:3333` + '/users/me/username/get', {
	// 			method: 'GET',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				'Authorization': `${accessToken}`
	// 			},
	// 		});
	// 		const data = await response.json();
	// 		if (data) {
	// 			console.log("NAME : ", data);
	// 			setName(data.username);
	// 		}
	// 		// return data;
	// 	} catch (error) {

	// 		console.error(error);
	// 		// handle error
	// 	}
	// }
  
  useEffect(() => {
    // getUsername();

    getAllChannels(username).then((value: any) => {
      console.log(value);
      setAllChannels(value);
    })
  }, []);

  return (
    <div className="main__chatlist">

      <div className="chatlist__heading">
        <h2 style={{fontFamily: 'Kocak', color: 'white', textShadow: '1px 1px 1px black'}}>Channels</h2>
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
