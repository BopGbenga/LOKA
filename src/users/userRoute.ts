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

router.post("s/ignup", validateUser, limiter, createUser);
router.get("/login", validateLogin, limiter, loginUser);

export default router;
