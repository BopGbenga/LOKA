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
const joi_1 = __importDefault(require("joi"));
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
const passwordResetSchema = joi_1.default.object({
    resetCode: joi_1.default.string().required().messages({
        "any.required": '"resetCode" is required',
        "string.empty": '"resetCode" cannot be empty',
    }),
    newPassword: joi_1.default.string()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d])[A-Za-z\\d\\S]{8,}$"))
        .required()
        .messages({
        "any.required": "newPassword is required.",
        "string.empty": "newPassword cannot be empty.",
        "string.pattern.base": "Password must be at least 8 characters long, contain uppercase letters, lowercase letters, numbers, and special characters.",
    }),
    confirmPassword: joi_1.default.string()
        .valid(joi_1.default.ref("newPassword"))
        .required()
        .messages({
        "any.only": "Passwords do not match.",
        "any.required": "Confirm password is required.",
        "string.empty": "Confirm password cannot be empty.",
    }),
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate password and confirm password with Joi
        const { error } = passwordResetSchema.validate(req.body);
        if (error) {
            res.status(400).json({
                message: error.details[0].message,
            });
            return;
        }
        const { resetCode, newPassword, confirmPassword } = req.body;
        if (!resetCode || !newPassword || !confirmPassword) {
            res.status(400).json({
                message: "Reset code, new password, and confirm password are required",
            });
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
