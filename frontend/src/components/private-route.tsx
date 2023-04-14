import React from 'react';
import { BrowserRouter as Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilePage from '../pages/ProfilePage';
import AuthPage from "../pages/AuthPage"

const PrivateRoute : React.FC<{children: React.ReactElement}> = ({children}) => {

	const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

    useEffect(() => {
        checkUserToken();
    }, []);

    async function checkUserToken() {
        let cookieToken = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        const response = await fetch('http://localhost:3333/auth/42/verify', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `${cookieToken}`
            },
        });
    
        if (response.status === 400 || response.status === 401 || response.status === 403 || response.status === 404) {
            navigate('/login');
            return;
        }

        const data = await response.json();
        console.log('data: ', data);

        if (data.error) {
            console.log('SET FALSE');
            setIsAuthenticated(false);
        }
        else {
            console.log('SET OK');
            setIsAuthenticated(true);
        }

    }

    if (isAuthenticated) {
        return children;
    }
    return (
        <>
            <AuthPage />
        </>
    );
};

export default PrivateRoute;