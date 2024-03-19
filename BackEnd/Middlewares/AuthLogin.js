const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('/Users/evand/OneDrive/Área de Trabalho/ToDoApp/BackEnd/Database/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verficar se o login existe
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Email inválido!" });
    }

    // Verificar se a senha é válida
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(404).json({ message: "Senha Inválida!" });
    }

    const secret = process.env.SECRET;

    const token = jwt.sign({ id: user.id }, secret);

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Usuário não encontrado!" });
  }
};