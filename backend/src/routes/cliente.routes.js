const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Cliente = require('../models/Cliente');
const Salao = require('../models/Salao');
const SalaoCliente = require('../models/relationship/SalaoCliente');

router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { cliente, salaoId } = req.body;
    let newCliente = null;

    // verificar se o cliente existe
    const existeCliente = await Cliente.findOne({
      $or: [{ email: cliente.email }, { telefone: cliente.telefone }],
    });

    // Se não existir cliente
    if (!existeCliente) {
      newCliente = await new Cliente({
        ...cliente,
      }).save({ session });
    }

    // Relacionamento

    const clienteId = existeCliente ? existeCliente._id : newCliente._id;

    // Verifica se existe relacionamento entre salão e Cliente

    const existentRelationship = await SalaoCliente.findOne({
      salaoId,
      clienteId,
      status: { $ne: 'E' },
    });

    // Se não estiver vinculado
    if (!existentRelationship) {
      await new SalaoCliente({
        salaoId,
        clienteId,
      }).save({ session });
    }

    // Se o vinculo entre cliente e salão ja existir
    if (existentRelationship) {
      await SalaoCliente.findOneAndUpdate(
        {
          salaoId,
          clienteId,
        },
        { status: 'A' },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    if (existeCliente && existentRelationship) {
      res.json({ error: true, message: 'Cliente já cadastrado' });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

router.post('/filter', async (req, res) => {
  try {
    const clientes = await Cliente.find(req.body.filters, {
      senha: 0,
      __v: 0,
    });

    return res.json({ error: false, clientes });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.get('/salao/:salaoId', async (req, res) => {
  try {
    const { salaoId } = req.params;

    // Recuperar vinculos
    const clientes = await SalaoCliente.find({
      salaoId,
      status: { $ne: 'E' },
    })
      .populate('clienteId')
      .select('clienteId dataCadastro');

    return res.json({
      error: false,
      clientes: clientes.map((vinculo) => ({
        ...vinculo.clienteId._doc,
        vinculoId: vinculo._id,
        dataCadastro: vinculo.dataCadastro,
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete('/vinculo/:id', async (req, res) => {
  try {
    await SalaoCliente.findByIdAndUpdate(req.params.id, { status: 'I' });
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
