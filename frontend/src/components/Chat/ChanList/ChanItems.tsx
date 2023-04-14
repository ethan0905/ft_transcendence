import React, { Component } from 'react';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import { useNavigate } from 'react-router-dom';

interface Props {
  animationDelay: number;
  active?: string;
  image?: string;
  isOnline: string;
  name: string;
  id_channel: number;
}


const ChatItems: React.FC<Props> = ({ name, active, animationDelay, id_channel }) => {
  const navigate = useNavigate();
  const selectChat = (e: React.MouseEvent<HTMLDivElement>) => {
    for (
      let index = 0;
      index < e.currentTarget.parentNode!.children.length;
      index++
    ) {
      (e.currentTarget.parentNode!.children[index] as HTMLElement).classList.remove(
        "active"
      );
    }
    e.currentTarget.classList.add("active");
    navigate("/chat/" + id_channel);
  };

  return (
    <div style={{ animationDelay: `0.${animationDelay}s` }}
      onClick={selectChat}
      className={`chatlist__item ${active ? active : ""} `}
    >
      <div className="userMeta">
        <p>{name}</p>
      </div>
      <div className="QuitButton">
        <DisabledByDefaultIcon id='DisabledByDefaultIcon' sx={{ fontSize: 15 }}
          onClick={() => { }}
        />
      </div>
    </div>
  );
};

export default ChatItems;
