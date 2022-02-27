import types from './types';
import { takeLatest, all, call, put, select } from 'redux-saga/effects';

import api from '../../../services/api';

import { updateSalao, updateUser } from './action';
import { updateAgendamento } from '../salao/action';

export function* getUser(data) {
  try {
    console.log(data);
    const { data: res } = yield call(api.post, `/cliente/login`, data.data);

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateUser({ ...res }));

    yield put(updateAgendamento({ clienteId: res.clienteId }));
  } catch (err) {
    alert(err.message);
  }
}

export default all([takeLatest(types.GET_USER, getUser)]);
