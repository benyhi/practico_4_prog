const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require('../models/database');

const SECRET_KEY = "super_secret_key";

exports.register = (req, res) => {
  const { username, password, email } = req.body;
  let { role } = req.body;
  if (!role) role = 'user';
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Faltan campos requeridos (username, password, email)" });
  }
  db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
    if (err) return res.status(500).json({ message: 'Error al buscar usuario', error: err.message });
    if (row) return res.status(400).json({ message: 'Usuario o email ya existe' });
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role], function(err) {
      if (err) return res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
      res.json({ message: 'Usuario registrado correctamente' });
    });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Faltan campos requeridos (username, password)" });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ message: 'Error al buscar usuario', error: err.message });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token });
  });
};
