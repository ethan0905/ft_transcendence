import Sidebar from '../components/Sidebar/Sidebar';

export default function LeaderboardPage() {
	return (
		<>
			<Sidebar />
			<div className='UserPage' style={{
				width: '100%',
				backgroundSize: 'cover',
				backgroundImage: `url(/friends.png)`,
				backgroundRepeat: 'no-repeat',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				}}>

			<h1 style={{
				textAlign: "center",
				color: '#ff0000',
				fontSize: '100px',
			}}>Friends List</h1>
		
		</div>
	</>
	);
}
