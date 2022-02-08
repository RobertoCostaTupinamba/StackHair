import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateServico, resetServico, allServicos as allServicosAction } from './actions';
import types from './types';
import api from '../../../services/api';
import { notification } from '../../../services/rsuite';

export function* addServico() {
  try {
    const { servico, form, components, behavior } = yield select((state) => state.servico);
    yield put(updateServico({ form: { ...form, saving: true } }));

    const formData = new FormData();
    formData.append('servico', JSON.stringify({ ...servico, salaoId: sessionStorage.getItem('salaoId') }));
    formData.append('salaoId', sessionStorage.getItem('salaoId'));
    servico.arquivos.map((a, i) => {
      formData.append(`arquivo_${i}`, a);
    });

    const { data: res } = yield call(
      api[behavior === 'create' ? 'post' : 'put'],
      behavior === 'create' ? '/servico' : `/servico/${servico._id}`,
      formData,
    );

    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(allServicosAction());
    yield put(updateServico({ components: { ...components, drawer: false } }));
    yield put(resetServico());
    notification('success', {
      placement: 'topStart',
      title: 'Feitoooo!!',
      description: 'Serviço salvo com sucesso!',
    });
  } catch (err) {
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* removeArquivo({ arquivo }) {
  const { form } = yield select((state) => state.servico);
  console.log('key', arquivo);
  try {
    yield put(updateServico({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.post, `/servico/delete-arquivo`, {
      id: arquivo,
    });
    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    notification('success', {
      placement: 'topStart',
      title: 'Feitoooo!!',
      description: 'Arquivo deletado com sucesso',
    });
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateServico({ form: { ...form, saving: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* removeServico() {
  const { form, components, servico } = yield select((state) => state.servico);

  try {
    yield put(updateServico({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.delete, `/servico/${servico._id}`);
    yield put(updateServico({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
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
      description: 'O Serviço foi deletado com sucesso!',
    });

    yield put(allServicosAction());
    yield put(
      updateServico({
        components: { ...components, drawer: false, confirmDelete: false },
      }),
    );
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateServico({ form: { ...form, saving: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* allServicos() {
  const { form } = yield select((state) => state.colaborador);

  try {
    yield put(updateServico({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.get, `/servico/salao/${sessionStorage.getItem('salaoId')}`);
    yield put(updateServico({ form: { ...form, filtering: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(updateServico({ servicos: res.servicos }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateServico({ form: { ...form, filtering: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export default all([
  takeLatest(types.ADD_SERVICO, addServico),
  takeLatest(types.REMOVE_ARQUIVO, removeArquivo),
  takeLatest(types.REMOVE_SERVICO, removeServico),
  takeLatest(types.ALL_SERVICOS, allServicos),
]);
