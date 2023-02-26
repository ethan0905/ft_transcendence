import axios from 'axios';

export const signupUser = (data) => {
  return axios.post('http://localhost:3333/auth/signup', data).then(response => response.data);
}

export const signinUser = (data) => {
  return axios.post('http://localhost:3333/auth/signup', data).then(response => response.data);
}