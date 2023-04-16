import React, { useState, useEffect, useRef, useContext } from "react";
import ChatItem from "./ChatItem";
import "./ChatContent.css";
import { SocketContext } from "../ChatBody";
import { useLocation } from "react-router-dom";
import axios from 'axios';

async function getAllMessages(id_channel: number) {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:3333/chat/channels/' + id_channel + "/msg",
    headers: {}
  };

  const value = axios.request(config)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
  return (value);
}

type ChatItm = {
  id: number,
  createdAt: Date,
  message: string,
  userId: number,
  channelId: number
};

type ChatContentProps = {};

export default function ChatContent(props: ChatContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  let location = useLocation();
  const socket = useContext(SocketContext);
  const [chat, setChat] = useState<ChatItm[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [userID, setUserID] = useState<number>()
  const [email, setEmail] = useState<string>()
  const [token, setToken] = useState('');
  const [msgInput, setMsgInput] = useState("Type a message here");
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [editedName, setEditedName] = useState<string>('');

  function handleSubmit(event: any) {
    event.preventDefault();
    setEditedName(`${name}`);
    setIsOpen(false);
  }

  useEffect(() => {
    if (token !== '') {
      console.log("Le token est valide !", token);
      getUsermail(token);
      getUserId(token);
    }
    let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (cookieToken) {
      setToken(cookieToken);
    }
  }, [token]);


  function clearInput() {
    setMsgInput("Type a message here");
    setMsg("");
  }

  async function getUserId(accessToken: string): Promise<any> {
    try {
      const response = await fetch('http://localhost:3333/users/me/id/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`
        },
      });
      const data = await response.json();
      if (data) {
        setUserID(data.id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getUsermail(accessToken: string): Promise<any> {
    try {
      const response = await fetch('http://localhost:3333/users/me/email/get', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${accessToken}`
        },
      });
      const data = await response.json();
      if (data) {
        setEmail(data.email);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    socket.on("NewMessage", (value: any) => {
      if (location.pathname !== "/Chat") {
        let id = Number(location.pathname.split("/")[2]);
        if (value.channelId === id) {
          setChat(chats => {
            for (var i in chats) {
              if (chats[i].id === value.id) {
                return chats;
              }
            }
            return ([...chats, value]);
          })
        }
      }
    })
  }, [location.pathname, socket, chat])

  const onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  useEffect(() => {
    if (location.pathname !== "/Chat") {
      let id = Number(location.pathname.split("/")[2]);
      getAllMessages(id).then((values: any) => {
        setChat(values)
      });
    }
  }, [location.pathname])

  return (

    <div className="main__chatcontent">

      <div className="content__header">
      <div></div>

        <div className="blocks">
          <h2>{editedName} </h2>
        </div>
        <div className="blocks">
          <div>
            <i className="btn-nobg fa fa-cog" onClick={() => setIsOpen(true)}></i>
            {isOpen && (
              <div className="modal">
                <div className="modal-content">
                  <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label >Edit name:</label>
                      <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div className="form-group">
                      <label >Edit password:</label>
                      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                    <button type="submit">Submit</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="content__body">
        {chat.map((itm, index) => {
          return (
            <ChatItem
              animationDelay={index + 2}
              key={index}
              user={itm.userId === userID ? "me" : "other"}
              msg={itm.message}
              image={"https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840__480.jpg"}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="sendNewMessage">
        <input type="text" placeholder={msgInput}
          onChange={onStateChange}
          value={msg}
          onFocus={() => { return false; }}
        />
        <button className="btnSendMsg" id="sendMsgBtn" onClick={() => {
          clearInput();
          socket.emit("sendMsgtoC", {
            "chatId": Number(location.pathname.split("/")[2]),
            "mail": email,
            "msg": msg
          })
        }}><i className="fa fa-paper-plane"></i></button>
      </div>

    </div>
  );
}