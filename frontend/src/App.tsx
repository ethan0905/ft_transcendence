import './App.css';
import { Button } from './components/button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import QRCode from 'react-qr-code';
import AuthCode, { AuthCodeRef } from 'react-auth-code-input';
import { useRef } from 'react';

function App() {
  
  const AuthInputRef = useRef<AuthCodeRef>(null);

  const [checked, setChecked] = React.useState(false);
  // const [otpAuthUrl, setOtpAuthUrl] = React.useState('');
  const [qrcodeDataUrl, setQrcodeDataUrl] = React.useState('');
  const [token, setToken] = useState('');
  const [twoFACode, setTwoFACode] = React.useState('');

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

  /**
 * Display a base64 URL inside an iframe in another window.
 */
  function debugBase64(base64URL: string){
    var win = window.open();
    if (win)
      win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }

  const handleOnChange = (code: string) => {
    setTwoFACode(code);
    console.log("2fa code: ", code);
  };

  // function submit2FACode() {
  //   console.log("submit 2fa code: ", twoFACode);
  //   axios.post('http://localhost:3333/auth/2fa/verify', { token, twoFactorCode: twoFACode }).then(response => {
  //     console.log("response: ", response);
  //   }).catch(error => {
  //     console.error(error);
  //   });
  // }

  // const submit2FACode = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const response = await fetch('http://localhost:3333/auth/2fa/verify', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ twoFACode })
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // };

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
      window.location.href = "http://localhost:3000/mainpage";
    console.log(data);
    return data;
  }
  

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
            <Button
            text="Get QRCode"
            onClick={debugBase64(qrcodeDataUrl)}
            // onClick={() => {
            //   // window.open(qrcodeDataUrl, "_blank");
            //   // window.open("data:image/png;base64,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", "_blank");
            // }}
            />
            
            // <QRCode value="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAElBMVEX///8AAABVwtN+AAAAAnRSTlMAAHaTzTgAAAENJREFUeNrs2QENACAIA0B8Y6U1F6EBZmABASmKMHKInuAV7yaOwFIUGyC7VmuL4X3qOz4AQAAAAAAAAAAAAAAAAAAAACASzCGAAH1Q2gBAAAAAElFTkSuQmCC" />
            // data:image/png;base64,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
            // <QRCode value="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAADkCAYAAACIV4iNAAAAAklEQVR4AewaftIAAAxjSURBVO3BQW4ky5LAQDKh+1+Zo6WvAkhUqX/Mg5vZL9ZaV3hYa13jYa11jYe11jUe1lrXeFhrXeNhrXWNh7XWNR7WWtd4WGtd42GtdY2HtdY1HtZa13hYa13jYa11jYe11jV++JDKv1RxojJVTConFd+k8kbFicq/VHGiMlVMKlPFicpUcaIyVUwq/1LFJx7WWtd4WGtd42GtdY0fvqzim1Q+oXJScaIyVUwqU8VUMam8oTJVTCpTxRsqU8Wk8obKVDGpTBUnKt9U8U0q3/Sw1rrGw1rrGg9rrWv88MdU3qh4Q+Wk4kTlDZWp4kRlqjhR+YTKVDGp3KziROWbVN6o+EsPa61rPKy1rvGw1rrGD/9xKicVb6hMKlPFVPFNKlPFpPJGxRsVk8obFZPKScVJxX/Jw1rrGg9rrWs8rLWu8cN/XMUbKlPFN6l8k8qJyhsqb1S8oTJVTConFf9lD2utazysta7xsNa6xg9/rOImKicVk8pJxaRyUjGpvFHxhspU8QmVqWJSOamYVE5UpopvqrjJw1rrGg9rrWs8rLWu8cOXqfwvVUwqU8Wk8kbFpDJVTCpvVEwqJypTxRsqU8WkMlVMKlPFpPJGxaRyojJVnKjc7GGtdY2HtdY1HtZa1/jhQxU3UZkqJpWp4i9VTConKm9UvKHyRsWkcqIyVUwqU8WkMlV8ouL/k4e11jUe1lrXeFhrXcN+8QGVqWJS+aaKT6hMFZ9QmSreUJkqJpVvqphUTiomlaliUvlExaRyUnGi8k0Vf+lhrXWNh7XWNR7WWtf44Y9VTCpvVEwqU8WJylQxqdxE5aTiRGWqmFTeUJkqTipOVKaKSWWqmFQmlanipOJmD2utazysta7xsNa6xg9fpjJVvFExqUwVJypTxRsVk8pUMalMKicVJxUnKlPFicpJxaQyVUwqU8WkclIxqZyoTBWTyknFicpUMam8UfGJh7XWNR7WWtd4WGtd44c/pjJVvFExqUwVb6h8QmWqOFGZVE5U/iWVqeINlZOKSeWNikllqphU3qiYVP6XHtZa13hYa13jYa11DfvFB1S+qWJS+UTFicpUcaJyUnGiMlWcqEwVN1OZKiaVk4o3VKaKSWWqeEPljYpPPKy1rvGw1rrGw1rrGvaLD6hMFScqU8WkMlVMKlPFGyp/qeITKlPFicpUcaJyUjGpTBWTyicqTlS+qeITKlPFNz2sta7xsNa6xsNa6xr2iz+kMlVMKlPFpPKJik+oTBVvqJxUvKHyRsWk8kbFJ1ROKiaVk4pJZap4Q2WqmFTeqPjEw1rrGg9rrWs8rLWuYb/4QyqfqDhRmSomlZOKSeUTFZPKVHGiMlWcqEwV36RyUjGpTBWTyknFicpUMalMFScqJxWTylTxTQ9rrWs8rLWu8bDWusYPl1P5lyomlaniRGWqmFSmiqniROUTKlPFpHJScVJxUjGpfEJlqnij4kTlX3pYa13jYa11jYe11jV++DKVk4pJ5aRiUvkmlaniROUNlaniRGWq+ITKVHFSMalMKlPFpDJVTCqfqHhDZap4o2JS+UsPa61rPKy1rvGw1rrGDx9S+aaKSeUTFW+oTBUnKlPFicpUcaIyVUwqk8pUMalMFZPKScVJxUnFpPKGyhsVk8pUMalMFVPFX3pYa13jYa11jYe11jXsF1+k8kbFpDJVTCpTxRsqJxWTylTxTSonFd+kclIxqbxRMal8ouJEZaqYVN6oOFGZKr7pYa11jYe11jUe1lrX+OFDKlPFGypTxaQyVUwqb1ScqEwVk8pU8YbKGyqfqPimik9UTCpTxYnKicpUMalMFScqJypTxSce1lrXeFhrXeNhrXUN+8UXqUwV36QyVfxLKlPFpDJVnKi8UfGXVN6oeENlqphUpopJZao4UTmpeENlqvimh7XWNR7WWtd4WGtdw37xAZWTiknlX6qYVN6oeENlqjhRmSomlX+p4g2VNyreUJkqJpW/VPEvPay1rvGw1rrGw1rrGvaLL1L5RMUbKicVk8pJxaRyUjGpnFScqJxUvKHyiYqbqUwVb6hMFW+oTBWfeFhrXeNhrXWNh7XWNX74kMpUMal8QmWqeENlqjhReUNlqjhROamYVE5Upoo3KiaVSWWqmFSmihOVk4pJZap4Q2WqOFH5X3pYa13jYa11jYe11jV++DKVqeJE5aTijYoTlZOKN1Q+UTGpvFHxCZVPVPylik9UfKJiUpkqvulhrXWNh7XWNR7WWtewX/whlX+pYlJ5o+JEZaqYVKaKN1T+UsW/pPJNFZPKTSo+8bDWusbDWusaD2uta9gvPqByUjGpTBWTylQxqbxRMal8omJSmSq+SeUTFScq31TxTSpTxYnKVDGpTBWTylRxojJVfOJhrXWNh7XWNR7WWtf44UMVk8qkMlVMKicqU8X/kspUcaIyVZyoTBWTyknFicpUcaIyVZyonFRMKlPFicpJxScqTlT+0sNa6xoPa61rPKy1rvHDH6uYVE4qTlTeqHijYlKZKj6hclIxqUwVk8qkclIxqUwVJypTxUnFJypOVE5UpooTlaliqvhLD2utazysta7xsNa6hv3iAypTxaTyTRVvqEwVk8pUcaLyiYpJZao4UXmj4g2VqWJSmSpOVKaKSeWbKiaVk4oTlTcqPvGw1rrGw1rrGg9rrWv88GUqU8Wk8kbFicpfUjmpmFSmiknlDZWpYlKZKiaVk4o3Kv6XKk5UpooTlZs8rLWu8bDWusbDWusaP/wxlZOKE5Wp4o2KN1Q+UfGXVKaKk4oTlaniROUTKlPFicobFScqU8VNHtZa13hYa13jYa11DfvF/5DKScUbKlPFpHJSMalMFd+kMlW8oTJVnKi8UXGiMlVMKlPFiconKiaVqWJSOamYVKaKb3pYa13jYa11jYe11jXsFx9QOak4UZkqJpU3Kj6hclIxqZxUnKh8omJSmSpOVKaKSeUTFZPKVPGGylRxonJSMalMFScqU8UnHtZa13hYa13jYa11DfvFB1SmikllqjhRmSomlaliUjmpmFSmiknlmypOVKaKE5Wp4kTljYpJ5aRiUvmmihOVqeJEZap4Q2Wq+MTDWusaD2utazysta5hv/hDKicVJypTxYnKVDGpTBVvqEwVJyp/qeJE5RMVJypvVJyovFExqfylir/0sNa6xsNa6xoPa61r2C++SGWqOFGZKr5J5aRiUnmjYlKZKt5QOamYVKaKE5W/VPEJlaniEyonFW+oTBXf9LDWusbDWusaD2uta9gvvkhlqnhD5aTiROWk4hMqn6j4hMpJxaQyVUwqU8WJylQxqbxRMam8UXGiMlVMKlPFGypTxSce1lrXeFhrXeNhrXWNH/6YyknFVHGiclIxqZyoTBVvVEwqU8WJyjepTBUnFScqU8WkMlX8pYoTlaliUvmEyl96WGtd42GtdY2HtdY17BcfUHmj4g2VqWJSmSpOVN6o+ITKzSq+SWWqmFT+P6v4Sw9rrWs8rLWu8bDWusYPH6r4SxXfVHGiMqlMFZPKGxVvqEwVb6hMFZPKScWkMlV8omJSmSomlZOKN1SmikllUpkqvulhrXWNh7XWNR7WWtf44UMq/1LFVHGiMlW8UTGpnFRMKn9JZao4UTmpeENlqphUpopJ5URlqphUTlSmihOVN1Smik88rLWu8bDWusbDWusaP3xZxTepnKhMFW+oTBWTylQxqbyhMlVMKm9UfJPKScWkMqlMFZPKVHGiMqm8UfGXKr7pYa11jYe11jUe1lrX+OGPqbxR8U0VJxUnFTdR+UTFN1WcqJyonFScqEwqn6h4Q2Wq+MTDWusaD2utazysta7xw3+cyknFN6lMFW9UTCpTxYnKicpJxYnKJyomlaliUpkqTiomlTdUpopJZar4poe11jUe1lrXeFhrXeOH/xiVN1SmikllqjipOFGZKiaVE5WTikllqphUJpU3Kk5UJpUTlaliUnmjYlKZKiaVSWWqmFSmik88rLWu8bDWusbDWusaP/yxir9UMamcVPwllaliqvhLKm9UnKi8oTJVTConFScVk8qJyv8nD2utazysta7xsNa6hv3iAyr/UsWkclLxhso3VUwqn6iYVKaKE5WpYlI5qfgmlZOKN1Smim9SOan4xMNa6xoPa61rPKy1rmG/WGtd4WGtdY2HtdY1HtZa13hYa13jYa11jYe11jUe1lrXeFhrXeNhrXWNh7XWNR7WWtd4WGtd42GtdY2HtdY1HtZa1/g/fK7PE4cyCZEAAAAASUVORK5CYII" />
            // <QRCode value="data:image/png;base64,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"/>
            // <QRCode value="data:image/png;base64,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"/>
          }
        </div>
      )}
      <>
        <AuthCode
          allowedCharacters='numeric'
          onChange={handleOnChange}
        />
        <button onClick={submit2FACode}>Submit code</button>
      </>

    </div>
  );
}

export default App;
