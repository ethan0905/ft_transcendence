import './App.css';
import { Routes, Route } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import ChatPage from "./pages/ChatPage"
import GamePage from "./pages/GamePage/GamePage"
import ErrorPage from "./pages/ErrorPage"
import UserPage from "./pages/UserPage"
import Verify2FA from "./components/2FA/2fa-verify"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<AuthPage/>} />
        <Route path='/login' element={<AuthPage/>} />
        <Route path="/2fa/verification" element={<Verify2FA/>}/>
        <Route path='/myProfile' element={<ProfilePage/>} />
        <Route path='/Profile/:id' element={<UserPage/>} />
        <Route path='/Chat' element={<ChatPage/>} />
        <Route path='/Game' element={<GamePage/>} />
        <Route path='/*' element={<ErrorPage/>} />
      </Routes>
    </div>
  );
}

export default App;
