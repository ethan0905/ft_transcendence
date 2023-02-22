import axios from 'axios';
import React from 'react';
import { Button } from '../components/button';

function LoginPage() {

  return (
    <div>
      <h1>login page </h1>
      <p> This is the adadsdad </p>
      <Button 
        text="Log in with 42"
        onClick={OAuthConnection}/>
    </div>
  );
}

function OAuthConnection() {
    console.log("OAuthConnection");

    axios.get('http://localhost:3000/oauth/token').then(response => response.data);
    // window.location.href = "http://api.intra.42.fr/oauth/token";
}

export default LoginPage;