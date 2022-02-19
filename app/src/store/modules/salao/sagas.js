import moment from 'moment';
import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import api from '../../../services/api';

import types from './types';

import {
  updateSalao,
  updateServicos,
  updateAgenda,
  updateAgendamento,
  updateColaboradores,
  updateForm,
} from './action';

export function* getSalao() {
  try {
    const { data: res } = yield call(
      api.get,
      `/salao/61e2eac085ecb6942df4a677`,
    );
    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateSalao(res.salao));
  } catch (err) {
    alert(err.message);
  }
}

export function* allServicos() {
  try {
    const { data: res } = yield call(
      api.get,
      `/servico/salao/61e2eac085ecb6942df4a677`,
    );
    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateServicos(res.servicos));
  } catch (err) {
    alert(err.message);
  }
}

export default all([
  takeLatest(types.GET_SALAO, getSalao),
  takeLatest(types.ALL_SERVICOS, allServicos),
]);
