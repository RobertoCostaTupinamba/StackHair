const mongoose = require('mongoose');

const { Schema } = mongoose;

const timeStamp = require('../../utils/timeStamp');

const ColaboradorServico = new Schema({
  colaboradorId: {
    type: mongoose.Types.ObjectId,
    ref: 'Colaborador',
    required: true,
  },
  servicoId: {
    type: mongoose.Types.ObjectId,
    ref: 'Servico',
    required: true,
  },
  status: {
    type: String,
    enum: ['A', 'I'],
    default: 'A',
  },
  dataCadastro: {
    type: Date,
    default: timeStamp,
  },
});

module.exports = mongoose.model('ColaboradorServico', ColaboradorServico);
