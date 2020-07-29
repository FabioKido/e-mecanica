import { Alert } from 'react-native';
import { takeLatest, all, call, put } from 'redux-saga/effects';

import NavigationService from '../../../services/navigation';

import api from '../../../services/api';
import { signin } from '../../../services/auth';
import { signInSuccess, signInFailure } from './actions';

import types from './types';

export function* signInRequest({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(signin, email, password);

    const { access_token, user } = response.data;

    const token = access_token;

    api.defaults.headers.Authorization = `bearer ${token}`;

    yield put(signInSuccess(token, user));

    NavigationService.navigate('AppRoutes');

  } catch (err) {
    yield put(signInFailure());

    Alert.alert(
      'Houve um erro no login. Verifique seus dados e tente novamente.'
    );
  }
}

export function signOutRequest() {
  NavigationService.navigate('SignRoutes');
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest(types.SIGN_IN_REQUEST, signInRequest),
  takeLatest(types.SIGN_OUT_REQUEST, signOutRequest),
  takeLatest(types.PERSIST_REHYDRATE, setToken),
]);
