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
					border: '#03d3fc 3px solid',
					boxShadow: '0px 0px 10px 3px #03d3fc',
					margin: '20px 20px 20px 20px'
				}}
				src={profilePicture ? URL.createObjectURL(profilePicture) : '/loading.jpeg'}
			/>

			<AddAPhotoIcon sx={{ 
					position: 'absolute',
					right: '25px',
					bottom: '30px',
					opacity: '0.8',
					color: '#03d3fc',
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