// Arquivo responsavel por juntar todos os Reduxer em 1 só
import { combineReducers } from 'redux';

import user from './modules/user/reducer';
import agendamento from './modules/agendamento/reducer';
import cliente from './modules/cliente/reducer';

export default combineReducers({
  user,
  agendamento,
  cliente,
});
