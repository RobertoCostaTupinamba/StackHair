/* eslint-disable no-unused-vars */
import { useEffect } from 'react';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import Sideheader from '../../components/Sideheader';
import { useDispatch, useSelector } from 'react-redux';
import {
  addHorario,
  allHorarios,
  allServicos,
  filterColaboradores,
  saveHorario,
  updateHorario,
  resetHorario,
  removeHorario,
} from '../../store/modules/horarios/actions';
import RemindFillIcon from '@rsuite/icons/RemindFill';
import colors from '../../data/colors.json';
import util from '../../utils/utils';
import { Button, Checkbox, DatePicker, Drawer, Modal, TagPicker } from 'rsuite';
import { notification } from '../../services/rsuite';
const localizer = momentLocalizer(moment);
const Horarios = () => {
  const { horarios, horario, servicos, colaboradores, components, form, behavior } = useSelector(
    (state) => state.horario,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    sessionStorage.setItem('page', 'horarios');
    dispatch(allHorarios());
    dispatch(allServicos());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterColaboradores());
  }, [horario.especialidades, dispatch]);

  const diasSemanaData = [
    new Date(2021, 3, 11, 0, 0, 0, 0),
    new Date(2021, 3, 12, 0, 0, 0, 0),
    new Date(2021, 3, 13, 0, 0, 0, 0),
    new Date(2021, 3, 14, 0, 0, 0, 0),
    new Date(2021, 3, 15, 0, 0, 0, 0),
    new Date(2021, 3, 16, 0, 0, 0, 0),
    new Date(2021, 3, 17, 0, 0, 0, 0),
  ];

  const diasDaSemana = [
    'domingo',
    'segunda-feira',
    'terça-feira',
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
  ];

  const formatEventos = horarios
    .map((hor, index) => {
      return hor.dias.map((dia) => ({
        resource: { horario: hor, backgroundColor: colors[index] },
        title: `${hor.especialidades.length} espec. e ${hor.colaboradores.length} colab. disponíveis`,
        start: new Date(
          diasSemanaData[dia].setHours(
            parseInt(moment(hor.inicio).format('HH')),
            parseInt(moment(hor.inicio).format('mm')),
          ),
        ),
        end: new Date(
          diasSemanaData[dia].setHours(parseInt(moment(hor.fim).format('HH')), parseInt(moment(hor.fim).format('mm'))),
        ),
      }));
    })
    .flat();

  const setComponents = (component, state) => {
    dispatch(
      updateHorario({
        components: { ...components, [component]: state },
      }),
    );
  };

  const setHorario = (key, value) => {
    dispatch(
      updateHorario({
        horario: { ...horario, [key]: value },
      }),
    );
  };

  const save = () => {
    if (!util.allFields(horario, ['dias', 'inicio', 'fim', 'especialidades', 'colaboradores'])) {
      // DISPARAR O ALERTA
      notification('error', {
        placement: 'topStart',
        title: 'Calma lá!',
        description: 'Antes de prosseguir, preencha todos os campos!',
      });
      return false;
    }

    if (behavior === 'create') {
      dispatch(addHorario());
    } else {
      dispatch(saveHorario());
    }
  };

  const remove = () => {
    // PERFORM REMOVE
    dispatch(removeHorario());
  };

  const setBehavior = (state) => {
    console.log('aaaa');
    dispatch(
      updateHorario({
        behavior: state,
      }),
    );
  };

  const onHorarioClick = (horario) => {
    dispatch(
      updateHorario({
        horario,
        behavior: 'update',
      }),
    );
    console.log(horario);
    setComponents('drawer', true);
  };

  return (
    <Sideheader>
      <div className="col p-5 overflow-auto h-100">
        <Drawer
          open={components.drawer}
          size="sm"
          onClose={() => {
            setComponents('drawer', false);
          }}
        >
          <Drawer.Body>
            <h3> {behavior === 'create' ? 'Criar novo' : 'Atualizar'} horario de atendimento</h3>
            <div className="row mt-3">
              <div className="col-12">
                <b>Dias da semana</b>
                <TagPicker
                  size="lg"
                  block
                  value={horario.dias}
                  data={diasDaSemana.map((label, value) => ({ label, value }))}
                  onChange={(value) => {
                    setHorario('dias', value);
                  }}
                />
                <Checkbox
                  disabled={horario.dias.length === diasDaSemana.length}
                  checked={horario.dias.length === diasDaSemana.length}
                  onChange={(v, selected) => {
                    if (selected) {
                      setHorario(
                        'dias',
                        diasDaSemana.map((label, value) => value),
                      );
                    } else {
                      setHorario('dias', []);
                    }
                  }}
                >
                  {' '}
                  Selecionar Todos
                </Checkbox>
              </div>
              <div className="col-6 mt-3">
                <b className="d-block">Horário Inicial</b>
                {horario.inicio == '' ? (
                  <DatePicker
                    placeholder="Selecionar as horas"
                    block
                    format="HH:mm"
                    hideMinutes={(min) => ![0, 30].includes(min)}
                    onChange={(e) => {
                      setHorario('inicio', new Date(e).toISOString());
                    }}
                  />
                ) : (
                  <DatePicker
                    placeholder="Selecionar as horas"
                    block
                    format="HH:mm"
                    hideMinutes={(min) => ![0, 30].includes(min)}
                    value={horario.inicio == '' ? new Date() : new Date(horario.inicio)}
                    onChange={(e) => {
                      setHorario('inicio', new Date(e).toISOString());
                    }}
                  />
                )}
              </div>
              <div className="col-6 mt-3">
                <b className="d-block">Horário Final</b>
                {horario.fim == '' ? (
                  <DatePicker
                    placeholder="Selecionar as horas"
                    block
                    format="HH:mm"
                    hideMinutes={(min) => ![0, 30].includes(min)}
                    onChange={(e) => {
                      setHorario('fim', new Date(e));
                    }}
                  />
                ) : (
                  <DatePicker
                    placeholder="Selecionar as horas"
                    block
                    format="HH:mm"
                    hideMinutes={(min) => ![0, 30].includes(min)}
                    value={horario.fim == '' ? new Date() : new Date(horario.fim)}
                    onChange={(e) => {
                      setHorario('fim', new Date(e));
                    }}
                  />
                )}
              </div>
              <div className="col-12 mt-3">
                <b>Especialidades disponíveis</b>
                <TagPicker
                  size="lg"
                  block
                  data={servicos}
                  value={horario.especialidades}
                  onChange={(e) => {
                    setHorario('especialidades', e);
                  }}
                />
                <Checkbox
                  disabled={horario.especialidades.length === servicos.length}
                  checked={horario.especialidades.length === servicos.length}
                  onChange={(v, selected) => {
                    if (selected) {
                      setHorario(
                        'especialidades',
                        servicos.map((s) => s.value),
                      );
                    } else {
                      setHorario('especialidades', []);
                    }
                  }}
                >
                  {' '}
                  Selecionar Todas
                </Checkbox>
              </div>
              <div className="col-12 mt-3">
                <b>Colaboradores disponíveis</b>
                <TagPicker
                  size="lg"
                  block
                  data={colaboradores}
                  disabled={horario.especialidades.length === 0}
                  value={horario.colaboradores}
                  onChange={(e) => {
                    setHorario('colaboradores', e);
                  }}
                />
                <Checkbox
                  disabled={horario.colaboradores.length === colaboradores.length}
                  checked={horario.colaboradores.length === colaboradores.length}
                  onChange={(v, selected) => {
                    if (selected) {
                      setHorario(
                        'colaboradores',
                        colaboradores.map((s) => s.value),
                      );
                    } else {
                      setHorario('colaboradores', []);
                    }
                  }}
                >
                  {' '}
                  Selecionar Todos
                </Checkbox>
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
              Salvar Horário de Atendimento
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
                Remover Horário de Atendimento
              </Button>
            )}
          </Drawer.Body>
        </Drawer>

        <Modal
          open={components.confirmDelete}
          onClose={() => {
            setComponents('confirmDelete', false);
          }}
          size="xs"
        >
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
              <h2 className="mb-4 mt0">Horários de atendimentos</h2>
              <div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    setComponents('drawer', true);
                    dispatch(resetHorario());
                    setBehavior('create');
                  }}
                >
                  <span className="mdi mdi-plus">Novo Horários</span>
                </button>
              </div>
            </div>
            <Calendar
              onSelectEvent={(e) => {
                const { horario } = e.resource;

                onHorarioClick(horario);
              }}
              eventPropGetter={(event) => {
                return {
                  style: {
                    backgroundColor: event.resource.backgroundColor,
                    borderColor: event.resource.backgroundColor,
                  },
                };
              }}
              onSelectSlot={(slotInfo) => {
                const { start, end } = slotInfo;
                dispatch(
                  updateHorario({
                    behavior: 'create',
                    horario: {
                      ...horario,
                      dias: [moment(start).day()],
                      inicio: start,
                      fim: end,
                    },
                  }),
                );
                setComponents('drawer', true);
              }}
              localizer={localizer}
              formats={{
                dateFormat: 'dd',
                dayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture),
              }}
              onView={() => {}}
              events={formatEventos}
              popup
              selectable={true}
              view="week"
              defaultDate={diasSemanaData[moment().day()]}
              style={{ height: 600, marginBottom: 60 }}
            />
          </div>
        </div>
      </div>
    </Sideheader>
  );
};

export default Horarios;
