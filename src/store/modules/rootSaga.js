import { all } from 'redux-saga/effects';

import auth from './auth/saga';
import customer from './customer/saga';
import finance from './finance/saga';

export default function* rootSaga() {
  return yield all([auth, customer, finance]);
}
