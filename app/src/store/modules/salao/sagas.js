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
import util from '../../../util';
import { Alert } from 'react-native';

export function* getAllSalao() {
  try {
    const { data: res } = yield call(api.get, `/salao`);
    console.log(res);
    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateListaSalao(res.salao));
  } catch (err) {
    alert(err.message);
  }
}

export function* getSalao() {
  const { agendamento } = yield select(state => state.salao);
  try {
    const { data: res } = yield call(api.get, `/salao/${agendamento.salaoId}`);
    console.log(res);
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
  const { agendamento } = yield select(state => state.salao);
  try {
    const { data: res } = yield call(
      api.get,
      `/servico/salao/${agendamento.salaoId}`,
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

export function* filterAgenda() {
  try {
    const { agendamento, agenda } = yield select(state => state.salao);
    const finalStartDate =
      agenda.length === 0
        ? moment().format('YYYY-MM-DD')
        : Object.keys(agenda[0])[0];

    const { data: res } = yield call(
      api.post,
      `/agendamento/dias-disponiveis`,
      {
        ...agendamento,
        data: finalStartDate,
      },
    );

    if (res.error) {
      alert(res.message);
      return false;
    }

    const { horariosDisponiveis, data, colaboradorId } = yield call(
      util.selectAgendamento,
      res.agenda,
    );
    const finalDate = moment(`${data}T${horariosDisponiveis[0][0]}`).format();

    yield put(updateAgenda(res.agenda));
    yield put(updateColaboradores(res.colaboradores));
    yield put(updateAgendamento({ data: finalDate }));
    yield put(updateAgendamento({ colaboradorId: colaboradorId }));
  } catch (err) {
    alert(err.message);
  }
}

export function* saveAgendamento() {
  try {
    yield put(updateForm('agendamentoLoading', true));

    const { agendamento } = yield select(state => state.salao);

    let formatAgendamento = moment(agendamento.data);

    formatAgendamento.add(3, 'hours');

    const { data: res } = yield call(api.post, `/agendamento`, {
      ...agendamento,
      data: formatAgendamento,
    });
    if (res.error) {
      alert(res.message);
      return false;
    }

    Alert.alert('Ebaaaaa!!', 'Horário agendado com sucesso', [
      { text: 'Voltar', onPress: () => {} },
    ]);

    yield put(updateForm({ agendamentoLoading: false }));
  } catch (err) {
    alert(err.message);
  }
}

export default all([
  takeLatest(types.ALL_SALAO, getAllSalao),
  takeLatest(types.GET_SALAO, getSalao),
  takeLatest(types.ALL_SERVICOS, allServicos),
  takeLatest(types.FILTER_AGENDA, filterAgenda),
  takeLatest(types.SAVE_AGENDAMENTO, saveAgendamento),
]);
