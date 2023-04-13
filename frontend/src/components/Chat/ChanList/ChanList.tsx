import React, { useState } from 'react';
import './ChanList.css';
import ChanItems from './ChanItems';

const FormButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(`Name: ${name}, Password: ${password}, Private: ${isPrivate}`);
    setIsOpen(false);
  }

  const handleInputChange = (e: any) => {
    const { name, value, checked} = e.target;
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
        New Channel
      </button>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={name} onChange={handleInputChange} className="channel_input" maxLength={20} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={handleInputChange} className="channel_input" maxLength={10}/>
              </div>
              <div >
                <label >is Private:</label>
                <input type="checkbox" id="isPrivate" name="isPrivate" checked={isPrivate} onChange={handleInputChange} className="channel_input"/>
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
  name: string;
  active: boolean;
  isOnline: boolean;
}

const ALL_CHAN: Channel[] = [
  {
    id: 1,
    name: "Channel 1",
    active: true,
    isOnline: true,
  },
  {
    id: 2,
    name: "Channel 2",
    active: false,
    isOnline: true,
  },
  {
    id: 3,
    name: "Channel 3",
    active: false,
    isOnline: true,
  },
  {
    id: 4,
    name: "Channel 4",
    active: false,
    isOnline: true,
  },
  {
    id: 5,
    name: "Channel 5",
    active: false,
    isOnline: true,
  },
];

export default function ChanList() {
  // const [allChannels, setAllChannels] = useState<Channel[]>(ALL_CHAN)
  const allChannels = ALL_CHAN;

    return (
      <div className="main__chatlist">
        
        <div className="chatlist__heading">
          <h1>Chat</h1>
        </div>

        <FormButton />

        <div className="chatlist__items">
            {allChannels.map((item, index) => {
              return (
                <ChanItems
                  name={item.name}
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
