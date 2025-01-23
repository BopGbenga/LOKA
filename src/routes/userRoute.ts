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
import { getStates } from "../controllers/states";
import { userInterest } from "../controllers/buyers";

const router = Router();

router.get("/states", getStates);

router.post("/signup", validateUser, limiter, createUser);
router.post("/login", validateLogin, limiter, loginUser);
router.post("/request-password-reset", limiter, requestPasswordReset);
router.post("/reset-password", limiter, resetPasswordController);
router.get("/verify-email", verifyEmail);
router.post("/select-role", selectRole);
router.post("/artisan-details", artisansField, artisandetails);
router.put("/updateProfile");
router.get("dashboard/prodcuts", userInterest);

export default router;
