import express from "express";
import { createOrder, getMyOrders, getOrderById } from "../controller/orderController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", auth, getMyOrders);
router.get("/:id", auth, getOrderById);

export default router;
