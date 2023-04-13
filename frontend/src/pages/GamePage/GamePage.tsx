import './gamePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Switch from '@mui/material/Switch';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { createContext } from 'react';

export const SocketContext = createContext({} as Socket);
interface TableProps {
  data: {
	player1: string;
		player2: string;
		score: string;
		link: string;
  }[];
}

const GameTable = (props: TableProps) => {
  const { data } = props;

  return (
	<div className='tableau'>
	  <table>
			<thead>
				<th colSpan={6} className='maintitleTab'>Pong Matches</th>
				<tr className='titlesTab'>
					<th>#</th>
					<th className='cellPlayer'></th>
					<th>Match</th>
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
					<td>{item.score}</td>
					<td>{item.link}</td>
				</tr>))}
			</tbody>
	  </table>
	</div>
  );
};

async function getRooms() {
	const res = await fetch("http://localhost:3333/ws-game/rooms");
	const data = await res.json();
	return data;
}

export default function GamePage() {
	const [socket, setSocket] = useState(io("http://localhost:4343/ws-game", {transports:["websocket"], autoConnect:false, reconnection:true,reconnectionAttempts: 3, reconnectionDelay: 1000}));
	// const data = [];

	useEffect(() => {
		socket.connect();
		socket.emit("ClientSession", "prout");
		getRooms().then((rooms) => {
			console.log(rooms);
		})

		socket.on("NewMatch", (value:any) => {
			console.log("NewRoom")
			console.log(value);
		})
	}, [])

	const data = [
		{ player1: 'John Doe', player2: 'Jane Smith', score: "3-2", link: "link" },
		{ player1: 'Jane Smith', player2: 'John Doe',score: "3-2", link: "link"  },
		{ player1: 'Bob Johnson', player2: 'Jane Smith',score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe',score: "3-2" , link: "link" },
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "13-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
		{ player1: 'Tom Smith', player2: 'John Doe' ,score: "3-2", link: "link"},
	];

return (
<>
	<Sidebar />
	<div className='GamePage'>
		{data.length > 0 ? GameTable({ data }) : <p>No Live</p>}
		<div className='ButtonPlay'>
			<img src="/buttonplay.jpg" alt='ImgButton' id='ImgButton'
				onClick={() => {socket.emit("matchmaking", "prout")}}
			/>

			<span id='textPlay' onClick={() => {socket.emit("matchmaking", "prout")}}>
				PLAY
			</span>
			<div className='MapOption'>
				<span>Default map</span>

			</div>
		</div>
	</div>
</>
);
}