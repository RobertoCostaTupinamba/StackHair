const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Colaborador = require("../models/Colaborador");
const Salao = require("../models/Salao");
const SalaoColaborador = require("../models/relationship/SalaoColaborador");
const ColaboradorServico = require("../models/relationship/ColaboradorServico");

// Rota de cadastrar colaborador
router.post("/", async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { colaborador, salaoId } = req.body;
    let newColaborador = null;

    // verificar se o salão existe
    const existeSalao = await Salao.findOne({ salaoId });

    if (!existeSalao) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: true, message: "Salão não existe" });
    }

    // verificar se o colaborador existe
    const existeColaborador = await Colaborador.findOne({
      $or: [{ email: colaborador.email }, { telefone: colaborador.telefone }],
    });

    // Se não existir colaborador
    if (!existeColaborador) {
      newColaborador = await new Colaborador({
        ...colaborador,
      }).save({ session });
    }

    // Relacionamento

    const colaboradorId = existeColaborador
      ? existeColaborador._id
      : newColaborador._id;

    // Verifica se existe relacionamento entre salão e colaborador

    const existentRelationship = await SalaoColaborador.findOne({
      salaoId,
      colaboradorId,
      status: { $ne: "E" },
    });

    // Se não estiver vinculado
    if (!existentRelationship) {
      await new SalaoColaborador({
        salaoId,
        colaboradorId,
        status: colaborador.vinculo,
      }).save({ session });
    }

    // Se o vinculo entre colaborador e salão ja existir
    if (existentRelationship) {
      await SalaoColaborador.findOneAndUpdate(
        {
          salaoId,
          colaboradorId,
        },
        { status: colaborador.vinculo },
        { session }
      );
    }

    // Relação com as espcialidades
    await ColaboradorServico.insertMany(
      colaborador.especialidades.map(
        (servicoId) => ({
          servicoId,
          colaboradorId,
        }),
        { session }
      )
    );

    await session.commitTransaction();
    session.endSession();

    if (existeColaborador && existentRelationship) {
      res.json({ error: true, message: "Colaborador já cadastrado" });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

// Pode ser que teremos que mudar esta rota pra dentro de salão
router.put("/:colaboradorId", async (req, res) => {
  try {
    const { vinculo, vinculoId, especialidades } = req.body;
    const { colaboradorId } = req.params;

    // Vinculo
    const salaoColaborador = await SalaoColaborador.findByIdAndUpdate(
      vinculoId,
      { status: vinculo }
    );

    if (!salaoColaborador) {
      return res.status(404).json({
        error: true,
        message: "O vinculo entre salão e colaborador não foi encontrada",
      });
    }

    // Especialidades
    const colaborServico = await ColaboradorServico.deleteMany({
      colaboradorId,
    });

    if (colaborServico.deletedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "O vinculo entre colaborador e serviço não foi encontrada",
      });
    }

    const colaborServicoCreate = await ColaboradorServico.insertMany(
      especialidades.map((servicoId) => ({
        servicoId,
        colaboradorId,
      }))
    );

    if (!colaborServicoCreate) {
      return res.status(500).json({
        error: true,
        message:
          "Houve um erro interno no servidor ao tentar cadastrar a relação entre colaborador e serviço",
      });
    }

    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete("/vinculo/:id", async (req, res) => {
  try {
    const salaoColaborador = await SalaoColaborador.findByIdAndUpdate(
      req.params.id,
      { status: "E" }
    );

    if (!salaoColaborador) {
      return res.status(404).json({
        error: true,
        message: "O vinculo entre salão e colaborador não foi encontrada",
      });
    }

    return res.status(200).json({
      error: false,
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.post("/filter", async (req, res) => {
  try {
    const colaboradores = await Colaborador.find(req.body.filters, {
      senha: 0,
      __v: 0,
    });

    return res.json({ error: false, colaboradores });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.get("/salao/:salaoId", async (req, res) => {
  try {
    const { salaoId } = req.params;
    const listaColaboradores = [];

    // Recuperar vinculos
    const salaoColaboradores = await SalaoColaborador.find({
      salaoId,
      status: { $ne: "E" },
    })
      .populate("colaboradorId", { senha: 0, __v: 0 })
      .select("colaboradorId dataCadastro status");

    for (const vinculo of salaoColaboradores) {
      const especialidades = await ColaboradorServico.find({
        colaboradorId: vinculo.colaboradorId._id,
      });

      listaColaboradores.push({ ...vinculo._doc, especialidades });
    }

    return res.json({
      error: false,
      colaboradores: listaColaboradores.map((vinculo) => ({
        ...vinculo.colaboradorId._doc,
        vinculoId: vinculo._id,
        vinculo: vinculo.status,
        especialidades: vinculo.especialidades,
        dataCadastro: vinculo.dataCadastro,
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
