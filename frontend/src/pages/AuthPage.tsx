import { Button } from '../components/Button/button'

export default function Auth() {
	return (
	<>
		<div className='AuthPage' style={{
			width: '100%',
			height: '100vh',
			backgroundSize: 'cover',
			backgroundImage: `url(/background.jpg)`,
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center',
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
					color: '#000000',
					textShadow: '0px 1px 8px #f6d21d',
				}}>Are you ready ?</h1>
				<Button text="Login with 42"
					onClick={() => {window.open('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code', "_self");}}
				/>
			</div>
		</div>
	</>
	);
}
