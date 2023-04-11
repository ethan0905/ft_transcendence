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
      <div
        style={{ animationDelay: `0.8s` }}
        className={`chat__item ${this.props.user ? this.props.user : ""}`}
      >
        <div className="chat__item__content">
          <div className="chat__msg">{this.props.msg}</div>
          <div className="chat__meta">
            <span>16 mins ago</span>
            <span>Seen 1.03PM</span>
          </div>
        </div>
        <UserAvatar isOnline="active" image={this.props.image} />
      </div>
    );
  }
}