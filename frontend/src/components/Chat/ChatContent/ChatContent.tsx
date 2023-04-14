import React, { useState, useEffect, useRef, useContext} from "react";
import ChatItem from "./ChatItem";
import "./ChatContent.css";
import { SocketContext } from "../ChatBody";
import { useLocation } from "react-router-dom";
import axios from 'axios';



interface FormValues {
  name: string;
  password: string;
}

const initialFormValues: FormValues = {
  name: '',
  password: '',
};

const FormButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Form submitted:', formValues);
    setFormValues(initialFormValues);
    setIsOpen(false);
  }

  return (
    <div  >
      <i className="btn-nobg, fa fa-cog" onClick={() => setIsOpen(true)}></i>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsOpen(false)}>&times;</span>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Edit name:</label>
              <input type="text" name="name" value={formValues.name} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label htmlFor="email">Edit password:</label>
              <input type="password" name="password" value={formValues.password} onChange={handleChange} />
            </div>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

type ChatItm = {
  id: number,
  createdAt: Date,
  message: string,
  userId: number,
  channelId: number
};

async function getAllMessages(id_channel:number){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.REACT_APP_BACKEND_URL}` + '/chat/channels/' + id_channel+"/msg",
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


type ChatContentProps = {};

export default function ChatContent(props: ChatContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  let location = useLocation();
  const socket = useContext(SocketContext);
  const [chat, setChat] = useState<ChatItm[]>([]);
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    socket.on("NewMessage", (value:any) => {
      if (location.pathname !== "/Chat"){
        let id = Number(location.pathname.split("/")[2]);
        if (value.channelId === id){
          setChat(chats => {
            for (var i in chats){
              if (chats[i].id === value.id){
                return chats;
              }
            }
            return ([...chats, value]);
          })
        }
      }
    })
  },[location.pathname, socket, chat])

  const onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  useEffect(() => {
    if (location.pathname !== "/Chat"){
      let id = Number(location.pathname.split("/")[2]);
      getAllMessages(id).then((values:any) => {
        setChat(values)
      });
    }
  }, [location.pathname])

  return (  <div className="main__chatcontent">
        
  <div className="content__header">
    <div className="blocks">
        <h2>Channel 1</h2>
    </div>
    <div className="blocks">
        <FormButton/>
    </div>
  </div>

  <div className="content__body">
      {chat.map((itm, index) => {
        return (
          <ChatItem
            animationDelay={index + 2}
            key={index}
            // user={itm.type ? itm.type : "me"}
            user={"me"}
            msg={itm.message}
            // image={itm.image}
            image={"https://cdn.pixabay.com/photo/2013/04/11/19/46/building-102840__480.jpg"}
          />
        );
      })}
      <div ref={messagesEndRef} />
  </div>

  <div className="content__footer">
    <div className="sendNewMessage">
      <button className="addFiles">
        <i className="fa fa-plus"></i>
      </button>
      <input
        type="text"
        placeholder="Type a message here"
        onChange={onStateChange}
        value={msg}
        onFocus={() => {
          return false;
        }}
      />
      <button className="btnSendMsg" id="sendMsgBtn" onClick={() => {
        socket.emit("sendMsgtoC", {
          "chatId":Number(location.pathname.split("/")[2]),
          "mail":"esafar@student.42.fr",
          "msg":msg
        })        
      }}>
        <i className="fa fa-paper-plane"></i>
      </button>
    </div>
  </div>

</div>
);
}