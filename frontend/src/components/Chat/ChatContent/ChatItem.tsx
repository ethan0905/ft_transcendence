import React, { Component } from "react";
import UserAvatar from "../UserList/UserAvatar";

interface Props {
    animationDelay: number;
    key: number;
    user: string;
    msg: string;
    image: string;
}

export default class ChatItem extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    return (
      <div style={{ animationDelay: `0.8s` }} className={`chat__item ${this.props.user ? this.props.user : ""}`}>
        <div className="chat__item__content">
          <div className="chat__msg">{this.props.msg}</div>
        </div>
        <UserAvatar image={this.props.image} />
      </div>
    );
  }
}