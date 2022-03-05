const mongoose = require('mongoose');

const { Schema } = mongoose;

const validateEmail = require('../utils/validateEmail');

const timeStamp = require('../utils/timeStamp');

const Cliente = new Schema({
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
    required: false,
    default: null,
  },
  telefone: {
    type: String,
    required: false,
  },
  dataNascimento: {
    type: String, // YYYY-MM-DD
  },
  sexo: {
    type: String,
    enum: ['M', 'F'],
    required: false,
  },
  endereco: {
    cidade: String,
    uf: String,
    cep: String,
    numero: String,
    logradouro: String,
    pais: String,
  },
  geo: {
    coordinates: {
      type: [Number],
    },
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
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

Cliente.index({ geo: '2dsphere' });

module.exports = mongoose.model('Cliente', Cliente);
