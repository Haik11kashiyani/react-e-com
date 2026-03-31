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
import adminAuth from "../middleware/adminAuth.js";
import { uploadProductImage } from "../config/multer.js";

const router = express.Router();

// Public
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

// Admin (protected)
router.post("/", auth, adminAuth, uploadProductImage.single("imageFile"), createProduct);
router.put("/:id", auth, adminAuth, uploadProductImage.single("imageFile"), updateProduct);
router.delete("/:id", auth, adminAuth, deleteProduct);

export default router;
