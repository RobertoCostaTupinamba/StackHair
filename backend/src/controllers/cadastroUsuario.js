const bcrypt = require('bcrypt');

//Models
const User = require('../models/User');

module.exports = async (req, res) => {

    const { name, email, password } = req.body

    let errosCamposFaltando = []

    //Validação
    if (!name) {
        errosCamposFaltando.push('O nome é obrigatório')
    }

    if (!email) {
        errosCamposFaltando.push('O email é obrigatório')
    }

    if (!password) {
        errosCamposFaltando.push('O senha é obrigatório')
    }

    if (errosCamposFaltando.length != 0) {
        return res.status(422).json({ msg: errosCamposFaltando })
    }


    //Check if user exists
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(422).json({ msg: "Por favor, utilize outro e-mail" })
    }

    //create password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // create User

    const user = new User({
        name,
        email,
        password: passwordHash
    })


    try {

        await user.save()

        res.status(201).json({ msg: 'Usuário criado com sucesso' })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Houve um erro inesperado' })
    }

}