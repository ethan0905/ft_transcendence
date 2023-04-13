import './gamePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Switch from '@mui/material/Switch';

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

export default function GamePage() {
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
		{GameTable({ data })}
		<div className='ButtonPlay'>
			<img src="/buttonplay.jpg" alt='ImgButton' id='ImgButton'
				onClick={() => {window.location.href = '/game'}}
			/>

			<span id='textPlay' onClick={() => {window.location.href = '/game'}}>
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