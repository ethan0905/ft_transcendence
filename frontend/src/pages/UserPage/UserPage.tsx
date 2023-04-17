import { useParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Avatar from '@mui/material/Avatar';
import GameHistory from '../../components/GameHistory';
import Achievements from '../../components/Achievements/Achievements';
import './userPage.css';
import { useState } from 'react';
import { useEffect } from 'react';
import ProfilePicture from '../../components/ProfileSetting/ProfilePicture';
import { CircularProgress } from '@mui/material';

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
	const [imageIsLoaded, setImageIsLoaded] = useState(false);
	const [token, setToken] = useState<string>('');
	const [friendAdded, setFriendAdded] = useState(false);
	const [blocked, setBlocked] = useState(false);

	useEffect(() => {
		if (token && id)
		{
			getUserNameById(id);
			getProfilePicture(id);
			getFriendStatusById(id);
			getBlockedStatusById(id);
		}
		let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if (cookieToken) {
			setToken(cookieToken);
		}
	}, [id, token]);

	useEffect(() => {
		if (profilePicture)
		{
			setTimeout(() => {
				setImageIsLoaded(true);
			}, 400);
		}
	}, [profilePicture]);

	useEffect(() => {
		let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if (cookieToken) {
			setToken(cookieToken);
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

	async function addFriend() {
		// 1. get user cookie
		// 2. send friend request to user using his id
		// let token = '';

		console.log('Add friend button clicked! : ', token);
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/addfriend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username: userName, Tokensource: token}),
			});
			// console.log('response: ', response);
			const data = await response.json();
			console.log('data: ', data.value);
			if (data.value) {
				setFriendAdded(true);
			}
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	async function removeFriend() {
		// 1. get user cookie
		// 2. remove friend using his id
		console.log('Remove friend button clicked! : ', token);

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/removefriend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username: userName, Tokensource: token}),
			});
			// console.log('response: ', response);
			const data = await response.json();
			console.log('data: ', data.value);
			if (data.value) {
				setFriendAdded(false);
			}
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	async function getFriendStatusById(id: string) {

		// console.log('getFriendStatusById: ', id);
		// console.log('friend status token: ', token);
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/getfriendstatus', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
					'Id': id,
				},
			});
			const data = await response.json();
			if (data.value) {
				console.log('data.value: FRIEND');
				setFriendAdded(true);
			}
			else {
				console.log('data.value: NOT FRIEND');
				setFriendAdded(false);
			}
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	// block part
	async function blockUser() {
		// 1. get user cookie
		// 2. send friend request to user using his id
		// let token = '';

		console.log('Block button clicked! : ', token);
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/blockuser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username: userName, Tokensource: token}),
			});
			// console.log('response: ', response);
			const data = await response.json();
			console.log('data: ', data.value);
			if (data.value) {
				setBlocked(true);
			}
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	async function unblockUser() {
		// 1. get user cookie
		// 2. remove friend using his id
		console.log('Unblock button clicked! : ', token);

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/unblockuser', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username: userName, Tokensource: token}),
			});
			// console.log('response: ', response);
			const data = await response.json();
			console.log('data: ', data.value);
			if (data.value) {
				setBlocked(false);
			}
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	async function getBlockedStatusById(id: string) {

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/getblockstatus', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
					'Id': id,
				},
			});
			const data = await response.json();
			if (data.value) {
				console.log('data.value: BLOCKED');
				setBlocked(true);
			}
			else {
				console.log('data.value: UNBLOCKED');
				setBlocked(false);
			}
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
					{imageIsLoaded ? (
							<Avatar
								id='UserAvatar'
								alt='Profile Picture'
								sx={{
									width: 150,
									height: 150,
									verticalAlign: 'middle',
									border: '#f8f8f8 4px solid',
									margin: '10px 20px 10px 10px'
								}}
								src={profilePicture ? URL.createObjectURL(profilePicture) : undefined}/>
						) : (
							<CircularProgress
								id='LoadingAvatar'
								size={150}
								thickness={2}
								sx={{	
								color: '#f8f8f8'
								}}
						  />
						)
					}
					<div className='UserPage_info'>
						<h1>{userName}</h1>
						<div className='buttonList'>
							{ !friendAdded ? (
									<button style={{backgroundColor: 'green'}} onClick={addFriend}>Add</button>
								) : (
									<button style={{backgroundColor: 'red'}} onClick={removeFriend}>Delete</button>
								)
							}
							{ !blocked ? (
									<button style={{backgroundColor: 'orange'}} onClick={blockUser}>Block</button>
								) : (
									<button onClick={unblockUser}>Unblock</button>
								)
							}
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
