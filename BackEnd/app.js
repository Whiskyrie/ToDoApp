/* Imports*/
require("dotenv").config();
const express = require("express");
const mongosse = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const app = express();
const authMiddleware = require('./Middlewares/CheckToken');
const authRegister = require('./Middlewares/AuthRegister');
const authLogin = require('./Middlewares/AuthLogin');

// Config Express

app.use(express.json());
app.use(express.static(path.join(__dirname, "./FrontEnd")));
app.use(express.urlencoded({ extended: true }));

//Models

const User = require("./Database/User");

// Open Route - Public Route

app.get("/", (req, res) => {
  res.status(200).json({ message: "Bem-Vindo a nossa API!" });
});

// Private Route

app.get("/user/:id", authMiddleware.checkToken, async (req, res) => {
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
// Registro de Usuário
app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "./FrontEnd", "registro.html"));
});
app.post('/registro', authRegister.registerUser);


// Login do Usuário
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./FrontEnd", "login.html"));
});
app.post('/login', authLogin.login);
// Conexão

app.post("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "./FrontEnd", "todo.html"));
});

app.get("/todo", (req, res) => {
  res.sendFile(path.join(__dirname, "./FrontEnd", "todo.html"));
});

mongosse.connect(
    "mongodb+srv://evandroropfilho:K206wibABGTilAZm@cluster0.rvtkh7w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectado ao banco de dados!");
  })
  .catch((err) => console.log(err));
