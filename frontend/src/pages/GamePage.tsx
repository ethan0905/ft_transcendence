import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';


interface TableProps {
  data: {
    player1: string;
	player2: string;
    score: string;
	link: string;
  }[];
}

const getTable = (props: TableProps) => {
  const { data } = props;

  return (
    <div style={{ overflowY: 'scroll', width: '75vw', height: '50vh', backgroundColor: 'rgba(48, 48, 55, 0.25)' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', height:'100%' }}>
        <thead style={{ position: 'sticky', top: '0' }}>
		<tr>
		<th colSpan={5} style={{ backgroundColor: 'black', color: 'white', textAlign: 'center', padding: '10px' }}>Live games</th>
        </tr>
          <tr>
		  <th style={{ backgroundColor: 'black', color: 'white', textAlign: 'left'}}>#</th>
		  <th style={{ backgroundColor: 'black', color: 'white', textAlign: 'left'}}>Player1</th>
		  <th style={{ backgroundColor: 'black', color: 'white', textAlign: 'left'}}>Player2</th>
		  <th style={{ backgroundColor: 'black', color: 'white', textAlign: 'left'}}>Score</th>
		  <th style={{ backgroundColor: 'black', color: 'white', textAlign: 'left'}}>Watch</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
			<td style={{ borderBottom: '1px solid #ddd' }}>{index + 1}</td>
              <td style={{ borderBottom: '1px solid #ddd' }}>{item.player1}</td>
              <td style={{ borderBottom: '1px solid #ddd' }}>{item.player2}</td>
			  <td style={{ borderBottom: '1px solid #ddd' }}>{item.score}</td>
			  <td style={{ borderBottom: '1px solid #ddd' }}>{item.link}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default function GamePage() {
	const data = [
		{ player1: 'John Doe', player2: 'Jane Smith', score: "3-2", link: "link" },
		{ player1: 'Jane Smith', player2: 'John Doe',score: "3-2", link: "link"  },
		{ player1: 'Bob Johnson', player2: 'Jane Smith',score: "3-2", link: "link"},
		{ player1: 'Tom Smithjghjhjkhjkykyky', player2: 'John Doe' ,score: "3-2", link: "link" },
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
		{ player1: 'Tom Smitheryetererertrtrt', player2: 'John Doedgdftgdfgrertrdtdrtdtdtdrt' ,score: "3-2", link: "link"},
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
			{ <div style={{
				width: '100vw',
				height: '100vh',
				backgroundSize: 'cover',
				backgroundImage: `url(/games.png)`,
				backgroundRepeat: 'no-repeat',
			}}>

			<h1 style={{color: 'black'}}>Play</h1>
			{<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',}}>
			{getTable({ data })}
			</div>}
			</div>
			}
		</>
		);
}