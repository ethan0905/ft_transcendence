import React, {Component} from 'react';
import { Avatar, AvatarGroup } from "@mui/material";

const ChanAvatar: React.FC = () => {
	return (
    <AvatarGroup max={3} sx={{
      '& .MuiAvatar-root': { width: 35, height: 35, fontSize: 16 }}}>
      <Avatar src="https://randomuser.me/api/portraits/women/79.jpg" alt="Alice" sx={{ width: 35, height: 35 }}/>
      <Avatar src="https://randomuser.me/api/portraits/men/51.jpg" alt="John" sx={{ width: 35, height: 35 }}/>
      <Avatar sx={{ bgcolor: 'primary.light', width: 35, height: 35 }}>DK</Avatar>
      <Avatar sx={{ bgcolor: 'success.light', width: 35, height: 35 }}>CK</Avatar>
    </AvatarGroup>
	);
}

interface Props {
  animationDelay: number;
  active?: string;
  image?: string;
  isOnline: string;
  name: string;
}

export default class ChanItems extends Component<Props> {
  selectChat = (e: React.MouseEvent<HTMLDivElement>) => {
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

  render() {
    return (
      <div
        style={{ animationDelay: `0.${this.props.animationDelay}s` }}
        onClick={this.selectChat}
        className={`chatlist__item ${
          this.props.active ? this.props.active : ""
        } `}
      >
        <ChanAvatar />
        <div className="userMeta">
          <p>{this.props.name}</p>
          <span className="activeTime">32 mins ago</span>
        </div>
      </div>
    );
  }
}