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
import { useState } from 'react';
import { useEffect } from 'react';
import PrivateRoute from './components/private-route';

function App() {

    return (
     
      <div className="App">
        <Routes>
          <Route path='/' element={<AuthPage/>} />
          <Route path='/login' element={<AuthPage/>} />

          <Route
            path="/2fa/verification"
            element={
              <PrivateRoute>
                <Verify2FA />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/myProfile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/Profile/:id"
            element={
              <PrivateRoute>
                <UserPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/Chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/Game"
            element={
              <PrivateRoute>
                <GamePage />
              </PrivateRoute>
            }
          />


          <Route
            path="/Leaderboard"
            element={
              <PrivateRoute>
                <LeaderboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/*"
            element={
              <PrivateRoute>
                <ErrorPage />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>

    );
}

export default App;
