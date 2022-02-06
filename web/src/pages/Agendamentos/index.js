import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

import { filterAgendamentos } from '../../store/modules/agendamento/actions';
import Sideheader from '../../components/Sideheader';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import util from '../../utils/utils';

moment.locale('pt-br');
moment.updateLocale('pt-br', {
  months: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Maio', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  weekdays: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
  weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
  weekdaysMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sb'],
});

const localizer = momentLocalizer(moment);

const Agendamentos = () => {
  const { agendamentos } = useSelector((state) => state.agendamento);

  const formatEventos = agendamentos.map((agendamento) => ({
    resource: { agendamento },
    title: `${agendamento.servicoId.titulo} - ${agendamento.clienteId.nome} - ${agendamento.colaboradorId.nome}`,
    start: moment(agendamento.data).toDate(),
    end: moment(agendamento.data)
      .add(util.hourToMinutes(moment(agendamento.servicoId.duracao).format('HH:mm')), 'minutes')
      .toDate(),
  }));

  const formatRange = (periodo) => {
    let finalRange = {};
    if (Array.isArray(periodo)) {
      finalRange = {
        inicio: moment(periodo[0]).format('YYYY-MM-DD'),
        final: moment(periodo[periodo.length - 1]).format('YYYY-MM-DD'),
      };
    } else {
      finalRange = {
        inicio: moment(periodo.start).format('YYYY-MM-DD'),
        final: moment(periodo.end).format('YYYY-MM-DD'),
      };
    }

    return finalRange;
  };

  const dispatch = useDispatch();
  useEffect(() => {
    sessionStorage.setItem('page', 'agendamentos');
    dispatch(
      filterAgendamentos({
        inicio: moment().weekday(0).format('YYYY-MM-DD'),
        final: moment().weekday(6).format('YYYY-MM-DD'),
      }),
    );
  }, [dispatch]);

  return (
    <Sideheader>
      <div className="col p-5 pt-2 overflow-auto h-100">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4 mt0">Agendamentos</h2>
            <Calendar
              localizer={localizer}
              events={formatEventos}
              onRangeChange={(periodo) => {
                const { inicio, final } = formatRange(periodo);
                dispatch(
                  filterAgendamentos({
                    inicio,
                    final,
                  }),
                );
              }}
              defaultView="week"
              messages={{
                month: 'Mês',
                day: 'Dia',
                today: 'Hoje',
                week: 'Semana',
                previous: 'Anterior',
                next: 'Próximo',
                date: 'Data',
                time: 'Horário',
                event: 'Evento',
              }}
              selectable
              popup
              style={{ height: 600 }}
            />
            <div style={{ height: 70 }} />
          </div>
        </div>
      </div>
    </Sideheader>
  );
};

export default Agendamentos;
