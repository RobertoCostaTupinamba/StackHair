import { useEffect } from 'react';
import Sideheader from '../../components/Sideheader';

import { useDispatch, useSelector } from 'react-redux';
import {
  allServicos,
  updateServico,
  removeServico,
  resetServico,
  removeArquivo,
  addServico,
} from '../../store/modules/servico/actions';
import moment from 'moment';
import Table from '../../components/Table';
import {
  Button,
  Drawer,
  DatePicker,
  // Notification,
  Tag,
  // TagPicker,
  // Checkbox,
  Modal,
  Uploader,
} from 'rsuite';
import RemindFillIcon from '@rsuite/icons/RemindFill';
import ImageIcon from '@rsuite/icons/Image';
import util from '../../utils/utils';
import 'rsuite/dist/rsuite.min.css';
import 'rsuite/dist/rsuite.min.js';
import 'rsuite/Button/styles/index.less';
import { notification } from '../../services/rsuite';

const Servicos = () => {
  const dispatch = useDispatch();
  const { servicos, form, components, behavior, servico } = useSelector((state) => state.servico);

  const setComponents = (component, state) => {
    dispatch(
      updateServico({
        components: { ...components, [component]: state },
      }),
    );
  };

  const setBehavior = (state) => {
    dispatch(
      updateServico({
        behavior: state,
      }),
    );
  };

  const setform = (component, state) => {
    dispatch(
      updateServico({
        form: { ...components, [component]: state },
      }),
    );
  };

  const remove = () => {
    // PERFORM REMOVE
    dispatch(removeServico());
  };

  const setServico = (key, value) => {
    dispatch(
      updateServico({
        servico: { ...servico, [key]: value },
      }),
    );
  };

  const save = () => {
    if (!util.allFields(servico, ['titulo', 'preco', 'comissao', 'duracao', 'descricao', 'status', 'arquivos'])) {
      // DISPARAR O ALERTA
      notification('error', {
        placement: 'topStart',
        title: 'Calma lá!',
        description: 'Antes de prosseguir, preencha todos os campos!',
      });
      return false;
    }

    dispatch(addServico());
  };

  useEffect(() => {
    sessionStorage.setItem('page', 'servicos');
    dispatch(allServicos());
  }, [dispatch]);

  return (
    <Sideheader>
      <div className="col p-5 overflow-auto h-100">
        <Drawer
          open={components.drawer}
          size="sm"
          onClose={() => {
            dispatch(resetServico());
            setBehavior('create');
            setform('disabled', true);
            setComponents('drawer', false);
          }}
        >
          <Drawer.Body>
            <h3>{behavior === 'create' ? 'Criar novo ' : 'Atualizar '} servico</h3>
            <div className="row mt-3">
              <div className="form-group col-6">
                <b>Título</b>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Titulo do serviço"
                  value={servico.titulo}
                  onChange={(e) => {
                    setServico('titulo', e.target.value);
                  }}
                />
              </div>
              <div className="form-group col-3">
                <b>R$ Preço</b>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Preço do serviço"
                  value={servico.preco}
                  onChange={(e) => setServico('preco', e.target.value)}
                />
              </div>
              <div className="form-group col-4">
                <b>% Comissão</b>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Comissão do serviço"
                  value={servico.comissao}
                  onChange={(e) => setServico('comissao', e.target.value)}
                />
              </div>
              <div className="form-group col-4">
                <b className="d-block">Duração</b>
                <DatePicker
                  block
                  format="HH:mm"
                  value={new Date(servico.duracao)}
                  hideMinutes={(min) => ![0, 30].includes(min)}
                  onChange={(e) => {
                    setServico('duracao', e);
                  }}
                />
              </div>
              <div className="form-group col-4">
                <b>Status</b>
                <select
                  className="form-control"
                  value={servico.status}
                  onChange={(e) => setServico('status', e.target.value)}
                >
                  <option value="A">Ativo</option>
                  <option value="I">Inativo</option>
                </select>
              </div>
              <div className="form-group col-12">
                <b className="">Descrição</b>
                <textarea
                  rows="5"
                  className="form-control"
                  placeholder="Descrição do serviço..."
                  value={servico.descricao}
                  onChange={(e) => setServico('descricao', e.target.value)}
                />
              </div>

              <div className="form-group col-12">
                <b className="d-block">Imagens do serviço</b>
                <Uploader
                  multiple
                  autoUpload={false}
                  listType="picture"
                  action="//jsonplaceholder.typicode.com/posts/"
                  defaultFileList={servico.arquivos.map((s, i) => {
                    // const nameFormat = s?.arquivo.split('/');
                    return {
                      name: `${s?.arquivo}`,
                      fileKey: i,
                      url: `${s?.arquivo}`,
                    };
                  })}
                  onChange={(files) => {
                    const arquivos = files.filter((f) => f.blobFile).map((f) => f.blobFile);
                    console.log(arquivos);
                    setServico('arquivos', arquivos);
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
                  <button>
                    <ImageIcon color={'#ffb300'} fontSize={24} />
                  </button>
                </Uploader>
              </div>
            </div>
            <Button
              loading={form.saving}
              color={behavior === 'create' ? 'green' : 'blue'}
              appearance="primary"
              size="lg"
              block
              onClick={() => save()}
              className="mt-3"
            >
              {behavior === 'create' ? 'Salvar' : 'Atualizar'} Serviço
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
                Remover Serviço
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
              <h2 className="mb-4 mt0">Serviços</h2>
              <div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    dispatch(resetServico());
                    dispatch(
                      updateServico({
                        behavior: 'create',
                      }),
                    );
                    setComponents('drawer', true);
                  }}
                >
                  <span className="mdi mdi-plus">Novo Serviço</span>
                </button>
              </div>
            </div>
            <Table
              loading={form.filtering}
              data={servicos}
              config={[
                {
                  label: 'Titulo',
                  key: 'titulo',
                  sortable: true,
                  fixed: true,
                  width: 200,
                },
                {
                  label: 'R$ Preço',
                  key: 'preco',
                  content: (servico) => `R$ ${servico.preco.toFixed(2)}`,
                },
                {
                  label: '% Comissão',
                  key: 'comissao',
                  content: (servico) => `${servico.comissao}%`,
                },
                {
                  label: 'Duração',
                  key: 'duracao',
                  sortable: true,
                  content: (servico) => moment(servico.duracao).format('HH:mm'),
                },
                {
                  label: 'Status',
                  key: 'status',
                  content: (servico) => (
                    <Tag color={servico.status === 'A' ? 'green' : 'red'}>
                      {servico.status === 'A' ? 'Ativo' : 'Inativo'}
                    </Tag>
                  ),
                },
              ]}
              onRowClick={(servico) => {
                dispatch(
                  updateServico({
                    behavior: 'update',
                  }),
                );
                dispatch(updateServico({ servico }));
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

export default Servicos;
