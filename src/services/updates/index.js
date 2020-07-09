import api from '../api';

export function updateAccount(id, value) {
  return api.put(`/finance/account/${id}`, { initial_value: value })
}
