// import './App.css';
// // import { Button } from './components/button';
// // import Switch from '@mui/material/Switch';
// // import FormControlLabel from '@mui/material/FormControlLabel';
// // import React from 'react';
// // import { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import AuthCode from 'react-auth-code-input';
// import Verify2FA from './components/2fa-verify';
// import LoginPage from './components/login';
// import HomePage from './components/homepage';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import { Routes } from 'react-router-dom';

import './App.css';
import { Routes, Route } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import ProfilePage from "./pages/ProfilePage"
import ChatPage from "./pages/ChatPage"
import GamePage from "./pages/GamePage"
import LeaderboardPage from "./pages/LeaderboardPage"
import ErrorPage from "./pages/ErrorPage"
import UserPage from "./pages/UserPage"
import Verify2FA from "./components/2fa-verify"
import HomePage from "./components/homepage"

function App() {
  
    return (
      // <Router>
      //   <div>
      //     <Routes>
      //       <Route path="/" element={<LoginPage/>}/>
      //       <Route path="/login" element={<LoginPage/>}/>
      //       <Route path="/2fa/verification" element={<Verify2FA/>}/>
      //       <Route path="/homepage" element={<HomePage/>}/>
      //     </Routes>
      //   </div>
      // </Router>

    // <Router>

      <div className="App">
        <Routes>
          <Route path='/' element={<AuthPage/>} />
          <Route path='/login' element={<AuthPage/>} />
          <Route path="/2fa/verification" element={<Verify2FA/>}/>
          {/* <Route path='/myProfile' element={<HomePage/>} /> */}
          <Route path='/myProfile' element={<ProfilePage/>} />
          <Route path='/Profile/:id' element={<UserPage/>} />
          <Route path='/Chat' element={<ChatPage/>} />
          <Route path='/Game' element={<GamePage/>} />
          <Route path='/Leaderboard' element={<LeaderboardPage/>} />
          <Route path='/*' element={<ErrorPage/>} />
        </Routes>
      </div>

    // </Router>
    );
}

export default App;
