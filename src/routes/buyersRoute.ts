import { Router } from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/productsController";
import { userInterest } from "../controllers/buyers";
const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/", userInterest);

export default router;
