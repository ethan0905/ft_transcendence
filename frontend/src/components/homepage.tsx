import React from 'react';
import { useState } from 'react';
import { Button } from './button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import AuthCode from 'react-auth-code-input';
import { useEffect } from 'react';

function HomePage() {

	const [checked, setChecked] = React.useState(false);
	const [twoFAActivated, setTwoFAActivated] = React.useState(false);
	const [qrcodeDataUrl, setQrcodeDataUrl] = React.useState('');
	const [token, setToken] = useState('');
	const [twoFACode, setTwoFACode] = React.useState('');
  
	useEffect(() => {
	  if (token !== ''){
		console.log("token: ", token);
		check2FAStatus(token).then((status:any) => status.json()).then((status:any) => {
		  console.log("status: ", status);
		  setChecked(status.twoFactorAuth);
		});
	  }
	  let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	  if (cookieToken) {
		setToken(cookieToken);
	  }
  
	}, [token]);
  
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  
	  setChecked(event.target.checked);
	  console.log("status: ", !checked);
  
	  axios.post('http://localhost:3333/auth/2fa/enable', { token, twoFactorAuth: !checked }).then(response => {
  
	  console.log(response);
	}).catch(error => {
		console.error(error);
	  });
	};
  
	/**
	** Display a base64 URL inside an iframe in another window.
	**/
	function debugBase64(base64URL: string){
	  var win = window.open();
	  if (win)
		win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
	}
  
	const handleOnChange = (code: string) => {
	  setTwoFACode(code);
	  console.log("2fa code: ", code);
	};
  
	async function generateQRCode(): Promise<any> {
	  try {
		const response = await fetch('http://localhost:3333/auth/2fa/generate', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({ token: token })
		});
		const data = await response.json();
		console.log(data);
		setQrcodeDataUrl(data);
		debugBase64(data);
		return data;
	  } catch (error) {
		console.error(error);
		// handle error
	  }
	}
  
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
		setTwoFAActivated(true);
		console.log("DATA = ", data);
	  }
	  return data;
	}
  
	//submit2FACode function is not used right now, but keeping it..
	async function submit2FACode(): Promise<any> {
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
	  console.log(data);
	  return data;
	}
  
	async function check2FAStatus(accessToken: string): Promise<any>{
	  try {
		const response = await fetch('http://localhost:3333/auth/2fa/status', {
		  method: 'GET',
		  headers: {
			'Content-Type': 'application/json',
			'Authorization': `${accessToken}`
		  },
		});
		// const response = await axios.get('http://localhost:3333/auth/2fa/status'
		return response;
	  } catch (error) {
  
		console.error(error);
		// handle error
	  }
	}

	return (
      <div className='App'>

        <Button 
          text="Logout"
          onClick={() => {
            window.open('http://localhost:3333/auth/42/logout', "_self");
          }}
        />

        <p>Is 2FA activated ? {twoFAActivated}</p>

         <FormControlLabel control={
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        } label="Enable 2FA" />

        <p>Token: {token}</p>

        {checked && (
          <div>
          {qrcodeDataUrl && (
            <div>
                <p>{qrcodeDataUrl}</p>
            </div>
          )}
          </div>
          )
        }

        <button onClick={generateQRCode}>Generate QR code</button>

		<AuthCode
		allowedCharacters='numeric'
		onChange={handleOnChange}
		/>
		<button onClick={activate2FA}>Submit code</button>

    </div>
	);
  }
  
  export default HomePage;