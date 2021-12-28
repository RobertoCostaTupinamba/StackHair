const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeStamp = require('../../utils/timeStamp')

const SalaoColaborador = new Schema({
    salaoId: {
        type: mongoose.Types.ObjectId,
        ref: 'Salao',
        required: true,
    },
    colaboradorId: {
        type: mongoose.Types.ObjectId,
        ref: 'Colaborador',
        required: true,
    },
    status: {
        type: String,
        enum:['A','I'],
        default: 'A',
    },
    dataCadastro: {
        type: Date,
        default: timeStamp,
    }
})


module.exports = mongoose.model('SalaoColaborador', SalaoColaborador)