import React, { useState, useEffect, useRef, Component } from 'react';
import UserAvatar from "./UserAvatar";
import "./UserList.css";


interface Pop {
  buttonText: string;
}

const PopupButton: React.FC<Pop> = ({ buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  }


  return (
    <div>
      <i className="fa fa-ellipsis-h" aria-hidden="true" onClick={handleButtonClick}></i>
      {isOpen && (
        <div className="popup" >
          <button onClick={() => console.log('kick')}>Kick</button>
          <button onClick={() => console.log('ban')}>Ban</button>
          <button onClick={() => console.log('mute')}>Mute</button>
        </div>
      )}
    </div>
  );
}


interface Props {
  animationDelay: number;
  active?: string;
  image?: string;
  isOnline: string;
  name: string;
}
const UserItems = ({ active, animationDelay, image, name }: Props) => {
  const selectChat = (e: React.MouseEvent<HTMLDivElement>) => {
    for (let index = 0; index < e.currentTarget.parentNode!.children.length; index++) {
      (e.currentTarget.parentNode!.children[index] as HTMLElement).classList.remove("active");
    }
    e.currentTarget.classList.add("active");
  };

  return (
    <div style={{ animationDelay: `0.${animationDelay}s` }} className={`userlist__item ${active ? active : ""} `}>
      <div className='id_user'>
        <UserAvatar image={image ? image : "http://placehold.it/80x80"}/>
        <span>{name}</span>
      </div>
      <PopupButton buttonText="Open Popup" />
    </div>
  );
};

export default UserItems;