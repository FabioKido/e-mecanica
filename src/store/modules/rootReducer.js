import { combineReducers } from 'redux';

import auth from './auth/reducer';
import finance from './finance/reducer';

export default combineReducers({
  auth,
  finance
});
