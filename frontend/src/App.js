import logo from './logo.svg';
import './App.css';
import { Button } from './components/button';

function App() {
  return (
    <div className="App">

      <Button 
        text="Log in with 42"
        onClick={() => {
          window.location.href = 'http://localhost:3000/auth/42';
        }}
      />

    </div>
  );
}

export default App;
