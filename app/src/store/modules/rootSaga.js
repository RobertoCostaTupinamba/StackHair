import {all} from 'redux-saga/effects';

import salao from './salao/sagas';
import user from './user/sagas';

export default function* rootSaga() {
  return yield all([salao, user]);
}
