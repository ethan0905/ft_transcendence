import React, { ChangeEventHandler, useEffect} from 'react';
import Avatar from '@mui/material/Avatar';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';

interface ProfilePictureProps {
	profilePicture: File | null;
	handleUpload: ChangeEventHandler<HTMLInputElement>;
}
	
// const ProfilePicture: React.FC<ProfilePictureProps> = ({profilePicture, handleUpload }) => {
// 	const [imageIsLoaded, setImageIsLoaded] = React.useState(false);

// 	return (
// 		<div className='ProfilePicture'>
// 			<input type='file' id='profile-picture-upload'
// 				style={{ display: 'none' }}
// 				accept='.jpg,.jpeg,.png'
// 				onChange={handleUpload}
// 			/>
// 			{imageIsLoaded ? (
// 				<Avatar
// 					className='Avatar'
// 					alt='Profile Picture'
// 					sx={{
// 					width: 150,
// 					height: 150,
// 					verticalAlign: 'middle',
// 					border: '#f8f8f8 4px solid',
// 					margin: '10px 20px 10px 10px'
// 					}}
// 					src={profilePicture ? URL.createObjectURL(profilePicture) : "empty.jpg"}
// 					onLoad={() => setImageIsLoaded(true)}
// 				/>
// 			) : (
// 				<Skeleton variant='circular' width={150} height={150} />
// 			)}

// 			<AddAPhotoIcon sx={{ 
// 					position: 'absolute',
// 					right: '30px',
// 					bottom: '20px',
// 					opacity: '1',
// 					color: '#fefefefb',
// 				}}
// 				onClick={() => { 
// 					const input = document.getElementById('profile-picture-upload'); 
// 					if (input) { input.click(); } 
// 				}}
// 			/>
// 		</div>
// 	);
// };

const ProfilePicture: React.FC<ProfilePictureProps> = ({profilePicture, handleUpload }) => {
	const [imageIsLoaded, setImageIsLoaded] = React.useState(false);

	useEffect(() => {
		if (profilePicture) {
			setTimeout(() => {
				setImageIsLoaded(true);
			  }, 400); // 1 second delay
		}
	}, [profilePicture]);

	return (
		<div className='ProfilePicture'>
			<input type='file' id='profile-picture-upload'
				style={{ display: 'none' }}
				accept='.jpg,.jpeg,.png'
				onChange={handleUpload}
			/>
			{imageIsLoaded ? (
				<Avatar
					className='Avatar'
					alt='Profile Picture'
					sx={{
						width: 150,
						height: 150,
						verticalAlign: 'middle',
						border: '#f8f8f8 4px solid',
						margin: '10px 20px 10px 10px'
					}}
					src={profilePicture ? URL.createObjectURL(profilePicture) : undefined }
				/>
			) : (
				// <Skeleton
				// 	className='Avatar'
				// 	variant='circular' 
				// 	sx={{
				// 		width: 150,
				// 		height: 150,
				// 		verticalAlign: 'middle',
				// 		border: '#f8f8f8 4px solid',
				// 		backgroundColor: '#f8f8f8',
				// 		margin: '10px 20px 10px 10px',
				// 		// animation: 'wave 1s infinite'
				// 	}}
				// 	>

				// </Skeleton>
				<CircularProgress
					id='LoadingAvatar'
					size={150}
					thickness={2}
					sx={{	
					color: '#f8f8f8'
					}}
		  		/>
			)}

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
