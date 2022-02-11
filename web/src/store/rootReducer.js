// Arquivo responsavel por juntar todos os Reduxer em 1 só
import { combineReducers } from 'redux';

import user from './modules/user/reducer';
import agendamento from './modules/agendamento/reducer';
import cliente from './modules/cliente/reducer';
import colaborador from './modules/colaborador/reducer';
import servico from './modules/servico/reducer';
import horario from './modules/horarios/reducer';

export default combineReducers({
  user,
  agendamento,
  cliente,
  colaborador,
  servico,
  horario,
});
