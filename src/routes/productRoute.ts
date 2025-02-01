import { Router } from "express";
import {
  getAllProducts,
  getUserProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController";
import { bearTokenAuth } from "../middlewares/auth";

const router = Router();
