import CSS from 'csstype';

interface TableProps {
	data: {
	  player1: string;
	  player2: string;
	  score: string;
	  date: string;
	}[];
  }
  
const GameHistory = (props: TableProps) => {
	const { data } = props;

	const gamesPlayed = data.length;
	let gamesWon = 0;
	let gamesLost = 0;
  
	data.forEach((item) => {
		const score1 = item.score[0];
		const score2 = item.score[1];
		
		if (score1 > score2) {
			gamesWon++;
		} else if (score1 < score2) {
			gamesLost++;
		}
	});
  
	const winrate = gamesPlayed > 0 ? ((gamesWon / gamesPlayed) * 100).toFixed(2) : "0.00";
  
	return (
	<div style={{overflowY: 'auto', minWidth: '60%', height: '100%', borderRadius: '10px',}}>
			<table style={{ borderCollapse: 'collapse', width: '100%', height:'100%' }}>

				<thead style={{ position: 'sticky', top: '0' }}>
					<tr>
						<th colSpan={6} style={titleTable}>Game history</th>
					</tr>
					<tr style={stats}>
						<th></th>
						<th>Winrate: {winrate}%</th>
						<th></th>
						<th>Games: {gamesPlayed}</th>
						<th>Win: {gamesWon}</th>
						<th>Lost: {gamesLost}</th>
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
						<tr style={lineTable} key={index}>
							<td>{index + 1}</td>
							<td>{item.player1}</td>
							<td>VS</td>
							<td>{item.player2}</td>
							<td>{item.score.at(0)} - {item.score.at(1)}</td>
							<td>{item.date}</td>
						</tr>
					))}
					{Array(9 - data.length).fill('').map((item, index) => (
						<tr style={lineTable} key={data.length + index}>
								<td>-</td>
								<td>-</td>
								<td>VS</td>
								<td>-</td>
								<td>-</td>
								<td>-</td>

						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const stats: CSS.Properties = {
	backgroundColor: '#b62f2ff8',
	textAlign: 'center',
}

const titleCol: CSS.Properties = {
	backgroundColor: 'black', 
	color: 'white', 
	textAlign: 'center',
}

const titleTable: CSS.Properties = {
	backgroundColor: 'black', 
	color: 'white', 
	textAlign: 'center', 
	fontFamily: 'Kocak',
	fontSize: '30px',
}

const lineTable: CSS.Properties = {
	borderBottom: '1px solid #ddd',
	textAlign: 'center',
	backgroundColor: '#e94b4b32',
	height: '30px',
	fontWeight: 'bold',
	color: 'white',
	textShadow: '1px 1px 1px black',
}

const playerCol: CSS.Properties = {
	backgroundColor: 'black', 
	color: 'white', 
	textAlign: 'center',
	width: '20%'
}

export default GameHistory;