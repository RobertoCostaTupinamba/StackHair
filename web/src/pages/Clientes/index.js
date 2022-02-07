import { useEffect } from 'react';
import Sideheader from '../../components/Sideheader';

import { useDispatch, useSelector } from 'react-redux';
import {
  allClientes,
  updateCliente,
  filterCliente,
  addCliente,
  resetCliente,
  unlinkCliente,
} from '../../store/modules/cliente/actions';
import moment from 'moment';
import Table from '../../components/Table';
import { Button, Drawer, Modal } from 'rsuite';
import { notification } from '../../services/rsuite';
import RemindFillIcon from '@rsuite/icons/RemindFill';
import util from '../../utils/utils';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/dist/rsuite.min.js';
import 'rsuite/Button/styles/index.less';

const Clientes = () => {
  const dispatch = useDispatch();
  const { clientes, form, components, behavior, cliente } = useSelector((state) => state.cliente);

  const setComponents = (component, state) => {
    dispatch(
      updateCliente({
        components: { ...components, [component]: state },
      }),
    );
  };

  const setBehavior = (state) => {
    dispatch(
      updateCliente({
        behavior: state,
      }),
    );
  };

  const setform = (component, state) => {
    dispatch(
      updateCliente({
        form: { ...components, [component]: state },
      }),
    );
  };

  const save = () => {
    if (!util.allFields(cliente, ['email', 'nome', 'telefone', 'dataNascimento', 'sexo'])) {
      // DISPARAR O ALERTA
      notification('error', {
        placement: 'topStart',
        title: 'Calma lá!',
        description: 'Antes de prosseguir, preencha todos os campos!',
      });
      return false;
    }

    dispatch(addCliente());
  };

  const remove = () => {
    // PERFORM REMOVE
    dispatch(unlinkCliente());
  };

  const setCliente = (key, value) => {
    dispatch(
      updateCliente({
        cliente: { ...cliente, [key]: value },
      }),
    );
  };

  // const save = () => {
  //   if (!util.allFields(cliente, ['email', 'nome', 'telefone', 'dataNascimento', 'sexo'])) {
  //     // DISPARAR O ALERTA
  //     Notification.error({
  //       placement: 'topStart',
  //       title: 'Calma lá!',
  //       description: 'Antes de prosseguir, preencha todos os campos!',
  //     });
  //     return false;
  //   }

  //   dispatch(addCliente());
  // };

  useEffect(() => {
    sessionStorage.setItem('page', 'clientes');
    dispatch(allClientes());
  }, [dispatch]);

  return (
    <Sideheader>
      <div className="col p-5 overflow-auto h-100">
        <Drawer
          open={components.drawer}
          size="sm"
          onClose={() => {
            dispatch(resetCliente());
            setBehavior('create');
            setform('disabled', true);
            setComponents('drawer', false);
          }}
        >
          <Drawer.Body>
            <h3>{behavior === 'create' ? 'Criar novo ' : 'Remover '}cliente</h3>
            <div className="row mt-3">
              <div className="form-group mb-3 col-12">
                <b>E-mail</b>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="E-mail do cliente"
                    disabled={behavior == 'update'}
                    onChange={(e) => {
                      setCliente('email', e.target.value);
                    }}
                    value={cliente.email}
                  />
                  {behavior === 'create' && (
                    <div className="input-group-append">
                      <Button
                        appearance="primary"
                        loading={form.filtering}
                        disabled={form.filtering}
                        onClick={() => {
                          if (cliente.email) {
                            dispatch(filterCliente());
                          }
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
                  placeholder="Nome do Cliente"
                  disabled={form.disabled}
                  value={cliente.nome}
                  onChange={(e) => setCliente('nome', e.target.value)}
                />
              </div>
              <div className="form-group col-6">
                <b className="">Telefone / Whatsapp</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Telefone / Whatsapp do Cliente"
                  disabled={form.disabled}
                  value={cliente.telefone}
                  onChange={(e) => setCliente('telefone', e.target.value)}
                />
              </div>

              <div className="form-group col-6">
                <b className="">Data de Nascimento</b>
                <input
                  type="date"
                  className="form-control"
                  disabled={form.disabled}
                  value={cliente.dataNascimento}
                  onChange={(e) => setCliente('dataNascimento', e.target.value)}
                />
              </div>
              <div className="form-group col-6">
                <b>Sexo</b>
                <select
                  disabled={form.disabled}
                  className="form-control"
                  value={cliente.sexo}
                  onChange={(e) => setCliente('sexo', e.target.value)}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div className="form-group col-3">
                <b className="">CEP</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Digite o CEP"
                  disabled={form.disabled}
                  value={cliente.endereco.cep}
                  onChange={(e) =>
                    setCliente('endereco', {
                      ...cliente.endereco,
                      cep: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-6">
                <b className="">Rua / Logradouro</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rua / Logradouro"
                  disabled={form.disabled}
                  value={cliente.endereco.logradouro}
                  onChange={(e) =>
                    setCliente('endereco', {
                      ...cliente.endereco,
                      logradouro: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-3">
                <b className="">Número</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Número"
                  disabled={form.disabled}
                  value={cliente.endereco.numero}
                  onChange={(e) =>
                    setCliente('endereco', {
                      ...cliente.endereco,
                      numero: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-3">
                <b className="">UF</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="UF"
                  disabled={form.disabled}
                  value={cliente.endereco.uf}
                  onChange={(e) =>
                    setCliente('endereco', {
                      ...cliente.endereco,
                      uf: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group col-9">
                <b className="">Cidade</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cidade"
                  disabled={form.disabled}
                  value={cliente.endereco.cidade}
                  onChange={(e) =>
                    setCliente('endereco', {
                      ...cliente.endereco,
                      cidade: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <Button
              disabled={behavior === 'create' ? form.disabled : false}
              block
              className="btn-lg mt-3"
              color={behavior === 'create' ? 'green' : 'red'}
              size="lg"
              loading={form.saving}
              appearance="primary"
              onClick={() => {
                if (behavior === 'create') {
                  save();
                } else {
                  setComponents('confirmDelete', true);
                }
              }}
            >
              {behavior === 'create' ? 'Salvar' : 'Remover'} cliente
            </Button>
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
              <h2 className="mb-4 mt0">Clientes</h2>
              <div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    dispatch(
                      updateCliente({
                        behavior: 'create',
                      }),
                    );
                    setComponents('drawer', true);
                  }}
                >
                  <span className="mdi mdi-plus">Novo Cliente</span>
                </button>
              </div>
            </div>
            <Table
              loading={form.filtering}
              data={clientes}
              config={[
                { label: 'Nome', key: 'nome', width: 200, fixed: true },
                { label: 'E-mail', key: 'email', width: 200 },
                { label: 'Telefone', key: 'telefone', width: 200 },
                {
                  label: 'Sexo',
                  key: 'sexo',
                  content: (cliente) => (cliente.sexo === 'M' ? 'Masculino' : 'Feminino'),
                  width: 200,
                },
                {
                  label: 'Data Cadastro',
                  key: 'dataCadastro',
                  content: (cliente) => moment(cliente.dataCadastro).format('DD/MM/YYYY'),
                  width: 200,
                },
              ]}
              onRowClick={(cliente) => {
                dispatch(
                  updateCliente({
                    behavior: 'update',
                  }),
                );
                dispatch(updateCliente({ cliente }));
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

export default Clientes;
