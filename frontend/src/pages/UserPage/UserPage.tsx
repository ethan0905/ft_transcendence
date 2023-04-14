import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Avatar from '@mui/material/Avatar';
import './userPage.css';
import GameHistory from '../../components/Profile/GameHistory';

export default function UserPage() {
	let { id } = useParams();
	const games = [
		{ player1: 'Mika', player2: 'Ethan', score: "3-2", date: "2023-01-02" },
		{ player1: 'Ethan', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Kenny', player2: 'Ethan', score: "3-2", date: "2023-01-02" },
		{ player1: 'Clem', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
		{ player1: 'Alex', player2: 'Mika', score: "3-2", date: "2023-01-02" },
	];

	return (
		<>
			<Sidebar />
			<div className='UserPage'>
				<div className='UserPage_header'>
					<Avatar id='UserAvatar' alt='Profile Picture' src={"https://cdn.intra.42.fr/users/430b2acd1bcfedf5475654d235003086/norminet.jpeg"}/>
					<div className='UserPage_info'>
						<h1>{id}</h1>
						<div className='buttonList'>
							<button style={{backgroundColor: 'green'}}>Add</button>
							<button style={{backgroundColor: 'red'}}>Delete</button>
							<button style={{backgroundColor: 'orange'}}>Block</button>
							<button>Unblock</button>
							<button>Fight</button>
						</div>
					</div>
					<div className='Achievements'>
						<div className='Achiev_list'>
							<div className="tooltip">
								<img className='Achiev_image' src='/match.svg' alt='Achiev'/>
								<span className="tooltiptext">1st Game</span>
							</div>
							<div className="tooltip">
								<img className='Achiev_image' src='/win.svg' alt='Achiev'/>
								<span className="tooltiptext">1st Win</span>
							</div>
							<div className="tooltip">
								<img className='Achiev_image' src='/friend.svg' alt='Achiev'/>
								<span className="tooltiptext">1st Friend</span>
							</div>
						</div>
					</div>
				</div>

				<div className='UserPage_stats'>
					<GameHistory data={games} />
				</div>
			</div>
		</>
	);
}
