import types from './types';

export function updateAccountRequest(
  id_account_origin,
  id_account_destiny,
  total_value,
  origin_value,
  destiny_value
) {
  return {
    type: types.UPDATE_ACCOUNT_REQUEST,
    payload: {
      id_account_origin,
      id_account_destiny,
      total_value,
      origin_value,
      destiny_value
    },
  };
}

export function updateAccountSuccess() {
  return {
    type: types.UPDATE_ACCOUNT_SUCCESS,
  };
}