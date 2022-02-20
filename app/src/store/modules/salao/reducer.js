import types from './types';
import produce from 'immer';
import * as _ from 'underscore';

const INITIAL_STATE = {
  salao: {
    isOpened: true,
    nome: 'Salão Tupi',
    endereco: {
      cidade: 'Araxá',
    },
    distance: '2',
  },
  servicos: [],
  agenda: [],
  colaboradores: [],
  agendamento: {
    clienteId: null,
    salaoId: null,
    servicoId: null,
    colaboradorId: null,
    data: null,
  },
  form: {
    inputFiltro: '',
    inputFiltroFoco: false,
    modalEspecialista: false,
    modalAgendamento: 0,
    agendamentoLoading: false,
  },
};

function salao(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_FORM: {
      return produce(state, draft => {
        draft.form = { ...draft.form, ...action.payload };
      });
    }
    case types.UPDATE_SALAO: {
      return produce(state, draft => {
        draft.salao = { ...draft.salao, ...action.salao };
      });
    }
    case types.UPDATE_SERVICOS: {
      return produce(state, draft => {
        draft.servicos = action.servicos;
      });
    }
    case types.UPDATE_AGENDA: {
      return produce(state, draft => {
        draft.agenda = [...draft.agenda, ...action.agenda];
      });
    }
    case types.UPDATE_COLABORADORES: {
      return produce(state, draft => {
        draft.colaboradores = _.uniq([
          ...draft.colaboradores,
          ...action.colaboradores,
        ]);
      });
    }
    case types.UPDATE_AGENDAMENTO: {
      return produce(state, draft => {
        if (action.payload.servicoId) {
          draft.form.modalAgendamento = 2;
        }

        draft.agendamento = { ...state.agendamento, ...action.payload };
      });
    }
    case types.RESET_AGENDAMENTO: {
      return produce(state, draft => {
        draft.agenda = INITIAL_STATE.agenda;
        draft.colaboradores = INITIAL_STATE.colaboradores;
        draft.agendamento = INITIAL_STATE.agendamento;
      });
    }
    default: {
      return state;
    }
  }
}

export default salao;
