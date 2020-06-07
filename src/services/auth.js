import api from './api';

// Não funciona sem isso aqui!!!
export const TOKEN_KEY = "x-access-token";

export function signin(email, password) {
  return api.post('/session/signin', { email, password });
}

export function resetPassword(email) {
  return api.post('/session/forgot', { email });
}
