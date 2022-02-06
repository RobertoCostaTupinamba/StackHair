const mongoose = require('mongoose');

const { Schema } = mongoose;

// Amazon S3

const ApiGoogle = new Schema({
  contador: {
    type: Number,
    default: 0,
  },
  dataCadastro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ApiGoogle', ApiGoogle);
