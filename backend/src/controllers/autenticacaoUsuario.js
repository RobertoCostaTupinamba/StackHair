const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Models
const User = require('../models/User');

module.exports = async (req, res) => {
  const { email, password } = req.body;

  let errosCamposFaltando;

  // Validação
  if (!email) {
    errosCamposFaltando.push('O nome é obrigatório');
  }

  if (!password) {
    errosCamposFaltando.push('O senha é obrigatório');
  }

  // check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: 'E-mail ou senha inválida!' });
  }

  // check password
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: 'E-mail ou senha inválida!' });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      {
        expiresIn: '5s', // Expira em 5 segundos
      },
    );

    res.status(200).json({ msg: 'Autenticado', token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Houve um erro inesperado' });
  }
};
