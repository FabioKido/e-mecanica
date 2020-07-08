import types from './types';

export function loadDashboardSuccess(customers, fabricators, models) {
  return {
    type: types.LOAD_DASHBOARD_SUCCESS,
    payload: { customers, fabricators, models },
  };
}

export function loadDashboardRequest() {
  return {
    type: types.LOAD_DASHBOARD_REQUEST,
  };
}