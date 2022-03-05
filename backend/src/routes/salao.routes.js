const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const turf = require('turf');
const { toObject } = require('mongoose/lib/utils');
const Salao = require('../models/Salao');
const Servico = require('../models/Servico');
const Horario = require('../models/Horario');
const utils = require('../utils/utils');

// Cadastrar o salão
// Dados esperados:
// - Nome
// - E-mail
// - Senha
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, geo, telefone, capa, endereco } = req.body;

    console.log(nome);

    const errosCamposFaltando = [];

    // Validação
    if (!nome) {
      errosCamposFaltando.push('O nome é obrigatório');
    }

    if (!email) {
      errosCamposFaltando.push('O email é obrigatório');
    }

    if (!senha) {
      errosCamposFaltando.push('A senha é obrigatório');
    } else if (senha.length < 6) {
      errosCamposFaltando.push('A senha deve ter mais que 5 digitos');
    }

    if (errosCamposFaltando.length !== 0) {
      return res.status(422).json({ message: errosCamposFaltando });
    }

    // Validando se o usuário já existe
    const userExists = await Salao.findOne({ email });

    if (userExists) {
      return res.status(422).json({ message: 'Por favor, utilize outro e-mail' });
    }

    // gerando a senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);

    console.log(geo);
    // criando o salão
    const salao = await new Salao({
      nome,
      email,
      capa,
      telefone,
      endereco,
      senha: passwordHash,
      geo,
    }).save();

    res.status(201).json({
      salao: { nome: salao.nome, email: salao.email, _id: salao._id },
    });
  } catch (err) {
    res.status(422).json({ error: true, message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { email, senha } = req.body;

  const errosCamposFaltando = [];

  // Validação
  if (!email) {
    errosCamposFaltando.push('O nome é obrigatório');
  }

  if (!senha) {
    errosCamposFaltando.push('A senha é obrigatório');
  }

  if (errosCamposFaltando.length !== 0) {
    return res.status(400).json({ error: true, message: errosCamposFaltando });
  }

  // check if user exists
  const salao = await Salao.findOne({ email });

  if (!salao) {
    return res.json({ error: true, message: 'E-mail ou senha inválida!' });
  }

  // check password
  const checkPassword = await bcrypt.compare(senha, salao.senha);

  if (!checkPassword) {
    return res.status(422).json({ error: true, msg: 'E-mail ou senha inválida!' });
  }

  res.json({ salaoId: salao._id, nome: salao.nome, email: salao.email, foto: null });
});

// Recuperar todos os serviços de um salão
router.get('/servicos/:salaoId', async (req, res) => {
  try {
    // Id do salão
    const { salaoId } = req.params;

    // Buscando um serviço que pertença ao salão x que esteja com o status ativo,
    // e retornando o id e o titulo do serviço
    const servicos = await Servico.find({
      salaoId,
      status: 'A',
    }).select('_id titulo');

    /* [{ label: 'Serviço', value: 122312414}] */
    res.status(200).json({
      servicos: servicos.map((s) => ({ label: s.titulo, value: s._id })),
    });
  } catch (err) {
    res.status(422).json({ error: true, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const salao = await Salao.findById(req.params.id, { senha: 0 });

    const horarios = await Horario.find({
      salaoId: req.params.id,
    }).select('dias inicio fim');

    const isOpened = await utils.isOpened(horarios);

    res.json({ error: false, salao: { ...salao._doc, isOpened } });
  } catch (err) {
    res.status(422).json({ error: true, message: err.messge });
  }
});

router.get('/', async (req, res) => {
  try {
    const salao = await Salao.find({}, { senha: 0 });

    const infoSalao = [];
    const infoHorarios = [];

    salao.map(async (s) => {
      const id = s._id.toString();
      infoSalao.push({ id, nome: s._doc.nome });
    });

    res.json({ error: false, salao: [...infoSalao] });
  } catch (err) {
    res.status(422).json({ error: true, message: err.messge });
  }
});

module.exports = router;
