import { takeLatest, all, call, put } from 'redux-saga/effects';
import { updateAgendamento } from './actions';
import types from './types';
import api from '../../../services/api';

export function* filterAgenramentos({ range }) {
  try {
    const { data: res } = yield call(api.post, '/agendamento/filter', {
      salaoId: sessionStorage.getItem('salaoId'),
      periodo: range,
    });
    console.log(res);
    if (res.error) {
      alert(res.message);
      // ALERT DO RSUITE
      // notification('error', {
      //   placement: 'topStart',
      //   title: 'Ops...',
      //   description: res.message,
      // });
      return false;
    }

    yield put(updateAgendamento({ agendamentos: res.agendamentos }));
    // COLOCAR OS CLIENTES NO REDUCER
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    alert(err.message);
    // notification('error', {
    //   placement: 'topStart',
    //   title: 'Ops...',
    //   description: err.message,
    // });
  }
}

export default all([takeLatest(types.FILTER_AGENDAMENTOS, filterAgenramentos)]);
