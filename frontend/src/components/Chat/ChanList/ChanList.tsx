// import {useState} from 'react';
import './ChanList.css';
import ChanItems from './ChanItems';

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

        <div className="search_wrap">
          <input type="text" placeholder="Search channels" required />
          <button className="search-btn">
            <i className='fa fa-search'></i>
          </button>
        </div>

        <div className='Box-button-newchannel'>
          {/* <button className="btn"> */}
            <i className='fa fa-plus'> </i>
            <span>New Channel</span>
          {/* </button> */}
        </div>

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
