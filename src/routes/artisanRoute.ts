import { Router } from "express";

import {
  getUserProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  getAllProducts,
  getProductById,
} from "../controllers/productsController";
import { bearTokenAuth, isAdmin } from "../middlewares/auth";
import { validateProducts } from "../middlewares/productsMiddleware";

const router = Router();

router.get("/", bearTokenAuth, getAllProducts);
router.get("/:id", getProductById);
router.get("/", getUserProducts);
router.post("/", bearTokenAuth, isAdmin, validateProducts, createProduct);
router.put("/", bearTokenAuth, isAdmin, validateProducts, updateProduct);
router.delete("/", bearTokenAuth, isAdmin, deleteProduct);

export default router;
