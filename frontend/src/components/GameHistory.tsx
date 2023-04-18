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

	return (
		<div style={{overflowY: 'scroll', minWidth: '60%', height: '100%'}}>
			<table style={{ borderCollapse: 'collapse', width: '100%', height:'100%' }}>

				<thead style={{ position: 'sticky', top: '0' }}>
					<tr>
						<th colSpan={6} style={titleTable}>Game history</th>
					</tr>
					<tr>
						<th style={stats}></th>
						<th style={stats}>Winrate: 0%</th>
						<th style={stats}></th>
						<th style={stats}>Games: 0</th>
						<th style={stats}>Win: 0</th>
						<th style={stats}>Lost: 0</th>
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
	padding: '10px' 
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