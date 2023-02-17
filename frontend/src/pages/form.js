import "./form.css";
import { signupUser, signinUser } from './user.js';

function FormPage() {

  // const [users, setUsers] = useState({
  //   email: "",
  //   password: "",
  // });

  // function handleChange(event) {
	// 	const value = event.target.value;
	// 	setUsers({
	// 		...users,
	// 		[event.target.name]: value
	// 	});
	// }

  const submitSignup = (e) => {
    e.preventDefault();
    signupUser({
      email: "paul454@gmail.com",
      password: '12345',
    }).then((data) => console.log(data))
    // .then(() => getUsers().then(data => setUsers(data)));
  }

  const submitSignin = (e) => {
    e.preventDefault();
    signinUser({
      email: 'hello@gmail.com',
      password: '12345',
    }).then((data) => console.log(data))
  }

  return (
    <div>
      <h1>Users or whatever</h1>

      <form onSubmit={submitSignup}>
        <div>
          <label>email docker:</label>
          <input></input>
        </div>
        <button type="submit">Post Signup</button>
      </form>
      <form onSubmit={submitSignin}>
        <div>
          <label>password:</label>
          <input></input>
        </div>
        <button type="submit">Post Signin</button>
      </form>

    </div>
  );
}

export default FormPage;