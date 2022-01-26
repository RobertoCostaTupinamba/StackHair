const mongoose = require('mongoose');

const { Schema } = mongoose;

const validateEmail = require('../utils/validateEmail');

const timeStamp = require('../utils/timeStamp');

const Colaborador = new Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
  },
  foto: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'E-mail é obrigatório'],
    validate: [validateEmail, 'Insira um endereço de E-mail válido'],
  },
  senha: {
    type: String,
    default: null,
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
  },
  dataNascimento: {
    type: String, // YYYY-MM-DD
  },
  sexo: {
    type: String,
    enum: ['M', 'F'],
    required: [true, 'Sexo é obrigatório'],
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

module.exports = mongoose.model('Colaborador', Colaborador);
