const express = require('express');

const router = express.Router();

const _ = require('lodash');
const Horario = require('../models/Horario');
const ColaboradorServico = require('../models/relationship/ColaboradorServico');

router.post('/', async (req, res) => {
  try {
    const horarios = await new Horario(req.body).save();

    res.json({ horarios });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.get('/salao/:salaoId', async (req, res) => {
  try {
    const { salaoId } = req.params;
    const horarios = await Horario.find({
      salaoId,
    });

    res.json({ horarios });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.put('/:horarioId', async (req, res) => {
  try {
    const { horarioId } = req.params;
    const horario = req.body;

    const updated = await Horario.findByIdAndUpdate(horarioId, horario);

    if (updated) {
      return res.json({ error: false });
    }

    return res.status(404).json({ error: true, message: 'Horário não encontrado' });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete('/:horarioId', async (req, res) => {
  try {
    const { horarioId } = req.params;
    const horario = req.body;

    const deleted = await Horario.findByIdAndDelete(horarioId);

    if (deleted) {
      return res.json({ error: false });
    }

    return res.status(404).json({ error: true, message: 'Horário não encontrado' });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.post('/colaboradores', async (req, res) => {
  try {
    const colaboradorServico = await ColaboradorServico.find({
      servicoId: { $in: req.body.especialidades },
      status: 'A',
    })
      .populate('colaboradorId', 'nome')
      .select('colaboradorId -_id');

    const listaColaboradores = _.uniqBy(colaboradorServico, (vinculo) => vinculo.colaboradorId?._id.toString()).map(
      (vinculo) => ({
        label: vinculo.colaboradorId.nome,
        value: vinculo.colaboradorId._id,
      }),
    );

    return res.json({ error: false, listaColaboradores });
  } catch (err) {
    res.status(422).json({ error: true, message: err.message });
  }
});

module.exports = router;
