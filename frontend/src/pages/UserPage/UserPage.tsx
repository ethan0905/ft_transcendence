import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Avatar from '@mui/material/Avatar';
import GameHistory from '../../components/GameHistory';
import Achievements from '../../components/Achievements/Achievements';
import './userPage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import ProfilePicture from '../../components/ProfileSetting/ProfilePicture';

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

	const [userName, setUserName] = useState('');
	const [profilePicture, setProfilePicture] = useState<File | null>(null);

	useEffect(() => {
		if (id)
		{
			getUserNameById(id);
			getProfilePicture(id);
		}
	}, []);

	async function getUserNameById(id: string) {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/username/get', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Id': id,
				},
			});
			const data = await response.json();
			// console.log('data: ', data);
			if (data) {
				setUserName(data.username);
				// return data;
			}
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	async function getProfilePicture(id: string): Promise<any> {

		let name = '';

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/username/get', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Id': id,
				},
			});
			const data = await response.json();
			if (data) {
				name = data.username;
				// console.log('data: ', data);
			}
		} catch (error) {

			console.error(error);
			// handle error
		}

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/files/' + name, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			const blob = await response.blob();
			const file = new File([blob], 'filename.jpg', { type: 'image/jpeg' });
			setProfilePicture(file);
			// return data;
		} catch (error) {

			console.error(error);
			// handle error
		}
	}


	return (
		<>
			<Sidebar />
			<div className='UserPage'>
				<div className='UserPage_header'>
					<Avatar id='UserAvatar' alt='Profile Picture' src={profilePicture ? URL.createObjectURL(profilePicture) : undefined}/>
					<div className='UserPage_info'>
						<h1>{userName}</h1>
						<div className='buttonList'>
							<button style={{backgroundColor: 'green'}}>Add</button>
							<button style={{backgroundColor: 'red'}}>Delete</button>
							<button style={{backgroundColor: 'orange'}}>Block</button>
							<button>Unblock</button>
							<button>Fight</button>
						</div>
					</div>
					<Achievements />
				</div>
				<div className='UserPage_stats'>
					<GameHistory data={games} />
				</div>
			</div>
		</>
	);
}
