import './Sidebar.css';
// import {useState} from 'react';
import { Link } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ProfileIcon from '@mui/icons-material/AccountCircle';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
// import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import React from 'react';

const SidebarData = [
    {
        title: 'Profile',
        icon: <ProfileIcon />,
        link: '/myProfile',
    },
    {
        title: 'Chat',
        icon: <ChatIcon />,
        link: '/Chat',
    },
    {
        title: 'Game',
        icon: <SportsEsportsIcon />,
        link: '/Game',
    },
    {
      title: 'Leaderboard',
      icon: <LeaderboardIcon />,
      link: '/Leaderboard',
    },
    {
      title: 'Logout',
      icon: <LogoutIcon />,
      link: '/',
    },

]

export default function Sidebar () {
  // const [isOpen, setOpen] = useState(false);

  return (
    <div className="Sidebar">
        <div className="SidebarIcon">
          <img src="/logo.png" alt="Logo" className="SidebarImage"/>
        </div>
        <ul className='SidebarList'>
          {SidebarData.map((val, key) => {
            return (
              <React.Fragment key={key}>
                <Link to={val.link} className='SidebarLink'>
                  <li className='row' id={window.location.pathname === val.link ? "active" : ""}>
                    <div id="icon">{val.icon}</div>
                    <div id="title">{val.title}</div>
                  </li>
                </Link>
              </React.Fragment>
            );
          })}
        </ul>
    </div>
  );
}