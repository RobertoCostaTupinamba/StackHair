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

router.put("/:colaboradorId", async (req, res) => {
  try {
    // eslint-disable-next-line no-empty-pattern
    const {} = req.body;
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
