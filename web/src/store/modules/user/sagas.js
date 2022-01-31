import { all, takeLatest, put, call } from 'redux-saga/effects';
import api from '../../../services/api';
import { usuarioAutenticado } from './actions';
import types from './types';

export function* loginUsuario({ dadosDoUsuario }) {
  try {
    const { data: res } = yield call(api.post, '/salao', dadosDoUsuario);

    if (res.error) {
      alert(res.message);
      return false;
    }

    sessionStorage.setItem('salaoId', res.salaoId);
    sessionStorage.setItem('nome', res.nome);
    sessionStorage.setItem('email', res.email);
    sessionStorage.setItem('foto', res.foto);
    yield put(
      usuarioAutenticado({
        logado: true,
        salaoId: res.salaoId,
        nome: res.nome,
        email: res.email,
        foto: res.foto,
      }),
    );
  } catch (err) {
    alert(err.message);
  }
}

export default all([
  // Escutar a ação @usuario/AUTENTICAR e chamar a função loginUsuario
  takeLatest(types.AUTENTICAR_USUARIO, loginUsuario),
]);
