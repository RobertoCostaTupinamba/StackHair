const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");
const turf = require("turf");
const Salao = require("../models/Salao");
const Servico = require("../models/Servico");

// Cadastrar o salão
// Dados esperados:
// - Nome
// - E-mail
// - Senha
router.post("/register", async (req, res) => {
  try {
    const { nome, email, senha, geo } = req.body;

    console.log(nome);

    const errosCamposFaltando = [];

    // Validação
    if (!nome) {
      errosCamposFaltando.push("O nome é obrigatório");
    }

    if (!email) {
      errosCamposFaltando.push("O email é obrigatório");
    }

    if (!senha) {
      errosCamposFaltando.push("A senha é obrigatório");
    } else if (senha.length < 6) {
      errosCamposFaltando.push("A senha deve ter mais que 5 digitos");
    }

    if (errosCamposFaltando.length !== 0) {
      return res.status(422).json({ message: errosCamposFaltando });
    }

    // Validando se o usuário já existe
    const userExists = await Salao.findOne({ email });

    if (userExists) {
      return res
        .status(422)
        .json({ message: "Por favor, utilize outro e-mail" });
    }

    // gerando a senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(senha, salt);

    console.log(geo);
    // criando o salão
    const salao = await new Salao({
      nome,
      email,
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

router.post("/", async (req, res) => {
  const { email, senha } = req.body;

  const errosCamposFaltando = [];

  // Validação
  if (!email) {
    errosCamposFaltando.push("O nome é obrigatório");
  }

  if (!senha) {
    errosCamposFaltando.push("A senha é obrigatório");
  }

  if (errosCamposFaltando.length !== 0) {
    return res.status(400).json({ error: true, message: errosCamposFaltando });
  }

  // check if user exists
  const salao = await Salao.findOne({ email });

  if (!salao) {
    return res
      .status(404)
      .json({ error: true, message: "E-mail ou senha inválida!" });
  }

  // check password
  const checkPassword = await bcrypt.compare(senha, salao.senha);

  if (!checkPassword) {
    return res
      .status(422)
      .json({ error: true, msg: "E-mail ou senha inválida!" });
  }

  res.json({ salaoId: salao._id });
});

// Recuperar todos os serviços de um salão
router.get("/servicos/:salaoId", async (req, res) => {
  try {
    // Id do salão
    const { salaoId } = req.params;

    // Buscando um serviço que pertença ao salão x que esteja com o status ativo,
    // e retornando o id e o titulo do serviço
    const servicos = await Servico.find({
      salaoId,
      status: "A",
    }).select("_id titulo");

    /* [{ label: 'Serviço', value: 122312414}] */
    res.status(200).json({
      servicos: servicos.map((s) => ({ label: s.titulo, value: s._id })),
    });
  } catch (err) {
    res.status(422).json({ error: true, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const salao = await Salao.findById(req.params.id);

    // DISTANCIA em km
    const distance = turf.distance(
      turf.point(salao.geo.coordinates),
      turf.point([-18.7010522, -47.5599377])
    );

    res.json({ error: false, salao, distance });
  } catch (err) {
    res.status(422).json({ error: true, message: err.message });
  }
});

module.exports = router;
