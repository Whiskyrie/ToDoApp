const mongoose = require("mongoose");

const User = mongoose.model("User", {
  nome: String,
  email: String,
  password: String,
  confirmpassword: String,
});

module.exports = User;
