import React, { Component } from "react";
import UserAvatar from "../UserList/UserAvatar";

interface Props {
    animationDelay: number;
    key: number;
    user: string;
    msg: string;
    image: string;
}

const ChatItem = ({ user, msg, image }: Props) => {
  return (
    <div style={{ animationDelay: `0.8s` }} className={`chat__item ${user ? user : ""}`}>
      <div className="chat__item__content">
        <div className="chat__msg">{msg}</div>
      </div>
      <UserAvatar image={image} />
    </div>
  );
};

export default ChatItem;