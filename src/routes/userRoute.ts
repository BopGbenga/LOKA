import { Router } from "express";
import limiter from "../helpers/rateLimit";
import {
  validateUser,
  validateLogin,
  artisansField,
} from "../middlewares/userMiddleware";
import {
  createUser,
  loginUser,
  verifyEmail,
  updateUsers,
  requestPasswordReset,
  resetPasswordController,
  selectRole,
  artisandetails,
} from "../controllers/userControllers";

const router = Router();

router.post("/signup", validateUser, limiter, createUser);
router.post("/login", validateLogin, limiter, loginUser);
router.post("/request-password-reset", limiter, requestPasswordReset);
router.post("/reset-password", limiter, resetPasswordController);
router.get("/verify-email", verifyEmail);
router.post("/select-role", selectRole);
router.post("/artisan-details", artisansField, artisandetails);
router.put("/updateProfile");

export default router;
