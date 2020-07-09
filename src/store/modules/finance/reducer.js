import types from './types';

const INITIAL_STATE = {
  updated: false
};

export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_ACCOUNT_REQUEST:
      return { ...state, updated: true };
    case types.UPDATE_ACCOUNT_SUCCESS:
      return { ...state, updated: false };
    default:
      return state;
  }
}
