import { combineReducers } from 'redux';

import auth from './auth/reducer';
import customer from './customer/reducer';
import finance from './finance/reducer';

export default combineReducers({
  auth,
  customer,
  finance
});
