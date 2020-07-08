import { combineReducers } from 'redux';

import auth from './auth/reducer';
import customer from './customer/reducer';

export default combineReducers({
  auth,
  customer
});
