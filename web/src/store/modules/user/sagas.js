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

export function* cadastrarUsuario({ dadosDoUsuario }) {
  try {
    const { data: res } = yield call(api.post, '/salao/register', dadosDoUsuario);

    if (res.error) {
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }
    notification('success', {
      placement: 'topStart',
      title: 'Tudo certo',
      description: 'O Salão foi criado com sucesso!',
    });

    console.log(res);
    sessionStorage.setItem('salaoId', res.salao._id);
    sessionStorage.setItem('nome', res.salao.nome);
    sessionStorage.setItem('email', res.salao.email);
    sessionStorage.setItem('foto', res.salao.foto);

    yield put(
      usuarioAutenticado({
        logado: true,
        salaoId: res._id,
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
  takeLatest(types.CADASTRAR_USUARIO, cadastrarUsuario),
]);
