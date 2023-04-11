import {useState, ChangeEventHandler} from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import './profilePage.css';
import React from 'react';
import { ChangeEvent } from 'react';
import EditableText from '../components/EditableText';
import ProfilePicture from '../components/ProfilePicture';


export default function ProfilePage() {
	const [name, setName] = useState("Username");
	const [profilePicture, setProfilePicture] = useState<File | null>(null);

	const handleUpload: ChangeEventHandler<HTMLInputElement> = (event: ChangeEvent) => {
		const target = event.target as HTMLInputElement;
		if (target && target.files && target.files.length > 0) {
			const file = target.files[0];
			setProfilePicture(file);
		}
	};

 return (
		<>
			<Sidebar />
			<div className='ProfilePage'>

				<div className='ProfilePage_header'>
					<ProfilePicture profilePicture={profilePicture} handleUpload={handleUpload} />

					<div className='ProfilePage_info'>
						<EditableText text={name} onSubmit={setName}/>

						<div className='ProfilePage_stats'>
							<div className='Stat'>Rank: 1/100</div>
							<div className='Stat'>Winrate: 0%</div>
							<div className='Stat'>Matches: 0</div>
							<div className='Stat'>Wins: 0</div>
							<div className='Stat'>Loses: 0</div>
						</div>
					</div>
					
				</div>

				<div className='ProfilePage_achiev'>
					<h2>Achievements</h2>
					<ul>
						<li>Win 5 games</li>
						<li>Win 10 games</li>
						<li>Win 15 games</li>
						<li>Draw Match</li>
						<li>Play 10 games</li>
					</ul>	
				</div>

				<h2>Match History</h2>


			</div>
		</>
	);
};
