import produce from 'immer';
import types from "./types";
//Reducer contem estados (state) globais
const INITIAL_STATE = {
    logado: true,
    token: null,
}


function user (state = INITIAL_STATE, action){
    switch (action.type) {
        case types.AUTENTICADO_USUARIO: {
            return produce(state, (draft) => {
              draft = { ...draft, ...action.dadosDoUsuarioAutenticado };
              return draft;
            });
        }
        default:
            return state;
    }
}

export default user;