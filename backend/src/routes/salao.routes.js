const express = require('express');
const router = express.Router();

const Salao = require('../models/Salao')

const bcrypt = require('bcrypt');

//Cadastrar o salão
//Dados esperados:
// - Nome
// - E-mail
// - Senha
router.post('/', async (req, res) => {
    try {

        const { nome, email, senha } = req.body;


        let errosCamposFaltando = []

        //Validação
        if (!nome) {
            errosCamposFaltando.push('O nome é obrigatório')
        }

        if (!email) {
            errosCamposFaltando.push('O email é obrigatório')
        }

        if (!senha) {
            errosCamposFaltando.push('A senha é obrigatório')
        } else if (senha.length < 6) {
            errosCamposFaltando.push('A senha deve ter mais que 5 digitos')
        }

        if (errosCamposFaltando.length != 0) {
            return res.status(422).json({ message: errosCamposFaltando })
        }

        //Validando se o usuário já existe
        const userExists = await Salao.findOne({ email: email })

        if (userExists) {
            return res.status(422).json({ message: "Por favor, utilize outro e-mail" })
        }

        //gerando a senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // criando o salão
        const salao = await new Salao({
            nome,
            email,
            senha: passwordHash
        }).save();

        res.status(201).json({ salao })

    } catch (err) {
        res.status(422).json({ error: true, message: err.message })
    }
});

module.exports = router;