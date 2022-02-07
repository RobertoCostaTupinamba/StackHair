import { all } from 'redux-saga/effects';

import user from './modules/user/sagas';
import agendamento from './modules/agendamento/sagas';
import clientes from './modules/cliente/sagas';
import colaborador from './modules/colaborador/sagas';

export default function* rootSaga() {
  return yield all([user, agendamento, clientes, colaborador]);
}
