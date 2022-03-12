import { useEffect } from 'react';
import Sideheader from '../../components/Sideheader';

import { useDispatch, useSelector } from 'react-redux';
import {
  allColaboradores,
  updateColaborador,
  filterColaborador,
  addColaborador,
  resetColaborador,
  unlinkColaborador,
  allServicos,
  removeArquivo,
} from '../../store/modules/colaborador/actions';
import moment from 'moment';
import Table from '../../components/Table';
import {
  Button,
  Drawer,
  // Notification,
  TagPicker,
  Checkbox,
  Modal,
  Uploader,
} from 'rsuite';
import ImageIcon from '@rsuite/icons/Image';
import RemindFillIcon from '@rsuite/icons/RemindFill';
import util from '../../utils/utils';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/dist/rsuite.min.js';
import 'rsuite/Button/styles/index.less';
import { notification } from '../../services/rsuite';

const Colaboradores = () => {
  const dispatch = useDispatch();
  const { colaboradores, form, components, behavior, colaborador, servicos } = useSelector(
    (state) => state.colaborador,
  );

  const setComponents = (component, state) => {
    dispatch(
      updateColaborador({
        components: { ...components, [component]: state },
      }),
    );
  };

  const setBehavior = (state) => {
    dispatch(
      updateColaborador({
        behavior: state,
      }),
    );
  };

  const setform = (component, state) => {
    dispatch(
      updateColaborador({
        form: { ...components, [component]: state },
      }),
    );
  };

  const remove = () => {
    // PERFORM REMOVE
    dispatch(unlinkColaborador());
  };

  const setColaborador = (key, value) => {
    dispatch(
      updateColaborador({
        colaborador: { ...colaborador, [key]: value },
      }),
    );
  };

  const save = () => {
    if (!util.allFields(colaborador, ['email', 'nome', 'telefone', 'dataNascimento', 'sexo'])) {
      // DISPARAR O ALERTA
      notification('error', {
        placement: 'topStart',
        title: 'Calma lá!',
        description: 'Antes de prosseguir, preencha todos os campos!',
      });
      return false;
    }

    dispatch(addColaborador());
  };

  useEffect(() => {
    sessionStorage.setItem('page', 'colaboradores');
    dispatch(allColaboradores());
    dispatch(allServicos());
  }, [dispatch]);

  return (
    <Sideheader>
      <div className="col p-5 overflow-auto h-100">
        <Drawer
          open={components.drawer}
          size="sm"
          onClose={() => {
            dispatch(resetColaborador());
            setBehavior('create');
            setform('disabled', true);
            setComponents('drawer', false);
          }}
        >
          <Drawer.Body>
            <h3>{behavior === 'create' ? 'Criar novo ' : 'Atualizar '} colaborador</h3>
            <div className="row mt-3">
              <div className="form-group col-12">
                <b className="">E-mail</b>
                <div className="input-group mb-3">
                  <input
                    disabled={behavior == 'update'}
                    type="email"
                    className="form-control"
                    placeholder="E-mail do Colaborador"
                    value={colaborador.email}
                    onChange={(e) => setColaborador('email', e.target.value)}
                  />
                  {behavior === 'create' && (
                    <div className="input-group-append">
                      <Button
                        appearance="primary"
                        loading={form.filtering}
                        disabled={form.filtering}
                        onClick={() => {
                          dispatch(filterColaborador());
                        }}
                      >
                        Pesquisar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group col-6">
                <b className="">Nome</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome do Colaborador"
                  disabled={form.disabled}
                  value={colaborador.nome}
                  onChange={(e) => setColaborador('nome', e.target.value)}
                />
              </div>
              <div className="form-group col-6">
                <b className="">Status</b>
                <select
                  className="form-control"
                  disabled={form.disabled && behavior === 'create'}
                  value={colaborador.vinculo}
                  onChange={(e) => setColaborador('vinculo', e.target.value)}
                >
                  <option value="A">Ativo</option>
                  <option value="I">Inativo</option>
                </select>
              </div>
              <div className="form-group col-4">
                <b className="">Telefone / Whatsapp</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Telefone / Whatsapp do Cliente"
                  disabled={form.disabled}
                  value={colaborador.telefone}
                  onChange={(e) => setColaborador('telefone', e.target.value)}
                />
              </div>
              <div className="form-group col-4">
                <b className="">Data de Nascimento</b>
                <input
                  type="date"
                  style={{ width: '100%', paddingRight: 0 }}
                  className="form-control"
                  placeholder="Data de Nascimento do cliente"
                  disabled={form.disabled}
                  value={colaborador.dataNascimento}
                  onChange={(e) => setColaborador('dataNascimento', e.target.value)}
                />
              </div>
              <div className="form-group col-4">
                <b className="">Sexo</b>
                <select
                  className="form-control"
                  disabled={form.disabled}
                  value={colaborador.sexo}
                  onChange={(e) => setColaborador('sexo', e.target.value)}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div className="col-12">
                <b>Especialidades</b>
                <TagPicker
                  size="lg"
                  block
                  data={servicos}
                  disabled={form.disabled && behavior === 'create'}
                  value={colaborador.especialidades}
                  onChange={(value) => setColaborador('especialidades', value)}
                />
                <Checkbox
                  checked={colaborador.especialidades?.length === servicos.length}
                  disabled={
                    (form.disabled && behavior === 'create') || colaborador.especialidades?.length === servicos.length
                  }
                  onChange={(v, checked) => {
                    if (checked) {
                      setColaborador(
                        'especialidades',
                        servicos.map((s) => s.value),
                      );
                    } else {
                      setColaborador('especialidades', []);
                    }
                  }}
                >
                  {' '}
                  Selecionar Todas
                </Checkbox>
              </div>

              <div className="form-group col-12">
                <b className="d-block">Foto do colaborador</b>
                <Uploader
                  multiple={false}
                  autoUpload={false}
                  listType="picture"
                  action="//jsonplaceholder.typicode.com/posts/"
                  defaultFileList={
                    colaborador.foto
                      ? [
                          {
                            name: `${colaborador?.foto}`,
                            fileKey: 0,
                            url: `${colaborador?.foto}`,
                          },
                        ]
                      : []
                  }
                  onChange={(files) => {
                    const arquivo = files.filter((f) => f.blobFile).map((f) => f.blobFile);
                    console.log(arquivo);
                    setColaborador('foto', arquivo);
                  }}
                  onRemove={(file) => {
                    console.log(file);
                    if (behavior === 'update' && file.url) {
                      const nameFormat = file.name?.split('/');
                      dispatch(
                        removeArquivo(
                          `${nameFormat[nameFormat.length - 3]}/${nameFormat[nameFormat.length - 2]}/${
                            nameFormat[nameFormat.length - 1]
                          }`,
                        ),
                      );
                    }
                  }}
                >
                  {colaborador.foto ? (
                    <></>
                  ) : (
                    <button>
                      <ImageIcon color={'#ffb300'} fontSize={24} />
                    </button>
                  )}
                </Uploader>
              </div>
            </div>
            <Button
              loading={form.saving}
              color={behavior === 'create' ? 'green' : 'primary'}
              appearance="primary"
              size="lg"
              block
              onClick={() => save()}
              className="mt-3"
            >
              {behavior === 'create' ? 'Salvar' : 'Atualizar'} Colaborador
            </Button>
            {behavior === 'update' && (
              <Button
                loading={form.saving}
                color="red"
                appearance="primary"
                size="lg"
                block
                onClick={() => setComponents('confirmDelete', true)}
                className="mt-1"
              >
                Remover Colaborador
              </Button>
            )}
          </Drawer.Body>
        </Drawer>

        <Modal open={components.confirmDelete} onClose={() => setComponents('confirmDelete', false)} size="xs">
          <Modal.Body>
            <RemindFillIcon color={'#ffb300'} fontSize={24} />
            {'  '} Tem certeza que deseja excluir? Essa ação será irreversível!
          </Modal.Body>
          <Modal.Footer>
            <Button loading={form.saving} onClick={() => remove()} color="red" appearance="primary">
              Sim, tenho certeza!
            </Button>
            <Button onClick={() => setComponents('confirmDelete', false)} appearance="subtle">
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="row">
          <div className="col-12">
            <div className="w-100 d-flex justify-content-between">
              <h2 className="mb-4 mt0">Colaboradores</h2>
              <div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    dispatch(
                      updateColaborador({
                        behavior: 'create',
                      }),
                    );
                    setComponents('drawer', true);
                  }}
                >
                  <span className="mdi mdi-plus">Novo Colaborador</span>
                </button>
              </div>
            </div>
            <Table
              loading={form.filtering}
              data={colaboradores}
              config={[
                { label: 'Nome', key: 'nome', width: 200, fixed: true },
                { label: 'E-mail', key: 'email', width: 200 },
                { label: 'Telefone', key: 'telefone', width: 200 },
                {
                  label: 'Sexo',
                  key: 'sexo',
                  content: (colaborador) => (colaborador.sexo === 'M' ? 'Masculino' : 'Feminino'),
                  width: 200,
                },
                {
                  label: 'Data Cadastro',
                  key: 'dataCadastro',
                  content: (colaborador) => moment(colaborador.dataCadastro).format('DD/MM/YYYY'),
                  width: 200,
                },
              ]}
              onRowClick={(colaborador) => {
                dispatch(
                  updateColaborador({
                    behavior: 'update',
                  }),
                );
                dispatch(updateColaborador({ colaborador }));
                setComponents('drawer', true);
              }}
              actions={() => (
                <Button color="blue" appearance="primary" size="xs">
                  Ver informações
                </Button>
              )}
            />
          </div>
        </div>
      </div>
    </Sideheader>
  );
};

export default Colaboradores;
