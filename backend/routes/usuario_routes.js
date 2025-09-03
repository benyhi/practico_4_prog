const express = require("express");
const router = express.Router();
const {
  getUserById,
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/usuario_controller");

const authMiddleware = require("../middleware/auth_middleware");
const roleMiddleware = require("../middleware/role_middleware");

router.get("/", authMiddleware, roleMiddleware(["admin"]), getUsers);
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), getUserById);
router.post("/", authMiddleware, roleMiddleware(["admin"]), createUser);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateUser);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

module.exports = router;
