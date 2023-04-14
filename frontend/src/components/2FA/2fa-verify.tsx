import React from 'react';
import AuthCode from 'react-auth-code-input';

function Verify2FA() {
	const [twoFACode, setTwoFACode] = React.useState('');

	const handleOnChange = (code: string) => {setTwoFACode(code);};

	async function check2FACode(): Promise<any> {
		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}` + '/auth/2fa/verify', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({ twoFACode: twoFACode })
		});
		// console.log(response);
		const data = await response.json();
		if (data === true)
		{
			// console.log("SUCCESS");
			window.location.href = `${process.env.REACT_APP_FRONTEND_URL}` + "/myProfile";
		}
		return data;
	}

return (
	<div>

		<AuthCode
		allowedCharacters='numeric'
		onChange={handleOnChange}
		/>
		<button onClick={check2FACode}>Submit code</button>

	</div>
	);
}
	
export default Verify2FA;