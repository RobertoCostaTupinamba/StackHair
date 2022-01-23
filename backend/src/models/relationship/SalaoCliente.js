const mongoose = require("mongoose");

const { Schema } = mongoose;

const timeStamp = require("../../utils/timeStamp");

const SalaoCliente = new Schema({
  salaoId: {
    type: mongoose.Types.ObjectId,
    ref: "Salao",
    required: true,
  },
  clienteId: {
    type: mongoose.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  status: {
    type: String,
    enum: ["A", "I"],
    default: "A",
  },
  dataCadastro: {
    type: Date,
    default: timeStamp,
  },
});

module.exports = mongoose.model("SalaoCliente", SalaoCliente);
