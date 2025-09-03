const express = require("express");
const router = express.Router();
const {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/producto_controller");

const authMiddleware = require("../middleware/auth_middleware");
const roleMiddleware = require("../middleware/role_middleware");

router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProductById);

router.post("/", authMiddleware, roleMiddleware(["admin"]), createProduct);
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProduct);

module.exports = router;
