import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: 'http://192.168.0.105:3333',
});

api.interceptors.request.use(async config => {
  const token = await getToken();
  if (token) {
    config.headers['x-access-token'] = `${token}`;
  }
  return config;
});

export default api;
