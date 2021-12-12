import { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { autenticarUsuario } from '../../store/modules/user/actions';


import Sideheader from '../../components/Sideheader';


moment.locale('pt-br');
moment.updateLocale('pt-br', {
    months: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    monthsShort: [
        "Jan", "Fev", "Mar", "Abr", "Maio", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ],
    weekdays: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    weekdaysMin: ["Do", "Se", "Te", "Qa", "Qi", "Sx", "Sb"],
});


const localizer = momentLocalizer(moment);


const Agendamentos = () => {
    const dispatch = useDispatch();




    useEffect(() => {
        dispatch(autenticarUsuario({
            email: "robertotupinamba@gmail.com",
            senha: "12345678"
        }))
    })

    return (
        <Sideheader>
            <div className="col p-5 pt-2 overflow-auto h-100">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-4 mt0">
                            Agendamentos
                        </h2>
                        <Calendar
                            localizer={localizer}
                            events={[
                                { title: "Evento de Teste", start: moment().toDate(), end: moment().add(30, "minutes").toDate() }
                            ]}
                            defaultView="week"
                            messages={{
                                month: 'Mês',
                                day: 'Dia',
                                today: 'Hoje',
                                week: 'Semana',
                                previous: 'Anterior',
                                next: 'Próximo',
                                date: 'Data',
                                time: "Horário",
                                event: 'Evento'
                            }}
                            selectable
                            popup
                            style={{ height: 600 }}

                        />
                        <div style={{ height: 70 }}></div>
                    </div>
                </div>
            </div>
        </Sideheader>
    );
}

export default Agendamentos;