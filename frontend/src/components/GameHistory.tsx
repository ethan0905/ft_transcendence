import CSS from 'csstype';
import React, { useState, useEffect } from 'react';

interface TableProps {
	data: {
	  player1: string;
	  player2: string;
	  player1Name: string;
	  score: string;
	  date: string;
	}[];
  }
  
const GameHistory = (props: TableProps) => {
	const { data } = props;

	const [token, setToken] = useState<string>('');
	const [userName, setUserName] = useState<string>('');

	useEffect(() => {
		if (token !== '') {
			getUserName(token);
		}
		let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if (cookieToken) {
			setToken(cookieToken);
		}
	}, [token]);

	const getUserName = async (token: string) => {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}` + '/users/me/username/get', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `${token}`
			},
		});
		const data = await response.json();
		if (data) {
			setUserName(data.username);
		}
	}

	const gamesPlayed = data.length;
	let gamesWon = 0;
	let gamesLost = 0;
  
	data.forEach((item) => {
		const score1 = item.score[0];
		const score2 = item.score[1];
		const player1 = item.player1Name;

		console.log("indie gamehistory: " + score1 + " ", score2 + " ", player1 + " ");

		if (score1 > score2 && player1 == userName || score1 < score2 && player1 != userName) {
			gamesWon++;
		} else {
			gamesLost++;
		}
	});
  
	const winrate = gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(2) : "0.00";
  
	return (
		<div style={{overflowY: 'scroll', minWidth: '60%', height: '100%'}}>
			<table style={{ borderCollapse: 'collapse', width: '100%', height:'100%' }}>

				<thead style={{ position: 'sticky', top: '0' }}>
					<tr>
						<th colSpan={6} style={titleTable}>Game history</th>
					</tr>
					<tr>
						<th style={stats}></th>
						<th style={stats}>Winrate: {winrate}%</th>
						<th style={stats}></th>
						<th style={stats}>Games: {gamesPlayed}</th>
						<th style={stats}>Win: {gamesWon}</th>
						<th style={stats}>Lost: {gamesLost}</th>
					</tr>
					<tr>
						<th style={titleCol}>#</th>
						<th style={playerCol}>Player1</th>
						<th style={titleCol}></th>
						<th style={playerCol}>Player2</th>
						<th style={titleCol}>Score</th>
						<th style={titleCol}>Date</th>
					</tr>
				</thead>

				<tbody style={{ paddingTop: '100px' }}>
					{data.map((item, index) => (
						<tr key={index} style={{ backgroundColor: 
							(item.score[0] > item.score[1] && item.player1Name === userName) || 
							(item.score[1] > item.score[0] && item.player1Name !== userName) 
							? '#42f5b033' /* green */ : '#f5484233' /* red */
						  }}>
							<td style={lineTable}>{index + 1}</td>
							{ item.player1Name == userName &&
								(
									<>
										<td style={lineTable}>{item.player1}</td>
										<td style={lineTable}>VS</td>
										<td style={lineTable}>{item.player2}</td>
									</>
								)
							}

							{ item.player1Name != userName &&
								(
									<>
										<td style={lineTable}>{item.player2}</td>
										<td style={lineTable}>VS</td>
										<td style={lineTable}>{item.player1}</td>
									</>
								)
							}

							<td style={lineTable}>{item.score.at(0)} - {item.score.at(1)}</td>
							<td style={lineTable}>{item.date}</td>
						</tr>))}
				</tbody>
			</table>
		</div>
	);
};

const stats: CSS.Properties = {
	backgroundColor: '#b62f2ff8',
	textAlign: 'center',
	padding: '5px',
}

const titleCol: CSS.Properties = {
	backgroundColor: 'black', 
	color: 'white', 
	textAlign: 'center',
	padding: '5px',
}

const titleTable: CSS.Properties = {
	backgroundColor: 'black', 
	color: 'white', 
	textAlign: 'center', 
	padding: '8px',
	fontFamily: 'Kocak',
	fontSize: '30px',
}

const lineTable: CSS.Properties = {
	borderBottom: '1px solid #ddd',
	textAlign: 'center',
	backgroundColor: '#fff9f955',

}

const playerCol: CSS.Properties = {
	backgroundColor: 'black', 
	color: 'white', 
	textAlign: 'center',
	width: '130px'
}

export default GameHistory;