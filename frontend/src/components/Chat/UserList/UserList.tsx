// import {useState } from "react";
import "./UserList.css";
import UserItems from "./UserItems";

interface ChanUser {
  image: string;
  id: number;
  name: string;
  active: boolean;
  isOnline: boolean;
}

const allChatUsers : ChanUser[] = [
  {
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU",
  id: 1,
  name: "Tim Hover",
  active: true,
  isOnline: true,
},
{
  image:
    "https://avatars.githubusercontent.com/u/8985933?v=4",
  id: 2,
  name: "Ayub Rossi",
  active: false,
  isOnline: false,
},
{
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQEZrATmgHOi5ls0YCCQBTkocia_atSw0X-Q&usqp=CAU",
  id: 3,
  name: "Hamaad Dejesus",
  active: false,
  isOnline: false,
},
{
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRZ6tM7Nj72bWjr_8IQ37Apr2lJup_pxX_uZA&usqp=CAU",
  id: 4,
  name: "Eleni Hobbs",
  active: false,
  isOnline: true,
},
{
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRJo1MiPQp3IIdp54vvRDXlhbqlhXW9v1v6kw&usqp=CAU",
  id: 5,
  name: "Elsa Black",
  active: false,
  isOnline: false,
},
{
  image:
    "https://huber.ghostpool.com/wp-content/uploads/avatars/3/596dfc2058143-bpfull.png",
  id: 6,
  name: "Kayley Mellor",
  active: false,
  isOnline: true,
},
{
  image:
    "https://www.paintingcontest.org/components/com_djclassifieds/assets/images/default_profile.png",
  id: 7,
  name: "Hasan Mcculloch",
  active: false,
  isOnline: true,
},
{
  image:
    "https://auraqatar.com/projects/Anakalabel/media//vesbrand/designer4.jpg",
  id: 8,
  name: "Autumn Mckee",
  active: false,
  isOnline: false,
},
{
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSM6p4C6imkewkCDW-9QrpV-MMAhOC7GnJcIQ&usqp=CAU",
  id: 9,
  name: "Allen Woodley",
  active: false,
  isOnline: true,
},
{
  image: "https://pbs.twimg.com/profile_images/770394499/female.png",
  id: 10,
  name: "Manpreet David",
  active: false,
  isOnline: true,
},
];

export default function UserList() {
  // const [allUsers, setAllUsers] = useState<ChanUser[]>(allChatUsers);
  const allUsers = allChatUsers;

    return (
      <div className="main__userlist">

        <div className="userlist__heading">
          <p>Users of the channel</p>
        </div>

        <div className="userlist__items">
            {allUsers.map((item, index) => {
              return (
                <UserItems
                  name={item.name}
                  key={item.id}
                  animationDelay={index + 1}
                  active={item.active ? "active" : ""}
                  isOnline={item.isOnline ? "active" : ""}
                  image={item.image}
                />
              );
            })}
          </div>

      </div>
    );
  
}
