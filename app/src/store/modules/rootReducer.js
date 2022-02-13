import {combineReducers} from 'redux';

import salao from '../modules/salao/reducer';
import user from '../modules/user/reducer';

export default combineReducers({
  salao,
  user
});
