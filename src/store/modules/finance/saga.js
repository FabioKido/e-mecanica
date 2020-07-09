import { Alert } from 'react-native';
import { takeLatest, all, call, put } from 'redux-saga/effects';

import { updateAccountSuccess } from './actions';

import { updateAccount } from '../../../services/updates';

import types from './types';

export function* updateAccountRequest({ payload }) {
  try {

    const {
      id_account_origin,
      id_account_destiny,
      total_value,
      origin_value,
      destiny_value,
    } = payload;

    const origin = Number(origin_value) - Number(total_value);
    const destiny = Number(destiny_value) + Number(total_value);

    yield call(updateAccount, id_account_origin, origin);

    yield call(updateAccount, id_account_destiny, destiny);

    yield put(updateAccountSuccess());

  } catch (err) {
    Alert.alert(
      'Houve um erro.'
    );
  }
}

export default all([
  takeLatest(types.UPDATE_ACCOUNT_REQUEST, updateAccountRequest),
]);
