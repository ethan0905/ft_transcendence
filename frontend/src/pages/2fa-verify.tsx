import React from 'react';
import AuthCode from 'react-auth-code-input';

function Verify2FA() {
	const [twoFACode, setTwoFACode] = React.useState('');

	const handleOnChange = (code: string) => {setTwoFACode(code);};

	async function check2FACode(): Promise<any> {
		const response = await fetch('http://localhost:3333/auth/2fa/verify', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ twoFACode: twoFACode })
		});
		// console.log(response);
		const data = await response.json();
		if (data === true)
		{
			// console.log("SUCCESS");
			window.location.href = "http://localhost:3000/myProfile";
		}
		return data;
	}

return (
	<div className='2faVerifyPage' style={{
		width: '100%',
		height: '100vh',
		backgroundSize: 'cover',
		backgroundImage: `url(https://m.media-amazon.com/images/M/MV5BNTliMGU4ZDAtN2JlYy00ZTBiLWFlMDEtNTFiMDIyYmYyMTA1L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg)`,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
		display: 'flex',
		flexDirection: 'column',
		// justifyContent: 'center',
		alignItems: 'center',
		fontFamily: 'Kocak',
		color: 'white',
	}}>
		<h1>Two-Factor Authentication</h1>
		<AuthCode allowedCharacters='numeric' onChange={handleOnChange}/>
		<button onClick={check2FACode}>Submit code</button>
	</div>
	);
}
	
export default Verify2FA;