const express = require('express');

const router = express.Router();

const Servico = require('../models/Servico');
const Salao = require('../models/Salao');
const Arquivo = require('../models/Arquivo');
const { uploadToS3, deleteFileS3 } = require('../services/firebase');

// Criação de um serviço
// Dados esperados:
// - salaoId
// - servico {
//   "salaoId": "61cf6b445963f558dfa38844",
//   "titulo": "Serviço Teste",
//   "preco": 20,
//   "comissao": 10,
//   "duracao": 30,
//   "descricao": "Descrição Teste"
// }
// - arquivos
router.post('/', async (req, res) => {
  const { salaoId } = req.body;
  const urlArquivos = [];
  const errors = [];
  const jsonServico = JSON.parse(req.body.servico);

  const salao = await Salao.findById(salaoId, '-senha');

  // Upload de imagem
  if (req.files.length !== 0) {
    for (const [i, key] of Object.keys(req.files).entries()) {
      const imagem = req.files[key];

      const nameParts = imagem.originalname.split('.');
      const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
      const path = `servicos/${salaoId}/${fileName}`;

      const response = await uploadToS3(imagem, path);

      if (response.error) {
        errors.push({ error: true, message: response.message.message });
      } else {
        urlArquivos.push(response.message);
      }
    }
  }

  if (errors.length > 0) {
    res.json(errors);
    return false;
  }

  if (!salao) {
    return res.status(404).json({ error: true, message: 'Salão não existe' });
  }

  // Validação
  if (!salao) {
    return res.status(404).json({ error: true, message: 'Salão não existe' });
  }

  if (typeof jsonServico.titulo === 'undefined' || jsonServico.titulo.length === 0) {
    return res.status(422).json({ error: true, message: 'Serviço precisa ter um titulo' });
  }

  if (typeof jsonServico.preco === 'undefined' || jsonServico.preco.length === 0) {
    return res.status(422).json({ error: true, message: 'Serviço precisa ter um preço' });
  }

  if (typeof jsonServico.comissao === 'undefined' || jsonServico.comissao.length === 0) {
    return res.status(422).json({ error: true, message: 'Serviço precisa ter uma comissao' });
  }

  if (typeof jsonServico.duracao === 'undefined' || jsonServico.duracao.length === 0) {
    return res.status(422).json({ error: true, message: 'Serviço precisa ter uma duracao' });
  }

  if (typeof jsonServico.duracao === 'undefined' || jsonServico.duracao.length === 0) {
    return res.status(422).json({ error: true, message: 'Serviço precisa ter uma duracao' });
  }

  if (typeof jsonServico.descricao === 'undefined' || jsonServico.descricao.length === 0) {
    return res.status(422).json({ error: true, message: 'Serviço precisa ter uma descricao' });
  }

  // CRIAR SERVIÇO
  jsonServico.salaoId = req.body.salaoId;
  const servico = await new Servico(jsonServico).save();

  // CRIAR ARQUIVO
  const arquivos = urlArquivos.map((arquivo) => ({
    referenciaId: servico._id,
    model: 'Servico',
    arquivo,
  }));
  await Arquivo.insertMany(arquivos);

  res.json({ servico, arquivos });
});

// Atualizar um serviço
router.put('/:id', async (req, res) => {
  const { salaoId } = req.body;
  const urlArquivos = [];
  const errors = [];
  const jsonSevico = JSON.parse(req.body.servico);

  // ATUALIZAR DADOS DE SERVIÇO
  let servico = await Servico.findByIdAndUpdate(req.params.id, jsonSevico);

  if (!servico) {
    return res.status(404).json({ error: true, message: 'Serviço não encontrado' });
  }

  // Pegando dados atualizados
  servico = await Servico.findById(req.params.id);

  // Upload de imagem
  if (req.files.length !== 0) {
    for (const [i, key] of Object.keys(req.files).entries()) {
      const imagem = req.files[key];

      const nameParts = imagem.originalname.split('.');
      const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
      const path = `servicos/${salaoId}/${fileName}`;

      const response = await uploadToS3(imagem, path);

      if (response.error) {
        errors.push({ error: true, message: response.message.message });
      } else {
        urlArquivos.push(response.message);
      }
    }
  }

  if (errors.length > 0) {
    res.json(errors);
    return false;
  }

  if (urlArquivos && urlArquivos.length !== 0) {
    // CRIAR ARQUIVO
    const arquivos = urlArquivos.map((arquivo) => ({
      referenciaId: req.params.id,
      model: 'Servico',
      arquivo,
    }));
    await Arquivo.insertMany(arquivos);
  }

  res.json({ error: false, servico });
});

router.get('/salao/:salaoId', async (req, res) => {
  try {
    const servicosSalao = [];

    const servicos = await Servico.find({
      salaoId: req.params.salaoId,
      status: { $ne: 'E' },
    });

    for (const servico of servicos) {
      const arquivos = await Arquivo.find({
        model: 'Servico',
        referenciaId: servico._id,
      });
      servicosSalao.push({ ...servico._doc, arquivos });
    }

    return res.status(200).json({
      servicos: servicosSalao,
    });
  } catch (err) {
    return res.json({ error: true, message: err.message });
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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await Servico.findByIdAndUpdate(id, { status: 'E' });

    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
