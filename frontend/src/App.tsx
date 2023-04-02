import './App.css';
import { Button } from './components/button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from 'react-qr-code';

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
    console.log("status: ", !checked);
    axios.post('http://localhost:3333/auth/2fa/enable', { token, twoFactorAuth: !checked }).then(response => {

    // console.log(response);
    setQrcodeDataUrl(response.data);
    console.log("qrcodeDataUrl: ", response.data);
  }).catch(error => {
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
          {/* <p>data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAElBMVEX///8AAABVwtN+AAAAAnRSTlMAAHaTzTgAAAENJREFUeNrs2QENACAIA0B8Y6U1F6EBZmABASmKMHKInuAV7yaOwFIUGyC7VmuL4X3qOz4AQAAAAAAAAAAAAAAAAAAAACASzCGAAH1Q2gBAAAAAElFTkSuQmCC</p> */}
          <p>{qrcodeDataUrl}</p>
          {qrcodeDataUrl &&
            // <p>hey hey</p>
            <QRCode value="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAElBMVEX///8AAABVwtN+AAAAAnRSTlMAAHaTzTgAAAENJREFUeNrs2QENACAIA0B8Y6U1F6EBZmABASmKMHKInuAV7yaOwFIUGyC7VmuL4X3qOz4AQAAAAAAAAAAAAAAAAAAAACASzCGAAH1Q2gBAAAAAElFTkSuQmCC" />
            // <QRCode value="data:image/png;base64,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omJSmSomlZOKN1SmikllUpkqvulhrXWNh7XWNR7WWtf44UMq/1LFVHGiMlW8UTGpnFRMKn9JZao4UTmpeENlqphUpopJ5URlqphUTlSmihOVN1Smik88rLWu8bDWusbDWusaP3xZxTepnKhMFW+oTBWTylQxqbyhMlVMKm9UfJPKScWkMqlMFZPKVHGiMqm8UfGXKr7pYa11jYe11jUe1lrX+OGPqbxR8U0VJxUnFTdR+UTFN1WcqJyonFScqEwqn6h4Q2Wq+MTDWusaD2utazysta7xw3+cyknFN6lMFW9UTCpTxYnKicpJxYnKJyomlaliUpkqTiomlTdUpopJZar4poe11jUe1lrXeFhrXeOH/xiVN1SmikllqjipOFGZKiaVE5WTikllqphUJpU3Kk5UJpUTlaliUnmjYlKZKiaVSWWqmFSmik88rLWu8bDWusbDWusaP/yxir9UMamcVPwllaliqvhLKm9UnKi8oTJVTConFScVk8qJyv8nD2utazysta7xsNa6hv3iAyr/UsWkclLxhso3VUwqn6iYVKaKE5WpYlI5qfgmlZOKN1Smim9SOan4xMNa6xoPa61rPKy1rmG/WGtd4WGtdY2HtdY1HtZa13hYa13jYa11jYe11jUe1lrXeFhrXeNhrXWNh7XWNR7WWtd4WGtd42GtdY2HtdY1HtZa1/g/fK7PE4cyCZEAAAAASUVORK5CYII" />
            
          }
        </div>
      )}

    </div>
  );
}

export default App;
