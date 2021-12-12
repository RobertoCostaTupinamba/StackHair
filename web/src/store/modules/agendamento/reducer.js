//Reducer contem estados (state) globais
const INITIAL_STATE = {
    agendamento: {},
    agendamentos: [],
}

function agendamento (state = INITIAL_STATE, action){
    switch (action.type) {
        case '@agendamento/ALL':
            
            break;
    
        default:
            return state;
    }
}

export default agendamento;