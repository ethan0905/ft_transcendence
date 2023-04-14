import React, { useState, useEffect, Component, createRef, useRef} from "react";
import ChatItem from "./ChatItem";
import "./ChatContent.css";


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
  key: number;
  image: string;
  type: string;
  msg: string;
};

type State = {
  chat: ChatItm[];
  msg: string;
};

type ChatContentProps = {};

export default function ChatContent(props: ChatContentProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatItms: ChatItm[] = [
    {
      key: 1,
      image: "https://avatars.githubusercontent.com/u/8985933?v=4",
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
      image: "https://avatars.githubusercontent.com/u/8985933?v=4",
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
      image: "https://avatars.githubusercontent.com/u/8985933?v=4",
      type: "",
      msg: "what plan mate?",
    },
  ];

  const [chat, setChat] = useState<ChatItm[]>(chatItms);
  const [msg, setMsg] = useState<string>('');

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        if (msg !== "") {
          chatItms.push({
            key: 1,
            type: "",
            msg: msg,
            image: "https://avatars.githubusercontent.com/u/8985933?v=4",
          });
          setChat([...chatItms]);
          scrollToBottom();
          setMsg("");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [msg]);

  const onStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
  };


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
            key={itm.key}
            user={itm.type ? itm.type : "me"}
            msg={itm.msg}
            image={itm.image}
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
      <button className="btnSendMsg" id="sendMsgBtn">
        <i className="fa fa-paper-plane"></i>
      </button>
    </div>
  </div>

</div>
);
}