// Models
const User = require('../models/User');

module.exports = async (req, res) => {
  const { id } = res.locals;

  // check if user exists
  const user = await User.findById(id, '-password');

  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado!' });
  }

  res.status(200).json(user);
};
