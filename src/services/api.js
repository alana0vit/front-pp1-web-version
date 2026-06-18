import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'
});

api.interceptors.request.use((config) => {
  const userStorage = localStorage.getItem('@ConectaPro:user');
  
  if (userStorage) {
    const userObj = JSON.parse(userStorage);
    if (userObj && userObj.token) {
      config.headers.Authorization = `Bearer ${userObj.token}`;
    }
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;