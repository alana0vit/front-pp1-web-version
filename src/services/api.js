import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor para injetar o token em todas as requisições
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('@ConectaPro:token');
  
  if (token) {
    // O padrão Bearer é o esperado pelo Spring Security que o time de back configurou
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;