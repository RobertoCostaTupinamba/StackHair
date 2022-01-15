require('dotenv').config();

const express = require('express');
var cors = require('cors');

const morgan = require('morgan');
const mongoose = require('mongoose');
const multer = require('multer');

const Multer = multer({
    storage: multer.memoryStorage()
})

const app = express();

//Config json
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({ token: "Teste do token" });
})

//Rotas
app.use('/salao', require('./src/routes/salao.routes'))
app.use('/servico', Multer.any(), require('./src/routes/servico.routes'));

//Private Route
app.get('/users', require('./src/middlewares/checkToken'), require("./src/controllers/buscarUsuario"))

//Register User
app.post('/auth/register', require("./src/controllers/cadastroUsuario"))

//Login user
app.post("/auth/login", require("./src/controllers/autenticacaoUsuario"))


//Cedenciais

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose.connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.v2jwy.mongodb.net/StackHair?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(3333);
        console.log('Servidor iniciado na porta 3333');
        console.log('Banco conectado');
    }).catch((err) => {
        console.log(err);
    })