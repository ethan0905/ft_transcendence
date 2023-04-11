import Sidebar from '../components/Sidebar/Sidebar';
import { Button } from '../components/button/button'

export default function Auth() {
	return (
	<>
		<div className='AuthPage' style={{
			width: '100%',
			height: '100vh',
			backgroundSize: 'cover',
			backgroundImage: `url(/background.jpg)`,
			backgroundRepeat: 'no-repeat',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: 'Kocak',
		}}>

			<div className='overlay' style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<h1 style={	{
					color: '#d62222',
					textShadow: '0 0 10px #c2bdbd',
				}}>Are you ready ?</h1>
				<Button 
				text="Log in with 42"
				onClick={() => {
					window.open('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code', "_self");
				}}
				/>
				{/* <Button text="Let's Play" 
				onClick={() => {window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code';}}
			/> */}
			</div>

		</div>
	</>
	);
}
