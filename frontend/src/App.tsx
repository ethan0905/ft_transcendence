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
    // if (!checked && qrcodeDataUrl) {
    //   console.log("hereeeeeee\n");
    //   debugBase64(qrcodeDataUrl);
    // }
  }, [token]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    setChecked(event.target.checked);
    console.log("status: ", !checked);

    // console.log("token: ", token);
    // if (!checked)
    // {
      axios.post('http://localhost:3333/auth/2fa/enable', { token, twoFactorAuth: !checked }).then(response => {
      setQrcodeDataUrl(response.data);
      console.log("qrcodeDataUrl: ", response.data);

    // }

    // console.log(response);
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

  // function handleQRCodeLoad() {
  //   console.log("handle qr load url -> ", qrcodeDataUrl);
  //   debugBase64(qrcodeDataUrl);
  // };

  const handleOnChange = (code: string) => {
    setTwoFACode(code);
    console.log("2fa code: ", code);
  };

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
  
  if (token && !checked) {
    return (
      <div className="App">
      <>
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
          {qrcodeDataUrl && (
            <div>
                <p>{qrcodeDataUrl}</p>
            </div>
          )}
          </div>
          )
        }

        {qrcodeDataUrl && (
          <div>
            <button onClick={() => debugBase64(qrcodeDataUrl)}>Get QR</button>
             {/* <Button
                  text="Get QR"
                  onClick={debugBase64(qrcodeDataUrl)}/> */}
          </div>
          )
        }

      </>

{/* 
      {checked && (
          <div>
          {qrcodeDataUrl && (
            <div>
                <p>{qrcodeDataUrl}</p>
            </div>
          )}
          </div>
          )
        } */}
    </div>
    );
  }
  else if(token && checked) {
    return (
      <>
        <AuthCode
          allowedCharacters='numeric'
          onChange={handleOnChange}
        />
        <button onClick={submit2FACode}>Submit code</button>
      </>
    )
  }
  else {
    return (
            <>
              <Button 
              text="Log in with 42"
              onClick={() => {
                window.open('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code', "_self");
              }}
              />
            </>
    );
  }
  // return (
  //   <div className="App">

  //   {!token && (
  //     <>
  //       <Button 
  //       text="Log in with 42"
  //       onClick={() => {
  //         window.open('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code', "_self");
  //       }}
  //       />
  //     </>
  //     )
  //   }

  //   {token && (
  //     <>
  //       <Button 
  //         text="Logout"
  //         onClick={() => {
  //           window.open('http://localhost:3333/auth/42/logout', "_self");
  //         }}
  //       />

  //       <FormControlLabel control={
  //         <Switch
  //           checked={checked}
  //           onChange={handleChange}
  //           inputProps={{ "aria-label": "controlled" }}
  //         />
  //       } label="Enable 2FA" />

  //       <p>Token: {token}</p>

  //       {checked && (
  //         <div>
  //         {qrcodeDataUrl && (
  //           <div>
  //               <p>{qrcodeDataUrl}</p>
  //           </div>
  //         )}
  //         </div>
  //         )
  //       }

  //       {qrcodeDataUrl && (
  //         <div>
  //            <Button
  //                 text="Get QR"
  //                 onClick={debugBase64(qrcodeDataUrl)}/>
  //         </div>
  //         )
  //       }

  //     </>
  //     )
  //   }

  //   {token && (
  //     <>
  //     {!checked && (
  //       <>
  //         <AuthCode
  //           allowedCharacters='numeric'
  //           onChange={handleOnChange}
  //         />
  //         <button onClick={submit2FACode}>Submit code</button>
  //       </>
  //       )
  //     }
  //     </>
  //   )
  //   }
  //     <>
  //       {/* <AuthCode
  //         allowedCharacters='numeric'
  //         onChange={handleOnChange}
  //       />
  //       <button onClick={submit2FACode}>Submit code</button> */}
  //     </>

  //   </div>
  // );
}

export default App;
