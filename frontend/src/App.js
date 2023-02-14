import logo from './logo.svg';
import './App.css';
import FormPage from './pages/form.js'; 

function App() {
  // const object = {
  //   email: 'front@gmail.com',
  //   password: '12345',
  // };

  // const data = await axios.post('http://localhost:3333/auth/signup', object);

  // if (data.status === parseInt('401'))
  //   console.log("error 401");
  // else
  //   console.log("Success");

  return (
    <div>
      <FormPage />
    </div>
  );
}

export default App;
