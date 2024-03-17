/* Imports*/

require("dotenv").config();
const express = require("express");
const mongosse = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const app = express();

// Config Express

app.use(express.json());
app.use(express.static(path.join(__dirname, "./FrontEnd")));
app.use(express.urlencoded({ extended: true }));

//Models

const User = require("./models/User");

// Open Route - Public Route

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bem-Vindo a nossa API!" });
});

// Private Route

app.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;

  // Procura o usuário no banco de dados

  const user = await User.findById(id, {
    password: 0,
    confirmpassword: 0,
    __v: 0,
  });
  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }
  res.status(200).json({ user });
});
function checkToken(req, res, next) {
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
}

// Registro de Usuário

app.post("/registro", async (req, res) => {
  const { nome, email, password, confirmpassword } = req.body;

  // Validação de dados obrigatórios

  if (!nome || !email || !password || !confirmpassword) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios!" });
  }

  // Hash da senha

  const hash = bcrypt.hashSync(password, 10);

  // Verificar se o email já está sendo usado

  const emailExistente = await User.findOne({ email: email });

  if (emailExistente) {
    return res.status(400).json({ message: "Email já cadastrado!" });
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
    console.log("Usuário criado com sucesso!");
    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao criar usuário!" });
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
});

// Login do Usuário
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./FrontEnd", "login.html"));
});

app.post("/login", async (req, res) => {
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

    res.status(200).redirect("/todo");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Usuário não encontrado!" });
  }
});
// Conexão

app.post("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "./FrontEnd", "todo.html"));
});

app.get("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "./FrontEnd", "todo.html"));
});

mongosse
  .connect(
    "mongodb+srv://evandroropfilho:K206wibABGTilAZm@cluster0.rvtkh7w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectado ao banco de dados!");
  })
  .catch((err) => console.log(err));
