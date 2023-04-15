import './gamePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Switch from '@mui/material/Switch';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { createContext } from 'react';
import axios from 'axios';

export const SocketContext = createContext({} as Socket);
interface TableProps {
  data: {
	player1: string;
		player2: string;
		player1_score: number;
		player2_score: number;
		name: string;
		game: any;
  }[];
}

const GameTable = (props: TableProps) => {
  const { data } = props;

  return (
	<div className='tableau'>
	  <table>
			<thead>
				<th colSpan={6} className='maintitleTab'>Live Matches</th>
				<tr className='titlesTab'>
					<th>#</th>
					<th className='cellPlayer'></th>
					<th></th>
					<th className='cellPlayer'></th>
					<th>Score</th>
					<th>Watch</th>
				</tr>
			</thead>
			<tbody>
				{data.map((item, index) => (
				<tr className='lineTab'key={index}>
					<td>{index + 1}</td>
					<td>{item.player1}</td>
					<td>VS</td>
					<td>{item.player2}</td>
					<td>{item.game.player1_score+ ":"+ item.game.player2_score}</td>
					{/* <td>{item.name}</td> */}
					<td>link</td>
				</tr>))}
			</tbody>
	  </table>
	</div>
  );
};

async function getRooms() {
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: "http://localhost:3333/ws-game/rooms",
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

export default function GamePage() {
	const [socket, setSocket] = useState(io("http://localhost:4343/ws-game", {transports:["websocket"], autoConnect:false, reconnection:true,reconnectionAttempts: 3, reconnectionDelay: 1000}));
	// const data = [];
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		socket.connect();
		getRooms().then((values) => {
			const rooms:any = Object.values(values);
			// console.log(rooms);
			setData(rooms);
			// rooms.forEach((room:any) => {
			// 	console.log(room.name + ":" + room.player1 + " " + room.player2 + " " + room.game.player1_score + " " + room.game.player2_score);
			// })
		})

		socket.emit("ClientSession", "prout");

		socket.on("RoomCreated", (value:any) => {
			setData((rooms:any) => {
				for (var i in rooms) {
					if (rooms[i].name === value.name) {
						return rooms;
					}
				}
				return [...rooms, value];
			});
		})
	}, [])

return (
<>
	<Sidebar />
	<div className='GamePage'>
		{data.length > 0 ? GameTable({ data }) : <p>No Live</p>}
		<div className='ButtonPlay'>
			<img src="/rasengan.png" alt='ImgButton' id='ImgButton'
				onClick={() => {socket.emit("matchmaking", "prout")}}
			/>
			<span id='textPlay' onClick={() => {socket.emit("matchmaking", "prout")}}>
				PLAY
			</span>
			<div className='MapOption'>
				{/* <span>Default map</span> */}
			</div>
		</div>
	</div>
</>
);
}