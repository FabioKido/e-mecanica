import api from '../api';

export function getUserInfo() {
  return api.get('/user/inf');
}
