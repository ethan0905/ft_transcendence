import React from 'react';
import AuthCode from 'react-auth-code-input';

function verify2FA() {
        const [twoFACode, setTwoFACode] = React.useState('');

        const handleOnChange = (code: string) => {
                setTwoFACode(code);
                console.log("2fa code: ", code);
              };

        async function activate2FA(): Promise<any> {
        const response = await fetch('http://localhost:3333/auth/2fa/verify', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ twoFACode: twoFACode })
        });
        const data = await response.json();
        if (data)
        {
		window.location.href = "http://localhost:3000/SUCCESS";
        }
        return data;
        }

	return (
        <div>
		<AuthCode
		allowedCharacters='numeric'
		onChange={handleOnChange}
		/>
		<button onClick={activate2FA}>Submit code</button>        </div>
	);
  }
  
  export default verify2FA;