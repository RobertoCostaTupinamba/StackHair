const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
        default: Date.now(),
    }
})


module.exports = mongoose.model('SalaoColaborador', SalaoColaborador)