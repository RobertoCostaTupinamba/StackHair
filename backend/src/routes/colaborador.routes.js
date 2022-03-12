const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const { uploadToS3, deleteFileS3 } = require('../services/firebase');
const Colaborador = require('../models/Colaborador');
const Salao = require('../models/Salao');
const SalaoColaborador = require('../models/relationship/SalaoColaborador');
const ColaboradorServico = require('../models/relationship/ColaboradorServico');
const Arquivo = require('../models/Arquivo');

// Rota de cadastrar colaborador
router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const urlArquivos = [];
  const errors = [];

  const session = await db.startSession();
  session.startTransaction();

  try {
    const { salaoId } = req.body;

    const colaborador = JSON.parse(req.body.colaborador);
    let newColaborador = null;

    // verificar se o salão existe
    const existeSalao = await Salao.findOne({ salaoId });

    if (!existeSalao) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: true, message: 'Salão não existe' });
    }

    // verificar se o colaborador existe
    const existeColaborador = await Colaborador.findOne({
      $or: [{ email: colaborador.email }, { telefone: colaborador.telefone }],
    });

    // Se não existir colaborador
    if (!existeColaborador) {
      newColaborador = await new Colaborador({
        dataNascimento: colaborador.dataNascimento,
        nome: colaborador.nome,
        email: colaborador.email,
        telefone: colaborador.telefone,
        sexo: colaborador.sexo,
        especialidades: colaborador.especialidades,
        vinculo: colaborador.vinculo,
      }).save({ session });
    }

    if (errors.length > 0) {
      res.json(errors);
      return false;
    }

    // Relacionamento

    const colaboradorId = existeColaborador ? existeColaborador._id : newColaborador._id;

    // Upload de imagem
    if (req.files && req.files.length !== 0) {
      for (const [i, key] of Object.keys(req.files).entries()) {
        const imagem = req.files[key];

        const nameParts = imagem.originalname.split('.');
        const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
        const path = `colaborador/${salaoId}/${fileName}`;

        const response = await uploadToS3(imagem, path);

        if (response.error) {
          errors.push({ error: true, message: response.message.message });
        } else {
          urlArquivos.push(response.message);
        }
      }

      // CRIAR ARQUIVO
      const arquivos = urlArquivos.map((arquivo) => ({
        referenciaId: colaboradorId,
        model: 'Colaborador',
        arquivo,
      }));
      await new Arquivo(...arquivos).save({ session });
    }

    // Verifica se existe relacionamento entre salão e colaborador

    const existentRelationship = await SalaoColaborador.findOne({
      salaoId,
      colaboradorId,
      status: { $ne: 'E' },
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
        { session },
      );
    }

    // Relação com as espcialidades
    await ColaboradorServico.insertMany(
      colaborador.especialidades.map(
        (servicoId) => ({
          servicoId,
          colaboradorId,
        }),
        { session },
      ),
    );

    await session.commitTransaction();
    session.endSession();

    if (existeColaborador && existentRelationship) {
      res.json({ error: true, message: 'Colaborador já cadastrado' });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

router.post('/delete-arquivo', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: true, message: 'É necessario informar um id' });
    }

    const response = await deleteFileS3(id);

    if (response.error) {
      return res.status(404).json({ error: true, message: response.message });
    }

    return res.json({ error: false, message: 'Arquivo deletado' });
  } catch (err) {
    return res.status(422).json({ error: true, message: err.message });
  }
});

// Pode ser que teremos que mudar esta rota pra dentro de salão
router.put('/:colaboradorId', async (req, res) => {
  try {
    const { vinculo, vinculoId, especialidades } = req.body;
    const { colaboradorId } = req.params;

    // Vinculo
    const salaoColaborador = await SalaoColaborador.findByIdAndUpdate(vinculoId, { status: vinculo });

    if (!salaoColaborador) {
      return res.status(404).json({
        error: true,
        message: 'O vinculo entre salão e colaborador não foi encontrada',
      });
    }

    // Especialidades
    await ColaboradorServico.deleteMany({
      colaboradorId,
    });

    const colaborServicoCreate = await ColaboradorServico.insertMany(
      especialidades.map((servicoId) => ({
        servicoId,
        colaboradorId,
      })),
    );

    if (!colaborServicoCreate) {
      return res.status(500).json({
        error: true,
        message: 'Houve um erro interno no servidor ao tentar cadastrar a relação entre colaborador e serviço',
      });
    }

    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.put('/:colaboradorId/image', async (req, res) => {
  try {
    const { salaoId, id, referenciaId } = req.body;
    const { colaboradorId } = req.params;
    const urlArquivos = [];
    const errors = [];

    // verificar se o salão existe
    const existeSalao = await Salao.findOne({ salaoId });

    if (!existeSalao) {
      return res.status(404).json({ error: true, message: 'Salão não existe' });
    }

    // verificar se o colaborador existe
    const colaborador = await Colaborador.findOne(
      {
        colaboradorId,
      },
      { senha: 0 },
    );

    if (!colaborador) {
      return res.status(404).json({ error: true, message: 'Colaborador não encontrado' });
    }

    if (id && referenciaId) {
      const deletedArquivo = await Arquivo.findByIdAndDelete(referenciaId);

      if (!deletedArquivo) {
        return res.status(404).json({ error: true, message: 'O arquivo não foi encrontado no banco para excluir' });
      }

      const response = await deleteFileS3(id);
      if (response.error) {
        return res.status(404).json({ error: true, message: response.message });
      }
    }

    // Upload de imagem
    if (req.files.length !== 0) {
      for (const [i, key] of Object.keys(req.files).entries()) {
        const imagem = req.files[key];

        const nameParts = imagem.originalname.split('.');
        const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
        const path = `colaborador/${salaoId}/${fileName}`;

        const response = await uploadToS3(imagem, path);

        if (response.error) {
          errors.push({ error: true, message: response.message.message });
        } else {
          urlArquivos.push(response.message);
        }
      }

      // CRIAR ARQUIVO
      const arquivos = urlArquivos.map((arquivo) => ({
        referenciaId: colaboradorId,
        model: 'Colaborador',
        arquivo,
      }));

      await new Arquivo(...arquivos).save();

      colaborador.foto = arquivos[0].arquivo;

      colaborador.save();

      return res.json({ error: false, colaborador, message: 'Imagem atualizada' });
    }

    return res.status(400).json({ error: true, message: 'Imgem não eviada' });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete('/vinculo/:id', async (req, res) => {
  try {
    const { id } = req.body;
    const salaoColaborador = await SalaoColaborador.findByIdAndUpdate(req.params.id, { status: 'E' });

    await ColaboradorServico.findOneAndDelete({ colaboradorId: id });

    if (!salaoColaborador) {
      return res.status(404).json({
        error: true,
        message: 'O vinculo entre salão e colaborador não foi encontrada',
      });
    }

    return res.status(200).json({
      error: false,
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.post('/filter', async (req, res) => {
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

router.get('/salao/:salaoId', async (req, res) => {
  try {
    const { salaoId } = req.params;
    const listaColaboradores = [];

    const servicosSalao = '';

    // Recuperar vinculos
    const salaoColaboradores = await SalaoColaborador.find({
      salaoId,
      status: { $ne: 'E' },
    })
      .populate('colaboradorId', { senha: 0, __v: 0 })
      .select('colaboradorId dataCadastro status');

    for (const vinculo of salaoColaboradores) {
      const [arquivo] = await Arquivo.find({
        model: 'Colaborador',
        referenciaId: vinculo.colaboradorId._id,
      });

      const especialidades = await ColaboradorServico.find({
        colaboradorId: vinculo.colaboradorId._id,
      });

      listaColaboradores.push({
        ...vinculo._doc,
        foto: arquivo ? arquivo._doc.arquivo : undefined,
        especialidades: especialidades.map((especialidade) => especialidade.servicoId),
      });
    }

    return res.json({
      error: false,
      colaboradores: listaColaboradores.map((vinculo) => ({
        ...vinculo.colaboradorId._doc,
        foto: vinculo.foto,
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
