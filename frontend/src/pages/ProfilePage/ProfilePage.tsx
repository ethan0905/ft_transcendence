import React, { useState, useEffect, ChangeEvent, ChangeEventHandler } from 'react';
import axios from 'axios';
import './profilePage.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import EditableText from '../../components/Profile/EditableText';
import ProfilePicture from '../../components/Profile/ProfilePicture';
import FriendList from '../../components/Profile/FriendList';
import GameHistory from '../../components/Profile/GameHistory';
import AuthCode from 'react-auth-code-input';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function ProfilePage() {

	const [name, setName] = useState("Username");
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const [checked, setChecked] = React.useState(false);
	const [twoFAActivated, setTwoFAActivated] = React.useState(false);
	const [qrcodeDataUrl, setQrcodeDataUrl] = React.useState('');
	const [token, setToken] = useState('');
	const [twoFACode, setTwoFACode] = React.useState('');

	useEffect(() => {
		if (token !== '') {
			console.log("token: ", token);
			check2FAStatus(token).then((status: any) => status.json()).then((status: any) => {
				console.log("status: ", status);
				setChecked(status.twoFactorAuth);
				setTwoFAActivated(status.twoFactorActivated);
			});
		}
		let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		if (cookieToken) {
			setToken(cookieToken);
		}
	}, [token]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

		setChecked(event.target.checked);
		console.log("status: ", !checked);
		if (!checked === false) {
			setTwoFAActivated(false);
			fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/auth/2fa/activated', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token, twoFactorActivated: false })
			});
		}

		axios.post(`${process.env.REACT_APP_BACKEND_URL}` + '/auth/2fa/enable', { token, twoFactorAuth: !checked }).then(response => {

			console.log(response);
		}).catch(error => {
			console.error(error);
		});
	};

	/**
	** Display a base64 URL inside an iframe in another window.
	**/
	function debugBase64(base64URL: string) {
		var win = window.open();
		if (win)
			win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
	}

	const handleOnChange = (code: string) => {
		setTwoFACode(code);
		console.log("2fa code: ", code);
	};

	async function generateQRCode(): Promise<any> {
		try {
			const response = await fetch('http://localhost:3333/auth/2fa/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token: token })
			});
			const data = await response.json();
			console.log(data);
			setQrcodeDataUrl(data);
			setTwoFAActivated(false);
			debugBase64(data);
			return data;
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	async function activate2FA(): Promise<any> {
		const response = await fetch('http://localhost:3333/auth/2fa/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ token, twoFACode: twoFACode })
		});
		const data = await response.json();
		if (data) {
			setTwoFAActivated(true);

			console.log("DATA = ", data);
			const res = await fetch('http://localhost:3333/auth/2fa/activated', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token, twoFactorActivated: true })
			});
			// await axios.post('http://localhost:3333/auth/2fa/activated', { token, twoFactorActivated: twoFAActivated }).then(response => {

			// console.log(response);
			// }).catch(error => {
			//   console.error(error);
			// });
		}
		return data;
	}

	async function check2FAStatus(accessToken: string): Promise<any> {
		try {
			const response = await fetch('http://localhost:3333/auth/2fa/status', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${accessToken}`
				},
			});
			// const response = await axios.get('http://localhost:3333/auth/2fa/status'
			return response;
		} catch (error) {

			console.error(error);
			// handle error
		}
	}

	const handleUpload: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent) => {
		const target = event.target as HTMLInputElement;
		if (target && target.files && target.files.length > 0) {
			const file = target.files[0];
			setProfilePicture(file);
		}
	};

	const friends = [
		{ name: 'Alex', status: 'online' },
		{ name: 'Mika', status: 'offline' },
		{ name: 'Ethan', status: 'online' },
		{ name: 'Kenny', status: 'online' },
		{ name: 'Clement', status: 'offline' },
		{ name: 'Tom', status: 'online' },
		{ name: 'Kate', status: 'offline' },
		{ name: 'Sam', status: 'playing' },
		{ name: 'Sam', status: 'online' },
		{ name: 'Sam', status: 'online' },

	];

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
			<div className='ProfilePage'>
				<div className='ProfilePage_header'>
					<ProfilePicture profilePicture={profilePicture} handleUpload={handleUpload} />
					<div className='ProfilePage_info'>
						<EditableText text={name} onSubmit={setName} />
						<div className='Info'>Rank: 1</div>
						{/* <SwitchButton /> */}
						<FormControlLabel control={
							<Switch
								checked={checked}
								onChange={handleChange}
								inputProps={{ "aria-label": "controlled" }}
							/>
						} label="Enable 2FA" />

						{/* {
							checked && ( */}
						<div>
							<button onClick={generateQRCode}>Generate QR code</button>
						</div>

						{checked && (
								// {!twoFAActivated && (
									<div className='Auth_block'>
										<AuthCode allowedCharacters='numeric' onChange={handleOnChange}	inputClassName='Authcode_input'/>
										<button onClick={activate2FA}>Submit code</button>
									</div>
								)}

						{/* )} */}
					</div>
				</div>

				<div className='Achievements'>
					<h2 style={{color: "#06b1ba", marginLeft: '15px', textShadow: '1px 1px 1px black'}}>Achievements</h2>
					<div className='Achiev_list'>
						<div className="tooltip">
							<img className='Achiev_image' src='match.svg' alt='Achiev'/>
							<span className="tooltiptext">1st Game</span>
						</div>

						<div className="tooltip">
							<img className='Achiev_image' src='win.svg' alt='Achiev'/>
							<span className="tooltiptext">1st Win</span>
						</div>

						<div className="tooltip">
							<img className='Achiev_image' src='friend.svg' alt='Achiev'/>
							<span className="tooltiptext">1st Friend</span>
						</div>
					</div>

				</div>
					<div className='Profile_tabs'>
						<FriendList data={friends} />
						<GameHistory data={games} />
					</div>

			</div>
		</>
	);
};