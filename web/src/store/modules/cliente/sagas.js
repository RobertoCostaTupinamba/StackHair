import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateCliente, resetCliente, allClientes as allClientesAction } from './actions';
import types from './types';
import api from '../../../services/api';
import { notification } from '../../../services/rsuite';
// import consts from '../../../consts';

// FILTER CLIENTE
export function* filterCliente() {
  const { form, cliente } = yield select((state) => state.cliente);

  try {
    yield put(updateCliente({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.post, '/cliente/filter', {
      filters: {
        email: cliente.email,
        status: 'A',
      },
    });
    yield put(updateCliente({ form: { ...form, filtering: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    if (res.clientes.length > 0) {
      yield put(
        updateCliente({
          cliente: res.clientes[0],
          form: { ...form, filtering: false, disabled: true },
        }),
      );
    } else {
      yield put(
        updateCliente({
          form: { ...form, filtering: false, disabled: false },
        }),
      );
    }

    console.log(res.clientes);
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateCliente({ form: { ...form, filtering: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

//ADICIONAR CLIENTE
export function* addCliente() {
  const { cliente, form, components } = yield select((state) => state.cliente);
  try {
    yield put(updateCliente({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.post, '/cliente', {
      cliente,
      salaoId: sessionStorage.getItem('salaoId'),
    });

    yield put(updateCliente({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(allClientesAction());
    yield put(updateCliente({ components: { ...components, drawer: false } }));
    yield put(resetCliente());

    notification('success', {
      placement: 'topStart',
      title: 'Feitoooo!!',
      description: 'Cliente salvo com sucesso!',
    });
  } catch (err) {
    yield put(updateCliente({ form: { ...form, saving: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

// PEGAR TODOS OS CLIENTES DE UM SALÃO
export function* allClientes() {
  const { form } = yield select((state) => state.cliente);

  try {
    yield put(updateCliente({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.get, `/cliente/salao/${sessionStorage.getItem('salaoId')}`);
    yield put(updateCliente({ form: { ...form, filtering: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(updateCliente({ clientes: res.clientes }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateCliente({ form: { ...form, filtering: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

// REMOVER CLIENTE DE UM SALÃO
export function* unlinkCliente() {
  const { form, components, cliente } = yield select((state) => state.cliente);

  try {
    yield put(updateCliente({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.delete, `/cliente/vinculo/${cliente.vinculoId}`);
    yield put(updateCliente({ form: { ...form, saving: false } }));

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
      description: 'O cliente foi desvinculado com sucesso!',
    });

    yield put(allClientesAction());
    yield put(
      updateCliente({
        components: { ...components, drawer: false, confirmDelete: false },
      }),
    );
    yield put(resetCliente());
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateCliente({ form: { ...form, saving: false, confirmDelete: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export default all([
  takeLatest(types.ADD_CLIENTE, addCliente),
  takeLatest(types.FILTER_CLIENTE, filterCliente),
  takeLatest(types.ALL_CLIENTES, allClientes),
  takeLatest(types.UNLINK_CLIENTE, unlinkCliente),
]);
