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
    // console.log('Form submitted:', formValues);
    setFormValues(initialFormValues);
    setIsOpen(false);
  }

  return (
    <div  >
      <i className="btn-nobg fa fa-cog" onClick={() => setIsOpen(true)}></i>
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

async function getAllMessages(id_channel:number, accessToken:string){
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_BACKEND_URL}` + '/chat/channels/' + id_channel+"/msg",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${accessToken}`
    }
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
  const [channel_name,setChannel_name] = useState<string>("OK")
  const [chat, setChat] = useState<ChatItm[]>([]);
  const [msg, setMsg] = useState<string>('');
  const [userID, setUserID] = useState<number>()
  const [email, setEmail] = useState<string>()
  const [token, setToken] = useState('');

  useEffect(() => {
		if (token !== '') {
			// console.log("Le token est valide !", token);
			getUsermail(token);
      getUserId(token);
		}
		let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if (cookieToken) {
			setToken(cookieToken);
		}
	}, [token]);


  function clearInput() {
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
          // console.log("data id: ", data.id)
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
          // console.log("data email: ", data)
          setEmail(data.email);
        }
      } catch (error) {
        console.error(error);
      }
    }

  useEffect(() => {

    console.log("NEW USE EFFECT");
    socket.on("NewMessage", (value:any) => {
      setChat(chats => {
        let id = Number(location.pathname.split("/")[2]); //added this line
        if (id !== value.channelId){ //added this line
          return chats; //added this line
        }
        for (var i in chats){
          
          if (chats[i].id === value.id){
            console.log("message already exists");
            return chats;
          }
        }
        console.log("message added");
        return ([...chats, value]);
      })
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    })
    
  },[location.pathname, socket]) // mistake was here

  const onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };

  useEffect(() => {
    if (location.pathname !== "/Chat" && token !== ''){
      console.log("inside useEffect 2");

      let id = Number(location.pathname.split("/")[2]);
      getAllMessages(id, token).then((values:any) => {
        setChat(values);
      });
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname, token]) //mistake was here

  return (  <div className="main__chatcontent">
        
  <div className="content__header">
    <div></div>
    <h1>
      {channel_name}
    </h1>
    <FormButton/>
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
    <input type="text" placeholder={"Type a message here"}
      onChange={onStateChange}
      value={msg}
      onFocus={() => {return false;}}
    />
    <button className="btnSendMsg" id="sendMsgBtn" onClick={() => {
      clearInput();
      console.log("chatId: ", Number(location.pathname.split("/")[2]), " | mail: ", email, " | msg: ", msg);
      socket.emit("sendMsgtoC", {
        "chatId":Number(location.pathname.split("/")[2]),
        "mail":email,
        "msg":msg
      })
    }}><i className="fa fa-paper-plane"></i></button>
  </div>

</div>
);
}