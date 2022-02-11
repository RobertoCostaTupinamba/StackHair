import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { updateHorario, resetHorario, allHorarios as allHorariosAction } from './actions';
import types from './types';
import api from '../../../services/api';
import { notification } from '../../../services/rsuite';

export function* addHorario() {
  try {
    const { horario, form, components, behavior } = yield select((state) => state.horario);
    yield put(updateHorario({ form: { ...form, saving: true } }));

    let res = {};
    if (behavior === 'create') {
      const response = yield call(api.post, '/horario', {
        ...horario,
        salaoId: sessionStorage.getItem('salaoId'),
      });
      res = response.data;
    } else {
      const response = yield call(api.post, `/horario/${horario._id}`, horario);
      res = response.data;
    }

    yield put(updateHorario({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(allHorariosAction());
    yield put(updateHorario({ components: { ...components, drawer: false } }));
    yield put(resetHorario());

    notification('success', {
      placement: 'topStart',
      title: 'Feitoooo!!',
      description: 'Horário salvo com sucesso!',
    });
  } catch (err) {
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* allHorarios() {
  const { form } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.get, `/horario/salao/${sessionStorage.getItem('salaoId')}`);
    yield put(updateHorario({ form: { ...form, filtering: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(updateHorario({ horarios: res.horarios }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateHorario({ form: { ...form, filtering: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* saveHorario() {
  const { horario, form, components } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.put, `/horario/${horario._id}`, horario);
    yield put(updateHorario({ form: { ...form, saving: false }, components: { ...components, drawer: false } }));
    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(allHorariosAction());
    yield put(updateHorario({ components: { ...components, drawer: false } }));
    yield put(resetHorario());

    notification('success', {
      placement: 'topStart',
      title: 'Feitoooo!!',
      description: 'Serviço salvo com sucesso!',
    });
  } catch (err) {
    yield put(updateHorario({ form: { ...form, saving: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* removeHorario() {
  const { horario, form, components } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, saving: true } }));

    const { data: res } = yield call(api.delete, `/horario/${horario._id}`);
    yield put(updateHorario({ form: { ...form, saving: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(allHorariosAction());
    yield put(
      updateHorario({
        components: { ...components, drawer: false, confirmDelete: false },
      }),
    );
    yield put(resetHorario());
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateHorario({ form: { ...form, saving: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* allServicos() {
  const { form } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.get, `/salao/servicos/${sessionStorage.getItem('salaoId')}`);
    yield put(updateHorario({ form: { ...form, filtering: false } }));

    if (res.error) {
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(updateHorario({ servicos: res.servicos }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateHorario({ form: { ...form, filtering: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.message,
    });
  }
}

export function* filterColaboradores() {
  const { form, horario } = yield select((state) => state.horario);

  try {
    yield put(updateHorario({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.post, `/horario/colaboradores`, {
      especialidades: horario.especialidades,
    });
    yield put(updateHorario({ form: { ...form, filtering: false } }));

    console.log(res);
    if (res.error) {
      if (res.listaColaboradores.length === 0) {
        notification('error', {
          placement: 'topStart',
          title: 'Ops...',
          description: 'Nenhum colaborador disponivel para exercer essa função',
        });
      }
      // ALERT DO RSUITE
      notification('error', {
        placement: 'topStart',
        title: 'Ops...',
        description: res.message,
      });
      return false;
    }

    yield put(updateHorario({ colaboradores: res.listaColaboradores }));
  } catch (err) {
    // COLOCAR AQUI O ALERT DO RSUITE
    yield put(updateHorario({ form: { ...form, filtering: false } }));
    notification('error', {
      placement: 'topStart',
      title: 'Ops...',
      description: err.response.data.message,
    });
  }
}

export default all([
  takeLatest(types.ADD_HORARIO, addHorario),
  takeLatest(types.ALL_HORARIOS, allHorarios),
  takeLatest(types.REMOVE_HORARIO, removeHorario),
  takeLatest(types.SAVE_HORARIO, saveHorario),
  takeLatest(types.ALL_SERVICOS, allServicos),
  takeLatest(types.FILTER_COLABORADORES, filterColaboradores),
]);
