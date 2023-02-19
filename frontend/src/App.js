import './App.css';
import { Login } from './components/auth-form';
import ProtectedRoute from './routes/ProtectedRoute';
import MainPage from './pages/main-page';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <Routes>

          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route element={<ProtectedRoute/>}>
            <Route path="/homepage" element={<MainPage/>} />
          {/* <ProtectedRoute path="/home" element={MainPage} /> */}
          </Route>

      </Routes>
    </Router>
  );
}

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <Router>
//       <Routes>

//           <Route path="/login">
//             <Login setIsLoggedIn={setIsLoggedIn}/>
//           </Route>
//           <ProtectedRoute path="/home" component={MainPage} isLoggedIn={isLoggedIn} />

//       </Routes>
//     </Router>
//   );
// }

// const [currentForm, setCurrentForm] = useState('login');

// const toggleForm = (formName) => {
//   setCurrentForm(formName);
// }

{/* <div className='App'>
{
  currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
}
</div> */}

export default App;
