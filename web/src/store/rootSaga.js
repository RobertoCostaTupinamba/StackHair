import { all } from 'redux-saga/effects';

import user from './modules/user/sagas';
import agendamento from './modules/agendamento/sagas';

export default function* rootSaga() {
  return yield all([user, agendamento])
}