import React, {useState} from 'react';

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
	  <div style={{ overflowY: 'scroll', width: '65%',height: '50vh'}}>
		<table style={{ borderCollapse: 'collapse', width: '100%', height:'100%' }}>
		  <thead style={{ position: 'sticky', top: '0' }}>
		  <tr>
            <th colSpan={5} style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd', textAlign: 'center', padding: '10px' }}>Game history</th>
          </tr>
		  <tr>
			<th style={{ backgroundColor: '#f2f2f2'}}></th>
			<th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd', textAlign: 'left'}}>Win rate: 0%</th>
			<th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd', textAlign: 'left'}}>Wins: 0</th>
		  <th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd',textAlign: 'left'}}>Loses: 0</th>
		  <th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd',textAlign: 'left'}}>matches: 0</th>
          </tr>
			<tr>
			<th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd', textAlign: 'left'}}>#</th>
			<th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd', textAlign: 'left'}}>Player1</th>
			<th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd', textAlign: 'left'}}>Player2</th>
		  <th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd',textAlign: 'left'}}>Score</th>
		  <th style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd',textAlign: 'left'}}>Date</th>
			</tr>
		  </thead>
		  <tbody style={{ paddingTop: '100px' }}>
			{data.map((item, index) => (
			  <tr key={index}>
				  <td style={{ borderBottom: '1px solid #ddd' }}>{index + 1}</td>
				<td style={{ borderBottom: '1px solid #ddd' }}>{item.player1}</td>
				<td style={{ borderBottom: '1px solid #ddd' }}>{item.player2}</td>
				<td style={{ borderBottom: '1px solid #ddd' }}>{item.score}</td>
				<td style={{ borderBottom: '1px solid #ddd' }}>{item.date}</td>
			  </tr>
			))}
		  </tbody>
		</table>
	  </div>
	);
  };
  
export default GameHistory;