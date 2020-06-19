import api from './api';

export function signin(email, password) {
  return api.post('/session/signin', { email, password });
}

export function resetPassword(email) {
  return api.post('/session/forgot', { email });
}
