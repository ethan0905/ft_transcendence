// import React from 'react';
// import { Route, Navigate, useNavigate } from 'react-router-dom';
// // import { isAuthenticated } from '../utils/auth';
// import { useState, useEffect } from 'react';

// // interface PrivateRouteProps {
// //     path: string;
// //     element: React.ReactElement;
// // }

// const PrivateRoute : React.FC<{children: React.ReactElement}> = ({children}) => {

//     const [token, setToken] = useState<boolean>(false);
//     const [authenticated, setAuthenticated] = useState<boolean>(false);

//     useEffect(() => {
//         checkUserToken();
//         const checkAuthentication = async () => {
//             const authenticated = await isAuthenticated();
//             setAuthenticated(authenticated);
//         };
//         checkAuthentication();
//     }, []);

//     async function checkUserToken() {
//         const token = localStorage.getItem('token');
//         if (token) {
//             console.log('token exists : ', token);
//             setToken(true);
//         }
//     }
      
//     async function isAuthenticated(): Promise<boolean> {
//         try {
//           const response = await fetch('/auth/42/verify', {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `${token}`
//             },
//           });
      
//           const data = await response.json();
//           if (data) {
//             // User is authenticated
//             return true;
//           } else {
//             // User is not authenticated
//             return false;
//           }
//         } catch (error) {
//           console.error('Error verifying authentication:', error);
//           return false;
//         }
//     }
      
//     // const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
//     //     const [authenticated, setAuthenticated] = React.useState<boolean>(false);
//     //     React.useEffect(() => {
//     //         const checkAuthentication = async () => {
//     //             const authenticated = await isAuthenticated();
//     //             setAuthenticated(authenticated);
//     //         };
//     //         checkAuthentication();
//     // }, []);

//     return (
//         <Route
//         path={children.props.path}
//         element={
//             isAuthenticated() ? ( children ) : (
//             <Navigate to="/login" replace />
//             )
//         }
//     />
//         // <Route
//         // {...rest}
//         // element={ authenticated ? (
//         //     element
//         //     ) : (
//         //     <Navigate to="/login" replace />
//         //     )
//         // }
//         // />
//     );
// }

// export default PrivateRoute;

import React from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';

export const PrivateRoute : React.FC<{children: React.ReactElement}> = ({children}) => {
    const isAuthenticated = false;
        
    if (isAuthenticated ) {
      return children
    }
      
    return <Navigate to="/login" />
  }
