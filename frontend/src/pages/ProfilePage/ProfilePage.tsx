import React, { useState, useEffect, ChangeEvent, ChangeEventHandler } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import EditableText from '../../components/ProfileSetting/EditableText';
import ProfilePicture from '../../components/ProfileSetting/ProfilePicture';
import FriendList from '../../components/FriendList';
import GameHistory from '../../components/GameHistory';
import Achievements from '../../components/Achievements/Achievements';
import axios from 'axios';
import './profilePage.css';
import AuthCode from 'react-auth-code-input';
import { styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function ProfilePage() {
	const [name, setName] = useState('');
	const [profilePicture, setProfilePicture] = useState<File | null>(null); // previous one
	const [checked, setChecked] = React.useState(false);
	const [twoFAActivated, setTwoFAActivated] = React.useState(false);
	const [qrcodeDataUrl, setQrcodeDataUrl] = React.useState('');
	const [token, setToken] = useState('');
	const [twoFACode, setTwoFACode] = React.useState('');

	useEffect(() => {
		if (token !== '') {
			getUsername(token);
			getProfilePicture(token);
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

			fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/auth/2fa/success', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ token, status: false })
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
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/auth/2fa/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token: token })
			});
			const data = await response.json();
			if (data) {
				setQrcodeDataUrl(data);
				setTwoFAActivated(false);
				debugBase64(data);
				return data;
			}
		} catch (error) {
			console.error(error);
			// handle error
		}
	}

	async function activate2FA(): Promise<any> {
		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/auth/2fa/verify', {
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
			const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/auth/2fa/activated', {
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
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/auth/2fa/status', {
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

	async function getUsername(accessToken: string): Promise<any> {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/username/get', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${accessToken}`
				},
			});
			const data = await response.json();
			if (data) {
				setName(data.username);
			}
			return data.username;
		} catch (error) {

			console.error(error);
			// handle error
		}
	}

	async function setUsernameInDatabase(username: string): Promise<any> {
		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/username/edit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${token}`
				},
				body: JSON.stringify({ username })
			});
			const data = await response.json();
			if (data.username) {
				setName(data.username);
			}
			// return data;
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
			const formData = new FormData();
			formData.append('file', file);

			axios.post(`${process.env.REACT_APP_BACKEND_URL}` + '/files/' + name + '/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			  }).then(response => {
				console.log('File uploaded successfully', response.data);
			  }).catch(error => {
				console.error('Error uploading file', error);
			  });
		}
	};

	async function getProfilePicture(accessToken: string): Promise<any> {

		let username: string = '';

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/users/me/username/get', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `${accessToken}`
				},
			});
			const data = await response.json();
			if (data) {
				setName(data.username);
				username = data.username; // TMP : storing my name inside this variable
			}
		} catch (error) {

			console.error(error);
			// handle error
		}

		try {
			const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/files/' + username, {
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

	const RedSwitch = styled(Switch)(({ theme }) => ({
		'& .MuiSwitch-switchBase.Mui-checked': {color: red[900]},
		'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {backgroundColor: red[900]},
	}));

	return (
		<>
			<Sidebar />
			<div className='ProfilePage'>
				<div className='ProfilePage_header'>
					<ProfilePicture profilePicture={profilePicture} handleUpload={handleUpload} />
					{/* <ProfilePicture profilePicture={avatar} handleUpload={handleUpload} /> */}
					<div className='ProfilePage_info'>
						<EditableText text={name} onSubmit={setUsernameInDatabase} />

						<FormControlLabel control={
							<RedSwitch checked={checked}
								onChange={handleChange} 
								inputProps={{"aria-label": "controlled"}}
						/>} label="Enable 2FA" />

						{checked && (
							<>
							<button id='generateCode' onClick={generateQRCode}>Generate QR code</button>
								{!twoFAActivated && (
									<>
									{qrcodeDataUrl && (
										<>
											<div className='Auth_block'>
												<AuthCode allowedCharacters='numeric' onChange={handleOnChange}	inputClassName='Authcode_input'/>
												<button onClick={activate2FA}>Submit</button>
											</div>
										</>
									)}
									</>
								)}
							</>
						)}
					</div>

				<Achievements />
				
			</div>

			<div className='Profile_tabs'>
				<FriendList data={friends} />
				<GameHistory data={games} />
			</div>
			
			</div>
		</>
	);
};