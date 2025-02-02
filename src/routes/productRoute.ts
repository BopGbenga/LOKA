import { Router } from "express";
import {
  getAllProducts,
  getUserProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController";
import { bearTokenAuth, isAdmin } from "../middlewares/auth";
import { validateProducts } from "../middlewares/productsMiddleware";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/", bearTokenAuth, getAllProducts);
router.post("/", bearTokenAuth, isAdmin, validateProducts, createProduct);
router.put("/", bearTokenAuth, isAdmin, validateProducts, updateProduct);
router.delete("/", bearTokenAuth, isAdmin, deleteProduct);

export default router;
