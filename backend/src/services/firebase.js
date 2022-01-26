const admin = require('firebase-admin');
const Salao = require('../models/Salao');
const Arquivo = require('../models/Arquivo');
const serviceAccount = require('../config/firebase-key.json');

const BUCKET = 'stackhair.appspot.com';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = {
  uploadToS3(imagem, path) {
    return new Promise((resolve, reject) => {
      const file = bucket.file(path);

      const stream = file.createWriteStream({
        metadata: {
          contentType: imagem.mimetype,
        },
      });

      stream.on('error', (e) => {
        console.log(e);
        return resolve({ error: true, message: e });
      });

      stream.on('finish', async () => {
        // Tornar o arquivo public
        await file.makePublic();

        // obter a url public
        return resolve({
          error: false,
          message: `https://storage.googleapis.com/${BUCKET}/${path}`,
        });
      });
      stream.end(imagem.buffer);
    });
  },
  deleteFileS3(id) {
    return new Promise((resolve, reject) => {
      const URL = `${admin.storage().bucket().storage.apiEndpoint}/${admin.storage().bucket().name}/${id}`;

      console.log(id);

      admin
        .storage()
        .bucket()
        .file(id)
        .delete()
        .catch((err) => {
          console.log('deu erro');
          resolve({ error: true, message: 'Imagem não encontrada' });
        });

      console.log(URL);
      // EXCLUIR DO BANCO DE DADOS
      Arquivo.findOneAndDelete({
        arquivo: URL,
      })
        .then((response) => {
          console.log(response);
          resolve({ error: false });
        })
        .catch((err) => {
          console.log('erro ao tentar excluir da tabela');
          resolve({ error: true, message: err.message });
        });
    });
  },
};
