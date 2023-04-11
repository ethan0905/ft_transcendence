import React, {Component} from 'react';
import UserAvatar from "./UserAvatar";
import "./UserList.css";

interface Props {
  animationDelay: number;
  active?: string;
  image?: string;
  isOnline: string;
  name: string;
}

export default class UserItems extends Component<Props> {
    selectChat = (e: React.MouseEvent<HTMLDivElement>) => {
      for (
        let index = 0;
        index < e.currentTarget.parentNode!.children.length;
        index++
      ) {
        (e.currentTarget.parentNode!.children[index] as HTMLElement).classList.remove("active");
      }
      e.currentTarget.classList.add("active");
    };
  
    render() {
      return (
        <div
          style={{ animationDelay: `0.${this.props.animationDelay}s` }}
          onClick={this.selectChat}
          className={`userlist__item ${ this.props.active ? this.props.active : "" } `}
        >
          <div className='id_user'>
            <UserAvatar
              image={this.props.image ? this.props.image : "http://placehold.it/80x80"}
              isOnline={this.props.isOnline}
            />
    
            <div className="userMeta">
              <p>{this.props.name}</p>
              <span className="activeTime">32 mins ago</span>
            </div>
          </div>
          
          <button className="btn-nobg">
            <i className="fa fa-ellipsis-h"></i>
          </button>
        </div>
      );
    }
  }