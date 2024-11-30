import { Router } from "express";
import limiter from "../helpers/rateLimit";
import { validateUser, validateLogin } from "../middlewares/userMiddleware";
import {
  createUser,
  loginUser,
  verifyEmail,
  updateUsers,
  requestPasswordReset,
  resetPasswordController,
} from "../controllers/userControllers";

const router = Router();

router.post("/signup", validateUser, limiter, createUser);
router.post("/login", validateLogin, limiter, loginUser);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPasswordController);
router.get("/verify-email", verifyEmail);
router.put("/updateProfile");

export default router;
