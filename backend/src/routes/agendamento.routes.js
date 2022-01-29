const express = require('express');
const mongoose = require('mongoose');

const moment = require('moment');
const _ = require('lodash');
const Cliente = require('../models/Cliente');
const Salao = require('../models/Salao');
const Horario = require('../models/Horario');
const Servico = require('../models/Servico');
const Colaborador = require('../models/Colaborador');
const Agendamento = require('../models/Agendamento');

const util = require('../utils/utils');

const router = express.Router();

router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { clienteId, salaoId, servicoId, colaboradorId, data } = req.body;

    // Verificar se o horario ainda está disponivel
    const existAgendamento = await Agendamento.find({ salaoId, servicoId, colaboradorId, data });

    if (existAgendamento.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ error: true, message: 'Este horário já não está mais diponivel, tente recarregar a página' });
    }

    const cliente = await Cliente.findById(clienteId).select('nome endereco');

    if (!cliente) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: true, message: 'ClienteId não encontrado' });
    }

    const salao = await Salao.findById(salaoId);
    if (!salao) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: true, message: 'SalaoId não encontrado' });
    }

    const servico = await Servico.findById(servicoId).select('preco titulo comissao');

    if (!servico) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: true, message: 'ServicoId não encontrado' });
    }

    const colaborador = await Colaborador.findById(colaboradorId);

    if (!colaborador) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: true, message: 'ColaboradorId não encontrado' });
    }

    // CRIAR O AGENDAMENTOS E AS TRANSAÇÕES
    // TRANSFORMAR EM INSERT MANY
    let agendamento = req.body;
    agendamento = {
      ...agendamento,
      comissao: servico.comissao,
      valor: servico.preco,
    };
    await new Agendamento(agendamento).save({ session });

    await session.commitTransaction();
    session.endSession();
    return res.json({ error: false, agendamento });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.json({ error: true, message: err.message });
  }
});

router.post('/filter', async (req, res) => {
  try {
    const { periodo, salaoId } = req.body;

    const agendamentos = await Agendamento.find({
      status: 'A',
      salaoId,
      data: {
        $gte: moment(periodo.inicio).startOf('day'),
        $lte: moment(periodo.final).endOf('day'),
      },
    }).populate([
      { path: 'servicoId', select: 'titulo duracao' },
      { path: 'colaboradorId', select: 'nome' },
      { path: 'clienteId', select: 'nome' },
    ]);

    res.json({ error: false, agendamentos });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.post('/dias-disponiveis', async (req, res) => {
  try {
    const { data, salaoId, servicoId } = req.body;
    const horarios = await Horario.find({ salaoId });
    const servico = await Servico.findById(servicoId).select('duracao');

    const agenda = [];
    let colaboradores = [];
    let lastDay = moment(data);

    // DURAÇÃO DO SERVIÇO
    const servicoDuracao = util.hourToMinutes(moment(servico.duracao).format('HH:mm'));

    const servicoDuracaoSlots = util.sliceMinutes(
      moment(servico.duracao),
      moment(servico.duracao).add(servicoDuracao, 'minutes'),
      util.SLOT_DURATION,
      false,
    ).length;

    //  Procurar nos proximos 365 dias
    // ate a agenda ter 7 dias disponveis
    for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
      const espacosValidos = horarios.filter((h) => {
        // VERIFICAR DIA DA SEMANA
        const diaSemanaDisponivel = h.dias.includes(moment(lastDay).day());

        // VERIFICAR ESPECIALIDADE DISPONÍVEL
        const servicosDisponiveis = h.especialidades.includes(servicoId); // 0 - 6

        return diaSemanaDisponivel && servicosDisponiveis;
      });

      /*
        TODOS OS COLABORADORES DISPONIVEIS
        E SEUS HORARIOS

      */

      if (espacosValidos.length > 0) {
        // TODOS OS HORÁRIOS DISPONÍVEIS DAQUELE DIA
        let todosHorariosDia = {};
        for (const espaco of espacosValidos) {
          for (const colaborador of espaco.colaboradores) {
            if (!todosHorariosDia[colaborador._id]) {
              todosHorariosDia[colaborador._id] = [];
            }

            // PEGAR TODOS OS HORÁRIO E JOGAR PRO COLABORADOR

            todosHorariosDia[colaborador._id] = [
              ...todosHorariosDia[colaborador._id],
              ...util.sliceMinutes(
                util.mergeDateTime(lastDay, espaco.inicio),
                util.mergeDateTime(lastDay, espaco.fim),
                util.SLOT_DURATION,
              ),
            ];
          }
        }

        // SE TODOS OS ESPECIALISTAS DISPONÍVEIS ESTIVEREM OCUPADOS NO HORÁRIO, REMOVER

        for (const colaboradorKey of Object.keys(todosHorariosDia)) {
          // LER AGENDAMENTOS DAQUELE ESPECIALISTA NAQUELE DIA
          const agendamentos = await Agendamento.find({
            colaboradorId: colaboradorKey,
            data: {
              $gte: moment(lastDay).startOf('day'),
              $lte: moment(lastDay).endOf('day'),
            },
          })
            .select('data servicoId -_id')
            .populate('servicoId', 'duracao');

          // RECUPERANDO HORÁRIOS OCUPADOS
          let horariosOcupado = agendamentos.map((a) => ({
            inicio: moment(a.data),
            fim: moment(a.data).add(util.hourToMinutes(moment(a.servicoId.duracao).format('HH:mm')), 'minutes'),
          }));

          horariosOcupado = horariosOcupado
            .map((h) => util.sliceMinutes(h.inicio, h.fim, util.SLOT_DURATION, false))
            .flat();

          // REMOVENDO TODOS OS HORÁRIOS QUE ESTÃO OCUPADOS
          let horariosLivres = util
            .splitByValue(
              _.uniq(
                todosHorariosDia[colaboradorKey].map((h) => {
                  return horariosOcupado.includes(h) ? '-' : h;
                }),
              ),
              '-',
            )
            .filter((space) => space.length > 0);

          // VERIFICANDO SE NOS HORÁRIOS CONTINUOS EXISTE SPAÇO SUFICIENTE NO SLOT
          horariosLivres = horariosLivres.filter((h) => h.length >= servicoDuracaoSlots);

          /* VERIFICANDO OS HORÁRIOS DENTRO DO SLOT 
            QUE TENHAM A CONTINUIDADE NECESSÁRIA DO SERVIÇO
          */
          horariosLivres = horariosLivres
            .map((slot) => slot.filter((horario, index) => slot.length - index >= servicoDuracaoSlots))
            .flat();

          // SEPARANDO 2 EM 2
          horariosLivres = _.chunk(horariosLivres, 2);

          // REMOVENDO O COLABORADOR DO DIA, CASO NÃO TENHA ESPAÇOS NA AGENDA
          if (horariosLivres.length === 0) {
            todosHorariosDia = _.omit(todosHorariosDia, colaboradorKey);
          } else {
            todosHorariosDia[colaboradorKey] = horariosLivres;
          }
        }

        // VERIFICANDO SE TEM ESPECIALISTA DISPONIVEL NAQUELE DIA
        const totalColaboradores = Object.keys(todosHorariosDia).length;

        if (totalColaboradores > 0) {
          colaboradores.push(Object.keys(todosHorariosDia));
          agenda.push({
            [moment(lastDay).format('YYYY-MM-DD')]: todosHorariosDia,
          });
        }
      }

      lastDay = lastDay.add(1, 'day');
    }

    colaboradores = await Colaborador.find({
      _id: { $in: _.uniq(colaboradores.flat()) },
    }).select('nome foto');

    colaboradores = colaboradores.map((c) => ({
      ...c._doc,
      nome: c.nome.split(' ')[0],
    }));

    res.json({ error: false, colaboradores, agenda });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
