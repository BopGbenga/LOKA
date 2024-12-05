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
const emailsender_1 = require("../utils/emailsender");
const tokengenerator_1 = require("../utils/tokengenerator");
// Function to send reset email
const sendPasswordResetEmail = (email, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
    const user = yield userRepository.findOne({ where: { email } });
    if (!user) {
        res.status(404).json({
            message: "User not found",
            success: false,
        });
        return;
    }
    // Generate the reset code
    const resetCode = (0, tokengenerator_1.generateResetCode)();
    user.resetToken = resetCode;
    user.tokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry time
    yield userRepository.save(user);
    // Send the reset code via email
    yield (0, emailsender_1.sendEmail)(user.email, "Password Reset Code", `Your password reset code is: ${resetCode}. It will expire in 1 hour.`);
    res.status(200).json({
        message: "Password reset code sent to your email",
        success: true,
    });
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
// Controller to handle password reset
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { resetCode, newPassword, confirmPassword } = req.body;
        if (!resetCode || !newPassword || !confirmPassword) {
            res.status(400).json({
                message: "Reset code and new password and Confirm password are required",
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            res.status(400).json({ message: "Passwords do not match" });
            return;
        }
        if (newPassword.length < 6) {
            res
                .status(400)
                .json({ message: "Password must be at least 6 characters long" });
            return;
        }
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({
            where: { resetToken: resetCode },
        });
        if (!user) {
            res.status(404).json({ message: "Invalid or expired reset code" });
            return;
        }
        if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
            res.status(400).json({ message: "Reset code has expired" });
            return;
        }
        console.log("Reset code expiry:", user.tokenExpiry);
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
