const express = require("express");
const router = express.Router();

let users = []; // banco de dados temporário

// Cadastro de usuário
router.post("/", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Preencha todos os campos" });

  const userExists = users.some(u => u.email === email);
  if (userExists) return res.status(409).json({ error: "E-mail já cadastrado" });

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  if (user.password !== password) return res.status(401).json({ error: "Senha incorreta" });

  res.json({ id: user.id, name: user.name, email: user.email });
});

// Listar usuários (para teste)
router.get("/", (req, res) => {
  res.json(users);
});

module.exports = router;
