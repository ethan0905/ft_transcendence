export default function NotFound() {
	return (
	<div className='404Page' style={{
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
    }}>
		<h1 style={{
			fontFamily: 'Kocak',
			color: '#0a0202',
			textShadow: '1px 1px 10px #777472',
		}}>Error 404: Page not found</h1>

		<img src='/404notfound.jpeg' alt='404' style={{
			maxWidth: '100%',
			height: '300px',
		}}/>

		<h1 style={{
			fontFamily: 'Shadows Into Light, cursive',
			color: '#1d1b1b',
		}}>Where are you going ?</h1>

	</div>
	);
}
