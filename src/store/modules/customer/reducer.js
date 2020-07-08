import types from './types';

const INITIAL_STATE = {
  customers: {},
  fabricators: {},
  models: {},
  loading: false,
};

export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.LOAD_DASHBOARD_REQUEST:
      return { ...state, loading: true };
    case types.LOAD_DASHBOARD_SUCCESS:
      return {
        customers: action.payload.customers,
        fabricators: action.payload.fabricators,
        models: action.payload.models,
        loading: false,
      };
    default:
      return state;
  }
}
