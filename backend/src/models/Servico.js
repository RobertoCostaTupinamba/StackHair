const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeStamp = require('../utils/timeStamp')


const Servico = new Schema({
    salaoId:{
        type: mongoose.Types.ObjectId,
        ref: 'Salao',
        required: true,
    },
    titulo:{
        type: String,
        required: true,
    },
    preco:{
        type: Number,
        required: true,
    },
    comissao:{
        type: Number, //% de comissão sobre o preço
        required: true,
    },
    duracao:{
        type: Number, // Duração em minutos do serviço
        required: true,
    },
    descricao:{
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum:['A','I','E'],
        default: 'A',
    },
    dataCadastro: {
        type: Date,
        default: timeStamp,
    }
})

module.exports = mongoose.model('Servico', Servico)