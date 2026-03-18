import express from "express";
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

// Admin (protected)
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

export default router;
