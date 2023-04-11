import React, { Component, createRef} from "react";
import ChatItem from "./ChatItem";
import { Avatar, AvatarGroup } from "@mui/material";
import "./ChatContent.css";

const ChatAvatar: React.FC = () => {
	return (
		<AvatarGroup max={3} sx={{
			'& .MuiAvatar-root': { width: 50, height: 50, fontSize: 25 }}}>
			<Avatar src="https://randomuser.me/api/portraits/women/79.jpg" alt="Alice" sx={{ width: 35, height: 35 }}/>
			<Avatar src="https://randomuser.me/api/portraits/men/51.jpg" alt="John" sx={{ width: 35, height: 35 }}/>
			<Avatar sx={{ bgcolor: 'primary.light', width: 35, height: 35 }}>DK</Avatar>
			<Avatar sx={{ bgcolor: 'success.light', width: 35, height: 35 }}>CK</Avatar>
		</AvatarGroup>
	);
}

type ChatItm = {
  key: number;
  image: string;
  type: string;
  msg: string;
};

type State = {
  chat: ChatItm[];
  msg: string;
};

type Props = {};

export default class ChatContent extends Component<Props, State> {
  messagesEndRef = createRef<HTMLDivElement>();
  chatItms = [
    {
      key: 1,
      image:
        "https://avatars.githubusercontent.com/u/8985933?v=4",
      type: "",
      msg: "Hi Tim, How are you?",
    },
    {
      key: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "I am fine.",
    },
    {
      key: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "What about you?",
    },
    {
      key: 4,
      image:
        "https://avatars.githubusercontent.com/u/8985933?v=4",
      type: "",
      msg: "Awesome these days.",
    },
    {
      key: 5,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "Finally. What's the plan?",
    },
    {
      key: 6,
      image:
        "https://avatars.githubusercontent.com/u/8985933?v=4",
      type: "",
      msg: "what plan mate?",
    },
    {
      key: 7,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "I'm taliking about the tutorial",
    },
    {
      key: 8,
      image:
        "https://avatars.githubusercontent.com/u/8985933?v=4",
      type: "",
      msg: "Awesome these days.",
    },
    {
      key: 9,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "Finally. What's the plan?",
    },
    {
      key: 10,
      image:
        "https://avatars.githubusercontent.com/u/8985933?v=4",
      type: "",
      msg: "what plan mate?",
    },
    {
      key: 11,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "I'm taliking about the tutorial",
    }, {
      key: 12,
      image:
        "https://avatars.githubusercontent.com/u/8985933?v=4",
      type: "",
      msg: "Awesome these days.",
    },
    {
      key: 13,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "Finally. What's the plan?",
    },
    {
      key: 14,
      image:
        "https://avatars.githubusercontent.com/u/8985933?v=4",
      type: "",
      msg: "what plan mate?",
    },
    {
      key: 15,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
      type: "other",
      msg: "I'm taliking about the tutorial",
    },
  ];

  constructor(props: Props) {
    super(props);
    this.state = {
      chat: this.chatItms,
      msg: "",
    };
  }

  scrollToBottom = () => {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  componentDidMount() {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        if (this.state.msg !== "") {
          this.chatItms.push({
            key: 1,
            type: "",
            msg: this.state.msg,
            image:
              "https://avatars.githubusercontent.com/u/8985933?v=4",
          });
          this.setState({ chat: [...this.chatItms] });
          this.scrollToBottom();
          this.setState({ msg: "" });
        }
      }
    });
    this.scrollToBottom();
  }
  onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ msg: e.target.value });
  };

  render() {
    return (
      <div className="main__chatcontent">
        
        <div className="content__header">
          <div className="blocks">
            <div className="current-chatting-user">
              <ChatAvatar />
              <p>Channel</p>
            </div>
          </div>
          <div className="blocks">
            <div className="settings">
              <button className="btn-nobg">
                <i className="fa fa-cog"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="content__body">
          <div className="chat__items">
            {this.state.chat.map((itm, index) => {
              return (
                <ChatItem
                  animationDelay={index + 2}
                  key={itm.key}
                  user={itm.type ? itm.type : "me"}
                  msg={itm.msg}
                  image={itm.image}
                />
              );
            })}
            <div ref={this.messagesEndRef} />
          </div>
        </div>

        <div className="content__footer">
          <div className="sendNewMessage">
            <button className="addFiles">
              <i className="fa fa-plus"></i>
            </button>
            <input
              type="text"
              placeholder="Type a message here"
              onChange={this.onStateChange}
              value={this.state.msg}
              onFocus={() => {
                return false;
              }}
            />
            <button className="btnSendMsg" id="sendMsgBtn">
              <i className="fa fa-paper-plane"></i>
            </button>
          </div>
        </div>

      </div>
    );
  }
}