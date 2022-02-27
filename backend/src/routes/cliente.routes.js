const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const bcrypt = require('bcrypt');

const Cliente = require('../models/Cliente');
const ApiGoogle = require('../models/ApiGoogle');
const SalaoCliente = require('../models/relationship/SalaoCliente');

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // verificar se o cliente existe
    const existeCliente = await Cliente.findOne({
      email,
    });

    if (!existeCliente) {
      return res.json({ error: true, message: 'E-mail ou senha inválido' });
    }

    // check password
    const checkPassword = await bcrypt.compare(senha, existeCliente.senha);

    if (!checkPassword) {
      return res.status(422).json({ error: true, msg: 'E-mail ou senha inválida!' });
    }

    res.json({ clienteId: existeCliente._id, nome: existeCliente.nome, email: existeCliente.email, logado: true });
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();
  let geo;

  try {
    const { cliente, salaoId } = req.body;
    let newCliente = null;
    let apiGoogle = await ApiGoogle.find();

    if (cliente.endereco.logradouro && cliente.endereco.cidade && cliente.endereco.numero) {
      if (apiGoogle.length === 0) {
        apiGoogle = await new ApiGoogle().save();
      }

      if (apiGoogle[0].contador !== 990) {
        apiGoogle[0].contador += 1;

        const apiKey = process.env.API_KEY;
        const endereco = `${cliente.endereco.logradouro
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '+')}+${cliente.endereco.numero.replace(/\s+/g, '+')}+${cliente.endereco.cidade
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '+')}`;

        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${endereco}&key=${apiKey}`,
        );

        geo = {
          type: 'Point',
          coordinates: [response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng],
        };

        await apiGoogle[0].save();
      } else {
        await session.abortTransaction();
        session.endSession();
        res.json({ error: true, message: 'API de geolocalização está quase no limite' });
      }
    } else {
      await session.abortTransaction();
      session.endSession();
      res.json({ error: true, message: 'Existem campos faltando' });
    }

    // verificar se o cliente existe
    const existeCliente = await Cliente.findOne({
      $or: [{ email: cliente.email }, { telefone: cliente.telefone }],
    });

    // Se não existir cliente
    if (!existeCliente) {
      newCliente = await new Cliente({
        ...cliente,
        geo,
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
    if (existentRelationship && existentRelationship.status === 'I') {
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
      status: 'A',
    })
      .populate('clienteId')
      .select('clienteId dataCadastro');

    return res.json({
      error: false,
      clientes: clientes.map((vinculo) => {
        return {
          ...vinculo.clienteId._doc,
          vinculoId: vinculo._id,
          dataCadastro: vinculo.dataCadastro,
        };
      }),
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
