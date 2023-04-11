import Sidebar from '../components/Sidebar/Sidebar';

export default function GamePage() {
	return (
		<>
			<Sidebar />
			<div className='GamePage' style={{
				height: '100%',
				width: '100%',
				backgroundSize: 'cover',
				backgroundImage: `url(https://i.pinimg.com/originals/9a/f5/fa/9af5fa07f37310021f835c82827adf6c.png)`,
				backgroundRepeat: 'no-repeat',
				backgroundOrigin: 'center',
				backgroundAttachment: 'local',
			}}>
			<div className='GamePage_font' style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'rgba(255, 255, 255, 0.5)',	
			}}>
			<h1 style={{textAlign: "center", color: '#fbf9f9', fontSize: '70px', textShadow: '1px 5px 5px black'  }}>
				Game loading...
			</h1>
		
			</div>
		</div>
		</>
	);
}
