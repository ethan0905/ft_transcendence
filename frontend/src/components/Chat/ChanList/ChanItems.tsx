import React, {Component} from 'react';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

interface Props {
  animationDelay: number;
  active?: string;
  image?: string;
  isOnline: string;
  name: string;
}

interface Props {
  name: string;
  active?: string;
  animationDelay: number;
}

const ChatItems: React.FC<Props> = ({ name, active, animationDelay }) => {
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
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default ChatItems;
