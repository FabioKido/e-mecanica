import api from '../api';

export function getUserInfo() {
  return api.get('/user/inf');
}

export function getCustomerInfo(id) {
  return api.get(`/customers/inf/${id}`);
}
