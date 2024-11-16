import { Router } from "express";
import limiter from "../helpers/rateLimit";
import { validateUser, validateLogin } from "./userMiddleware";
import {
  createUser,
  loginUser,
  verifyEmail,
  updateUsers,
} from "./userControllers";

const router = Router();

router.post("/signup", validateUser, limiter, createUser);
router.post("/login", validateLogin, limiter, loginUser);
router.get("/verify-email", verifyEmail);

export default router;
