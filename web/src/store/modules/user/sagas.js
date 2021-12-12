import { all, takeLatest, put } from "redux-saga/effects"
import { usuarioAutenticado } from "./actions"
import types from "./types"


export function* loginUsuario({ dadosDoUsuario }){
    yield put(usuarioAutenticado({
        logado: true,
        token: 'teste',
    }))
}

export default all([
    // Escutar a ação @usuario/AUTENTICAR e chamar a função loginUsuario
    takeLatest(types.AUTENTICAR_USUARIO, loginUsuario)
])