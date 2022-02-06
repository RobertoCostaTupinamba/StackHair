import { all, takeLatest, put, call } from 'redux-saga/effects';
import api from '../../../services/api';
import { usuarioAutenticado } from './actions';
import types from './types';
import { notification } from '../../../services/rsuite';

export function* loginUsuario({ dadosDoUsuario }) {
  try {
    const { data: res } = yield call(api.post, '/salao', dadosDoUsuario);

    if (res.error) {
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
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
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export default all([
  // Escutar a ação @usuario/AUTENTICAR e chamar a função loginUsuario
  takeLatest(types.AUTENTICAR_USUARIO, loginUsuario),
]);
