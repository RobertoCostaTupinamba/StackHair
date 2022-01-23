const mongoose = require("mongoose");

const { Schema } = mongoose;

const timeStamp = require("../utils/timeStamp");

// Amazon S3

const Arquivo = new Schema({
  referenciaId: {
    type: Schema.Types.ObjectId,
    refPath: "model",
  },
  model: {
    type: String,
    required: true,
    enum: ["Servico", "Salao"],
  },
  arquivo: {
    type: String,
    required: true,
  },
  dataCadastro: {
    type: Date,
    default: timeStamp,
  },
});

module.exports = mongoose.model("Arquivo", Arquivo);
