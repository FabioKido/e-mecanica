import api from '../api';

export function getUserInfo() {
  return api.get('/user/inf');
}

export function getCustomerInfo(id) {
  return api.get(`/customers/inf/${id}`);
}

export function getAutomovelInfo(id) {
  return api.get(`/vehicles/automobile/${id}`);
}

export function getBikeInfo(id) {
  return api.get(`/vehicles/bicycle/${id}`);
}

export function getDashboardCustomer() {
  return api.get('/dashboard/customers');
}
