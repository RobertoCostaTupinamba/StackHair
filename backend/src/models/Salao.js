const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = require('../utils/validateEmail')

const Salao = new Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
    },
    foto: String,
    capa: String,
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
        required: [true, 'Senha é obrigatório'],
        minlength: [6, 'Senha muito fraca'],
    },
    telefone: String,
    endereco: {
        cidade: String,
        uf: String,
        cep: String,
        numero: String,
        pais: String,
    },
    geo: {
        tipo: String,
        coordinates: Array,
    },
    dataCadastro: {
        type: Date,
        default: Date.now(),
    }
})

Salao.index({ geo: '2dsphere'})

module.exports = mongoose.model('Salao', Salao)