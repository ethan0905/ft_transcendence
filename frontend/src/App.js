import './App.css';
import { Button } from './components/button';

function App() {
  return (
    <div className="App">

      <Button 
        text="Log in with 42"
        onClick={() => {
          window.open('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-c3680374c7c94850b80d768576ab99300705487e1f5c7f758876aaf8fbf5fbdb&redirect_uri=http%3A%2F%2Flocalhost%3A3333%2Fauth%2F42%2Fcallback&response_type=code', "_self");
        }}
      />

      <Button 
        text="Logout"
        onClick={() => {
          window.open('http://localhost:3333/auth/42/logout', "_self");
        }}
      />

    </div>
  );
}

export default App;
