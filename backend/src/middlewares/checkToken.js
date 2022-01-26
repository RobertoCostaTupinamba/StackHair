const jwt = require('jsonwebtoken');

module.exports = function checkToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: 'Acesso Negado!!' });
  }

  try {
    const secret = process.env.SECRET;

    const { id } = jwt.verify(token, secret);

    res.locals.id = id;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Token inválido' });
  }
};
