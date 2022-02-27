import types from './types';
import produce from 'immer';
import * as _ from 'underscore';

const INITIAL_STATE = {
  cliente: {
    logado: false,
    email: '',
    nome: '',
    telefone: '',
    dataNascimento: '',
    sexo: 'M',
    endereco: {
      cidade: '',
      uf: '',
      cep: '',
      logradouro: '',
      numero: '',
      pais: 'BR',
    },
    geo: {},
  },
  form: {
    inputFiltro: '',
    inputFiltroFoco: false,
    modalEspecialista: false,
    modalAgendamento: 0,
    agendamentoLoading: false,
  },
};

function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_FORM: {
      return produce(state, draft => {
        draft.form = { ...draft.form, [action.key]: action.value };
      });
    }
    case types.UPDATE_USER: {
      return produce(state, draft => {
        console.log('ddddd', draft.cliente);
        draft.cliente = { ...draft.cliente, ...action.user };
      });
    }
    case types.RESET_USER: {
      return produce(state, draft => {
        draft.cliente = INITIAL_STATE.agenda;
        draft.form = INITIAL_STATE.form;
      });
    }
    default: {
      return state;
    }
  }
}

export default user;
