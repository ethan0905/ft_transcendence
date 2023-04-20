import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from './GamePage.tsx';
import { Socket } from 'socket.io-client';
import data from './game_data.ts';
import { useParams } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';

async function fetchRole(id_game:string, token:string){
	const res = await fetch("http://localhost:3333/ws-game/rooms/"+ id_game +"/role", {
		method:'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization':token,
		}
	});
	const data = await res.json();
	return data;
}

function drawBall(canvas:HTMLCanvasElement){
	const ctx = canvas.getContext('2d');
	if (!ctx)
		return;//console.log("ctx is null");
	ctx.beginPath();
	// console.log("x: " + data.ballObj.x + " y: " + data.ballObj.y + " radius: " + data.ballObj.radius)
	ctx.arc(canvas.width * data.ballObj.x, canvas.height * data.ballObj.y, canvas.width * data.ballObj.radius, 0, 2 * Math.PI);
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.closePath();
}

function drawPlayer(canvas:HTMLCanvasElement){
	const ctx = canvas.getContext('2d');
	if (!ctx)
		return;//console.log("ctx is null");
	if (data.playground.orientation === 0){
		data.player1.x = 0;
		data.player2.x = 1 - data.player2.width;
		ctx.fillStyle = 'rgba(0, 0, 255, 1)'
		ctx.fillRect(canvas.width-(canvas.width * data.player2.width), data.player1.y * canvas.height, canvas.width * data.player1.width, canvas.height * data.player1.height)
		ctx.fillStyle = 'rgba(255, 0, 0, 1)'
		ctx.fillRect(0, data.player2.y * canvas.height, canvas.width * data.player2.width, canvas.height * data.player2.height)
	}
	else if (data.playground.orientation === 1){
		data.player1.y = 0;
		data.player2.y = data.player2.height;
		ctx.fillStyle = 'rgba(0, 0, 255, 1)'
		ctx.fillRect((1 - data.player1.x - 0.2) * canvas.width, canvas.height - (canvas.height * data.player2.height), canvas.width * data.player1.width, canvas.height * data.player1.height)
		ctx.fillStyle = 'rgba(255, 0, 0, 1)'
		ctx.fillRect((1 - data.player2.x - 0.2) * canvas.width, 0, canvas.width * data.player2.width, canvas.height * data.player2.height)
	}
}

function Playground(props:{role:number, id_game:string, socket:Socket}){
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const role = props.role;
	const id_game = props.id_game;
	const socket = props.socket;
	const [size, setSize] = useState({
		orientation: -1,
		width: 0,
		height: 0
	});
	
	function getCanvasSize(){
		const width = window.innerWidth * 0.7;
		const height = window.innerHeight * 0.8;

		if (width > height){
			if (data.playground.orientation === 1){
				let tmp = data.player1.x;
				data.player1.x = data.player1.y;
				data.player1.y = tmp;
				tmp = data.player2.x;
				data.player2.x = data.player2.y;
				data.player2.y = tmp;
			}
			data.playground.orientation = 0;
			data.player1.width = 0.02;
			data.player1.height = 0.2;
			data.player2.width = 0.02;
			data.player2.height = 0.2;
			if (width * (4/7) < height){
				setSize({orientation:0, width: width, height: width*(4/7)});
				data.playground.width = width;
				data.playground.height = width*(4/7);
			}
			else{
				setSize({orientation:0, width: height*(7/4), height: height});
				data.playground.width = height*(7/4);
				data.playground.height = height;
			}
		}
		else
		{
			if (data.playground.orientation === 0){
				let tmp = data.player1.x;
				data.player1.x = data.player1.y;
				data.player1.y = tmp;
				tmp = data.player2.x;
				data.player2.x = data.player2.y;
				data.player2.y = tmp;
			}
			data.playground.orientation = 1;
			data.player1.width = 0.2;
			data.player1.height = 0.02;
			data.player2.width = 0.2;
			data.player2.height = 0.02;
			if (height * (4/7) < width){
				setSize({orientation:1,width: height*(4/7), height: height});
				data.playground.width = height*(4/7);
				data.playground.height = height;
			}
			else{
				data.playground.width = width;
				data.playground.height = width*(7/4);
				setSize({orientation:1,width: width, height: width*(7/4)});
			}
		}
	}

	useEffect(() => {
		socket.on('UpdateCanvas', (player_info) => {
			if (player_info.player_role === 1 && data.playground.orientation === 0)
				data.player1.y = player_info.position;	
			else if (player_info.player_role === 2 && data.playground.orientation === 0)
				data.player2.y = player_info.position;
			else if (player_info.player_role === 1 && data.playground.orientation === 1)
				data.player1.x = player_info.position;
			else if (player_info.player_role === 2 && data.playground.orientation === 1)
				data.player2.x = player_info.position;
		});
	
		socket.on("GetBallPosition", (ball) => {
			if (data.playground.orientation === 0){
				data.ballObj.x= ball.x;
				data.ballObj.y= ball.y;
			}
			else if (data.playground.orientation === 1){
				data.ballObj.x= 1 - ball.y;
				data.ballObj.y= ball.x;
			}
			data.ballObj.speed= ball.speed;
			data.ballObj.radius= ball.radius;
	
		})
		return(() => {
			socket.off('UpdateCanvas');
			socket.off('GetBallPosition');
		})
	},[socket]);

	useEffect(() => {
		getCanvasSize();
		console.log(size.width, size.height);
		const canvas = canvasRef.current;
		if (!canvas)
			return;//console.log("canvas is null");
		const render = () => {
			// socket.emit("RequestBallPosition", {room_name:id_game})
			const ctx = canvas.getContext('2d');
			if (!ctx)
			return;//console.log("ctx is null");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawBall(canvas);
			// wallColission(canvas);
			drawPlayer(canvas);
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);
		// render();
		window.addEventListener('resize', getCanvasSize);
		return () => {
			window.removeEventListener('resize', getCanvasSize);
		}
	}, [id_game, socket, size.height, size.width])

	return (
		<div className="h-[90vh] w-full flex flex-col justify-center items-center">
			{/* <canvas id="canvas" ref={canvasRef} width={size.width} height={size.height} className="border-slate-700 border-8" onMouseMove={(evt)=> updateDisplay(evt)}  onMouseLeave={(evt)=> updateDisplay(evt)}></canvas> */}
			<canvas id="canvas" ref={canvasRef} width={size.width} height={size.height} className="border-slate-700 border-8" onMouseMove={(evt)=> {
				const canvas = canvasRef.current;
				if (!canvas)
					return;// throw new Error("Canvas not found");
				if (size.orientation === 0){
					if (role === 1){
						data.player1.y = evt.nativeEvent.offsetY/(canvas.height);
						if (data.player1.y < 0)
							data.player1.y = 0;
						else if (data.player1.y > 0.8)
							data.player1.y = 0.8;
						socket.emit('MakeMove', {id_game:id_game,player:1, position: data.player1.y})
					}
					else if (role === 2){
						data.player2.y = evt.nativeEvent.offsetY/(canvas.height);
						if (data.player2.y < 0)
							data.player2.y = 0;
						else if (data.player2.y > 0.8)
							data.player2.y = 0.8;
						socket.emit('MakeMove', {id_game:id_game,player:2, position: data.player2.y})
					}
				}
				else if (size.orientation === 1){
					if (role === 1){
						data.player1.x = 1-(evt.nativeEvent.offsetX/(canvas.width));
						if (data.player1.x < 0)
							data.player1.x = 0;
						else if (data.player1.x > 0.8)
							data.player1.x = 0.8;
						socket.emit('MakeMove', {id_game:id_game,player:1, position: data.player1.x})
					}
					else if (role === 2){
						data.player2.x = 1-(evt.nativeEvent.offsetX/(canvas.width));
						if (data.player2.x < 0)
							data.player2.x = 0;
						else if (data.player2.x > 0.8)
							data.player2.x = 0.8;
						socket.emit('MakeMove', {id_game:id_game,player:2, position: data.player2.x})
					}
				}
			}}  onMouseLeave={(evt)=> {
				const canvas = canvasRef.current;
				if (!canvas)
					return;// throw new Error("Canvas not found");
				if (size.orientation === 0){
					if (role === 1){
						data.player1.y = evt.nativeEvent.offsetY/(canvas.height);
						if (data.player1.y < 0)
							data.player1.y = 0;
						else if (data.player1.y > 0.8)
							data.player1.y = 0.8;
						socket.emit('MakeMove', {id_game:id_game,player:1, position: data.player1.y})
					}
					else if (role === 2){
						data.player2.y = evt.nativeEvent.offsetY/(canvas.height);
						if (data.player2.y < 0)
							data.player2.y = 0;
						else if (data.player2.y > 0.8)
							data.player2.y = 0.8;
						socket.emit('MakeMove', {id_game:id_game,player:2, position: data.player2.y})
					}
				}
				else if (size.orientation === 1){
					if (role === 1){
						data.player1.x = 1-(evt.nativeEvent.offsetX/(canvas.width));
						if (data.player1.x < 0)
							data.player1.x = 0;
						else if (data.player1.x > 0.8)
							data.player1.x = 0.8;
						socket.emit('MakeMove', {id_game:id_game,player:1, position: data.player1.x})
					}
					else if (role === 2){
						data.player2.x = 1-(evt.nativeEvent.offsetX/(canvas.width));
						if (data.player2.x < 0)
							data.player2.x = 0;
						else if (data.player2.x > 0.8)
							data.player2.x = 0.8;
						socket.emit('MakeMove', {id_game:id_game,player:2, position: data.player2.x})
					}
				}
			}}></canvas>
		</div>
	);
}

enum StatusGame {
	Waiting = 0,
	Playing = 1,
	End = 2
}

function PlayPage() {
	let params = useParams();
	const navigate = useNavigate();
	const [id_game, setId_game] = useState<string>("");
	const socket = useContext(SocketContext);
	const [role, setPlayer_role] = useState<number>(0);
	const [isWinner, setIsWinner] = useState<boolean>(false);
	const [status_game, setStatus_game] = useState<StatusGame>(StatusGame.Waiting);
	const [score, setScore] = useState<[number, number]>([0,0]);
	const [token, setToken] = useState<string>('');
	
	useEffect(() => {
		let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if (!cookieToken)
			setToken("prout")
		else
			setToken(cookieToken);
	},[])

	useEffect(() => {
		if (!socket.connected && token !== ''){
			socket.auth= {token: token};
			socket.connect();
		}
	},[socket, token]);

	useEffect(() => {
		setId_game(params.id_game as string);
		// socket.emit("ClientSession", "prout");
		if (id_game !== "" && token !== ''){
			fetchRole(id_game, token).then((data:number) => {
				setPlayer_role(data);
			})
			socket.emit('JoinRoom', {room_name:id_game});
		}

		socket.on('StartGame', (value:any) => {
			console.log("StartGame:"+value);
			setStatus_game(StatusGame.Playing);
		});
		socket.on('PlayerLeft', (values:any) => {
			setStatus_game(StatusGame.End);
			setScore(values.score);
			if (role !== values.player)
				setIsWinner(true);
		})
	
		socket.on('UpdateScore', (values:any) => {
			// console.log("UpdateScore:"+values.score)
			setScore(values.score);
		})
		socket.on('EndGame', (values:any) => {
			setStatus_game(StatusGame.End);
			setScore(values.score);
			if (role === values.winner)
				setIsWinner(true);
		})
		return (() => {
			socket.off('StartGame');
			socket.off('PlayerLeft');
			socket.off('UpdateScore');
			socket.off('EndGame');
		})
	},[params.id_game, id_game, role, socket, token]);


	return (
		<div className="w-full h-screen flex flex-col items-center justify-center relative">
			{status_game === StatusGame.Playing ?
				null
			:
				<div className="absolute w-[100%] h-[100%] bg-opacity-20 bg-black z-20 flex flex-col items-center justify-around">
					{status_game === StatusGame.Waiting ? 
						<>
							<h1 className="w-fit text-5xl">Waiting Player</h1>
						</>
					: 
						<>
							<h1 className="w-fit text-5xl">{isWinner ? "YOU WIN!!!!" : "YOU LOSE"}</h1>
							<h1 className="w-fit text-5xl">Score: {score[0]}:{score[1]}</h1>
							<button className="bg-red-200 p-3 rounded-xl w-fit text-2xl">GO BACK TO MENU</button>
						</>
					}
				</div>
			}
			<div className="w-full h-[10vh] inline-flex justify-center items-center gap-2">
				<h1 className="w-fit h-min sm:text-4xl text-sm">{score[0]}:{score[1]}</h1>
				<div className="">
					<button className="sm:text-2xl text-sm bg-red-200 rounded-lg p-2" onClick={() => {
						socket.emit('LeaveRoom', {room_name:id_game});
						navigate("/Game");
					}}>QUIT</button>
				</div>
			</div>
			{id_game !== "" && role !== 0 && socket.connected ? <Playground role={role} id_game={id_game} socket={socket}/> : <div>Loading...</div> }
		</div>
	)
}

export default PlayPage;