import './App.css';
import { Button } from './components/button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [checked, setChecked] = React.useState(false);
  // const [otpAuthUrl, setOtpAuthUrl] = React.useState('');
  const [qrcodeDataUrl, setQrcodeDataUrl] = React.useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (cookieToken) {
      setToken(cookieToken);
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);

    // console.log("token: ", token);
    // console.log("status: ", !checked);
    axios.post('http://localhost:3333/auth/2fa/enable', { token, twoFactorAuth: !checked }).then(response => {

    // console.log(response);
    setQrcodeDataUrl(response.data);
    // setOtpAuthUrl(response.data.otpauthUrl);
    // console.log("otpAuthUrl: ", otpAuthUrl);
    // setQrcodeDataUrl(qrDataUrl);
    // console.log("!!!!!!qrcodeDataUrl: ", qrDataUrl.qrcodeDataUrl);
  })
  .catch(error => {
    console.error(error);
  });
  };

  return (
    <div className="App">

      <Button 
        text="Log in with 42"
        onClick={() => {
          window.open('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code', "_self");
        }}
      />

      <Button 
        text="Logout"
        onClick={() => {
          window.open('http://localhost:3333/auth/42/logout', "_self");
        }}
      />

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
          <p>{qrcodeDataUrl}</p>
        </div>
      )}

    </div>
  );
}

export default App;
