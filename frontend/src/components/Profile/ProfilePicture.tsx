import React, { ChangeEventHandler} from 'react';
import Avatar from '@mui/material/Avatar';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

interface ProfilePictureProps {
	profilePicture: File | null;
	handleUpload: ChangeEventHandler<HTMLInputElement>;
}
	
const ProfilePicture: React.FC<ProfilePictureProps> = ({profilePicture, handleUpload }) => {
	return (
		<div className='ProfilePicture'>
			<input type='file' id='profile-picture-upload'
				style={{ display: 'none' }}
				accept='.jpg,.jpeg,.png'
				onChange={handleUpload}
			/>
			<Avatar className='Avatar' alt='Profile Picture'sx={{
					width: 150,
					height: 150,
					verticalAlign: 'middle',
					border: '#f8f8f8 3px solid',
					margin: '20px 20px 20px 20px'
				}}
				src={profilePicture ? URL.createObjectURL(profilePicture) : "https://cdn.intra.42.fr/users/430b2acd1bcfedf5475654d235003086/norminet.jpeg"}
			/>

			<AddAPhotoIcon sx={{ 
					position: 'absolute',
					right: '25px',
					bottom: '30px',
					opacity: '1',
					color: '#0091d0',
				}}
				onClick={() => { 
					const input = document.getElementById('profile-picture-upload'); 
					if (input) { input.click(); } 
				}}
			/>
		</div>
	);
};
		
export default ProfilePicture;