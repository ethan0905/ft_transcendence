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
						<tr key={index}>
							<td style={lineTable}>{index + 1}</td>
							<td style={lineTable}>{item.player1}</td>
							<td style={lineTable}>VS</td>
							<td style={lineTable}>{item.player2}</td>
							<td style={lineTable}>{item.score.at(0)} - {item.score.at(1)}</td>
							<td style={lineTable}>{item.date}</td>
						</tr>
					))}
					{Array(9 - data.length).fill('').map((item, index) => (
						<tr key={data.length + index}>
								<td style={lineTable}>-</td>
								<td style={lineTable}>-</td>
								<td style={lineTable}>VS</td>
								<td style={lineTable}>-</td>
								<td style={lineTable}>-</td>
								<td style={lineTable}>-</td>

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
	padding: '5px',
}

const titleCol: CSS.Properties = {
	backgroundColor: 'black', 
	color: 'white', 
	textAlign: 'center',
	padding: '10px',
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
	backgroundColor: '#fff9f932',
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