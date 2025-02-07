import { Router } from "express";
import { createOrder } from "../controllers/orderController";
import { bearTokenAuth } from "../middlewares/auth";

const router = Router();

router.post("/", bearTokenAuth, createOrder);

export default router;
