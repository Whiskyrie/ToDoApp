const bcrypt = require('bcrypt');
const User = require('/Users/evand/OneDrive/Área de Trabalho/ToDoApp/BackEnd/Database/User');

exports.registerUser = async (req, res) => {
  const { nome, email, password, confirmpassword } = req.body;

  // Validação de dados obrigatórios
  if (!nome || !email || !password || !confirmpassword) {
    return res
      .status(400)
      .json({ message: 'Todos os campos são obrigatórios!' });
  }

  // Hash da senha
  const hash = bcrypt.hashSync(password, 10);

  // Verificar se o email já está sendo usado
  const emailExistente = await User.findOne({ email: email });

  if (emailExistente) {
    return res.status(400).json({ message: 'Email já cadastrado!' });
  }

  // Criação do novo usuário
  const usuario = new User({
    nome,
    email,
    password: hash,
    confirmpassword: hash,
  });

  // Verficação de Erros
  try {
    await usuario.save();
    console.log('Usuário criado com sucesso!');
    return res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Erro ao criar usuário!' });
  }

  // Inserção do usuário no banco de dados

  usuario.save((err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Erro ao criar usuário!" });
    }

    console.log("Usuário criado com sucesso!");
    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  });
};