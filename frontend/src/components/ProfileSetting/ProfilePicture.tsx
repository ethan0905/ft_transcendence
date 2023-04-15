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
					border: '#f8f8f8 4px solid',
					margin: '10px 20px 10px 10px'
				}}
				src={profilePicture ? URL.createObjectURL(profilePicture) : "sasuke.jpg"}
			/>

			<AddAPhotoIcon sx={{ 
					position: 'absolute',
					right: '30px',
					bottom: '20px',
					opacity: '1',
					color: '#fefefefb',
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