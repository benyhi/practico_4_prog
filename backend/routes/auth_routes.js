const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const authMiddleware = require("../middleware/auth_middleware");
const roleMiddleware = require("../middleware/role_middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ message: "Perfil de usuario", user: req.user });
});

router.get("/admin", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.json({ message: "Ruta solo para administradores" });
});

router.get("/moderator", authMiddleware, roleMiddleware(["admin", "moderator"]), (req, res) => {
  res.json({ message: "Ruta para admin o moderador" });
});

module.exports = router;
