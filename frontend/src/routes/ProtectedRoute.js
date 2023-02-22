import React from 'react';
import { Route, Navigate } from 'react-router-dom';
// import { Component } from 'react';

const useAuth = () => {
    const user = { loggedIn: false };
    return user.loggedIn;
};

const ProtectedRoute = () => {
    const user = { loggedIn: false };
    // const isAuth = useAuth();

    return user.loggedIn ? <Route /> : <Navigate to="/login" />;
};

// const ProtectedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) => {
//         if (isLoggedIn) {
//           return <Component {...props} />;
//         } else {
//           return <Navigate to={{ pathname: '/login' }} />;
//         }
//       }}
//     />
//   );
// };

export default ProtectedRoute;