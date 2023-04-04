import './App.css';
import { Button } from './components/button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthCode from 'react-auth-code-input';
import Verify2FA from './components/2fa-verify';
import LoginPage from './components/login';
import HomePage from './components/homepage';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';

function App() {
  
    return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/2fa/verification" element={<Verify2FA/>}/>
            <Route path="/homepage" element={<HomePage/>}/>
          </Routes>
        </div>
      </Router>
    );
}

export default App;
