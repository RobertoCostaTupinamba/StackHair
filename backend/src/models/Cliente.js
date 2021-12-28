const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validateEmail = require('../utils/validateEmail')



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
        required: [true, 'Senha é obrigatório'],
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
        enum:['M','F'],
        required: [true, 'Sexo é obrigatório'],
    },
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
    status: {
        type: String,
        enum:['A','I'],
        default: 'A',
    },
    dataCadastro: {
        type: Date,
        default: Date.now(),
    }
})

Cliente.index({ geo: '2dsphere'})

module.exports = mongoose.model('Cliente', Cliente)