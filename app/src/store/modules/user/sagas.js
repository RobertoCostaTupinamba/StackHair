import types from './types';
import { takeLatest, all, call, put, select } from 'redux-saga/effects';

import api from '../../../services/api';

import { updateSalao, updateUser } from './action';
import { updateAgendamento } from '../salao/action';

export function* create(data) {
  try {
    console.log(data);
    const { data: res } = yield call(api.post, `/cliente`, {
      cliente: { ...data.data },
      salaoId: '61e2eac085ecb6942df4a677',
    });

    console.log('aaaa', {
      cliente: { ...data.data },
      salaoId: '61e2eac085ecb6942df4a677',
    });
    if (res.error) {
      alert(res.message);
      return false;
    }

    alert('Cadastrado com sucesso');
  } catch (err) {
    alert(err.message);
  }
}

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

export default all([
  takeLatest(types.GET_USER, getUser),
  takeLatest(types.CREATE_USER, create),
]);
