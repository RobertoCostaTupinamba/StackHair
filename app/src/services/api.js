import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stack-hair.herokuapp.com/',
});

export default api;
