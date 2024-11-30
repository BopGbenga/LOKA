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
exports.updateUsers = exports.resetPasswordController = exports.requestPasswordReset = exports.loginUser = exports.verifyEmail = exports.createUser = void 0;
const users_1 = require("../entities/users");
// import * as jwt from "jsonwebtoken";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ormConfig_1 = require("../ormConfig");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = require("bcrypt");
const authservices_1 = require("../services/authservices");
require("dotenv").config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});
//create a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname, lastname, username, email, password, role } = req.body;
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        //check for existing user
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({
                message: "User with email already exist",
            });
            return;
        }
        const newUser = userRepository.create({
            firstname,
            lastname,
            username,
            email,
            password,
            role,
            isVerified: false,
        });
        const savedUser = yield userRepository.save(newUser);
        //create email verification token
        const verificationToken = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "8h" });
        // verification link
        const verificationLink = `${req.protocol}://${req.get("host")}/verify-email?token=${verificationToken}`;
        // Send verification email
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: newUser.email,
            subject: "Verify Your Email",
            html: `<p>Hello ${newUser.username},</p>
                 <p>Thank you for registering! Please verify your email by clicking on the link below:</p>
                 <a href="${verificationLink}">Verify Email</a>`,
        };
        try {
            yield transporter.sendMail(mailOptions);
        }
        catch (emailError) {
            console.error("Error sending verification email:", emailError);
        }
        res.status(201).json({
            message: "user created successfully successfully,verification email sent",
            user: savedUser,
        });
    }
    catch (error) {
        console.error("Error creating user", error);
        res.status(500).json({
            message: "something went wrong",
        });
    }
});
exports.createUser = createUser;
//verfify email
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        // Check if token exists
        if (typeof token !== "string") {
            res.status(400).json({ message: "Token is required" });
            return;
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Get the user repository from TypeORM and find the user by ID
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({ where: { id: decoded.id } });
        // If the user doesn't exist, return an error
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // If the user exists, mark them as verified
        user.isVerified = true;
        yield userRepository.save(user);
        res.status(200).json({ message: "Email verified successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});
exports.verifyEmail = verifyEmail;
//user login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(409).json({
                message: "user not found",
                success: false,
            });
            return;
        }
        // Check if the user has verified their email
        if (user.isVerified === false) {
            res.status(403).json({
                message: "Please verify your email to login",
                success: false,
            });
        }
        const validPassword = yield (0, bcrypt_1.compare)(password, user.password);
        if (!validPassword) {
            res.status(401).json({
                message: "Email or passsword incorrect",
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_SECRET, { expiresIn: "2d" });
        res.status(200).json({
            message: "login successful",
            success: true,
            token,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    return;
});
exports.loginUser = loginUser;
//reset  user password
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield (0, authservices_1.sendPasswordResetEmail)(email, req, res);
        res
            .status(200)
            .json({ message: "Password reset link sent to your email." });
        return;
    }
    catch (error) {
        res.status(400).json({ error: error.message });
        return;
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request body:", req.body);
    const { token, newPassword } = req.body;
    console.log("Token:", token);
    console.log("New Password:", newPassword);
    try {
        yield (0, authservices_1.resetPassword)(req, res, next);
    }
    catch (error) {
        const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || "An error occurred during password reset.";
        res.status(400).json({ error: errorMessage });
    }
});
exports.resetPasswordController = resetPasswordController;
//update user profile
const updateUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        const { firstname, lastname, username, email } = req.body;
        if (firstname)
            user.firstname = firstname;
        if (lastname)
            user.lastname = lastname;
        // if (username) user.lastname = username;
        // if (email) user.email = email;
        yield userRepository.save(user);
        res.status(200).json({
            message: "User updated successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateUsers = updateUsers;
