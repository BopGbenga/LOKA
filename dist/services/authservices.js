"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendPasswordResetEmail = void 0;
const ormConfig_1 = require("../ormConfig");
const users_1 = require("../entities/users");
const bcrypt_1 = __importDefault(require("bcrypt"));
const tokengenerator_1 = require("../utils/tokengenerator");
const emailsender_1 = require("../utils/emailsender");
// Function to send reset email
const sendPasswordResetEmail = (email, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
    const user = yield userRepository.findOne({ where: { email } });
    console.log(user);
    if (!user) {
        res.status(404).json({
            message: "user not found",
            success: false,
        });
        return;
    }
    const resetToken = (0, tokengenerator_1.generateResetToken)();
    user.resetToken = resetToken;
    user.tokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    yield userRepository.save(user);
    const resetLink = `${req.protocol}://${req.get("host")}/reset-password?token=${resetToken}`;
    yield (0, emailsender_1.sendEmail)(user.email, "Password Reset", `Click here to reset your password: ${resetLink}`);
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
// Controller to handle password reset
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            res.status(400).json({ message: "Token and new password are required" });
            return;
        }
        if (newPassword.length < 6) {
            res
                .status(400)
                .json({ message: "Password must be at least 6 characters long" });
            return;
        }
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({ where: { resetToken: token } });
        if (!user) {
            res.status(404).json({ message: "Invalid or expired token" });
            return;
        }
        if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
            res.status(400).json({ message: "Token has expired" });
            return;
        }
        console.log("Token expiry:", user.tokenExpiry);
        // Hash the new password and save the user
        user.password = yield bcrypt_1.default.hash(newPassword, 10);
        user.resetToken = null;
        user.tokenExpiry = null;
        yield userRepository.save(user);
        res.status(200).json({ message: "Password reset successful" });
        return;
    }
    catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: error.message });
        return;
    }
});
exports.resetPassword = resetPassword;
