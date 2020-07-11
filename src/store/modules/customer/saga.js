import { Alert } from 'react-native';
import { takeLatest, all, call, put } from 'redux-saga/effects';

import { getDashboardCustomer } from '../../../services/infos';
import { loadDashboardSuccess } from './actions';

import types from './types';

export function* loadDashboardRequest() {
  try {

    const response = yield call(getDashboardCustomer);
    const { customers, fabricators, models } = response.data;

    yield put(loadDashboardSuccess(customers, fabricators, models));

  } catch (err) {
    Alert.alert(
      'Sem conexão com a internet!'
    );
  }
}

export default all([
  takeLatest(types.LOAD_DASHBOARD_REQUEST, loadDashboardRequest),
]);
