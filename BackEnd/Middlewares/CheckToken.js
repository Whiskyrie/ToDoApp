const jwt = require('jsonwebtoken');

exports.checkToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Token inválido!" });
      }

      // Se o token for válido, adicione o payload decodificado à solicitação
      req.decoded = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro no servidor!" });
  }
};