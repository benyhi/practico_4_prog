const jwt = require("jsonwebtoken");
const SECRET_KEY = "super_secret_key";

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "No autorizado",message: "Debes Iniciar sesion para acceder a esta ruta." });

  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "No autorizado", message: "Token inválido o expirado" });
  }
};