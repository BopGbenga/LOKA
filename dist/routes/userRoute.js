"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimit_1 = __importDefault(require("../helpers/rateLimit"));
const userMiddleware_1 = require("../middlewares/userMiddleware");
const userControllers_1 = require("../controllers/userControllers");
const router = (0, express_1.Router)();
router.post("/signup", userMiddleware_1.validateUser, rateLimit_1.default, userControllers_1.createUser);
router.post("/login", userMiddleware_1.validateLogin, rateLimit_1.default, userControllers_1.loginUser);
router.get("/verify-email", userControllers_1.verifyEmail);
router.put("/updateProfile");
exports.default = router;
