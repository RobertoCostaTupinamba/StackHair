import { all, takeLatest, put, call } from "redux-saga/effects"
import api from "../../../services/api";
import { usuarioAutenticado } from "./actions"
import types from "./types"


export function* loginUsuario({ dadosDoUsuario }){

    const { data: res } = yield call(api.post, '/salao', dadosDoUsuario);


    if (res.salaoId) {
        yield put(usuarioAutenticado({
            logado: true,
            salaoId: res.salaoId,
        }))
    }


}

export default all([
    // Escutar a ação @usuario/AUTENTICAR e chamar a função loginUsuario
    takeLatest(types.AUTENTICAR_USUARIO, loginUsuario)
])