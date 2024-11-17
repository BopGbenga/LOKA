import { Router } from "express";
import limiter from "../helpers/rateLimit";
import { validateUser, validateLogin } from "../middlewares/userMiddleware";
import {
  createUser,
  loginUser,
  verifyEmail,
  updateUsers,
} from "../controllers/userControllers";

const router = Router();

router.post("/signup", validateUser, limiter, createUser);
router.post("/login", validateLogin, limiter, loginUser);
router.get("/verify-email", verifyEmail);
router.put("/updateProfile");

export default router;
