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
exports.updateUsers = exports.resetPasswordController = exports.requestPasswordReset = exports.artisandetails = exports.selectRole = exports.loginUser = exports.verifyEmail = exports.createUser = void 0;
const users_1 = require("../entities/users");
const artisans_1 = require("../entities/artisans");
// import * as jwt from "jsonwebtoken";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ormConfig_1 = require("../ormConfig");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = require("bcrypt");
const passwordReset_1 = require("../services/passwordReset");
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
        const { firstname, lastname, username, email, password } = req.body;
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        //check if uername exist
        const existingUsername = yield userRepository.findOne({
            where: { username },
        });
        if (existingUsername) {
            res.status(400).json({
                message: "Username is already taken. Please choose a different one.",
            });
            return;
        }
        //check for existing user
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.googleId) {
            res.status(400).json({
                message: "This email is already registered through Google OAuth.",
            });
            return;
        }
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
            role: null,
            isVerified: false,
        });
        const savedUser = yield userRepository.save(newUser);
        //create email verification token
        const verificationToken = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "8h" });
        // verification link
        const verificationLink = `${req.protocol}://${req.get("host")}/users/verify-email?token=${verificationToken}`;
        // Send verification email
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: newUser.email,
            subject: "Verify Email Address for Loka",
            html: `<p>Hello ${newUser.username},</p>
                 <p>Use the following link to confirm your email addres:</p>
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
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({ where: { id: decoded.id } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (user.isVerified) {
            res.status(400).json({ message: "Email is already verified." });
            return;
        }
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
//Role selection
const selectRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, role } = req.body;
        // Check if role is provided
        if (!role) {
            res.status(400).json({
                message: "Please select a role",
            });
            return;
        }
        // Fetch user from the database
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        // Check if user exists
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Update the role of the user
        user.role = role;
        yield userRepository.save(user);
        // Return success response
        if (role === "buyer") {
            res
                .status(200)
                .json({ message: "Role selected, redirecting to buyer dashboard" });
        }
        else if (role === "artisan") {
            res.status(200).json({
                message: "Role selected, redirecting to artisan details page",
            });
        }
    }
    catch (error) {
        console.error("Error selecting role:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.selectRole = selectRole;
//create Artisan
const artisandetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, businessName, businessDescription, businessCategory, businessLocation, contactInformation, } = req.body;
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const artisanProfileRepository = ormConfig_1.AppDataSource.getRepository(artisans_1.ArtisanProfile);
        const user = yield userRepository.findOne({
            where: { id: userId },
            relations: ["artisanProfile"],
        });
        if (!user || user.role !== "artisan") {
            res.status(404).json({ message: "Artisan not found." });
            return;
        }
        if (user.artisanProfile) {
            res
                .status(400)
                .json({ message: "Artisan profile already exists for this user." });
            return;
        }
        const artisanProfile = artisanProfileRepository.create({
            businessName,
            businessDescription,
            businessCategory,
            businessLocation,
            contactInformation,
            user,
        });
        yield artisanProfileRepository.save(artisanProfile);
        user.artisanProfile = artisanProfile;
        yield userRepository.save(user);
        console.log("Artisan profile created and user updated");
        res.status(200).json({
            message: "Artisan profile created successfully",
            artisanProfile,
        });
    }
    catch (error) {
        console.error("Error saving artisan details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.artisandetails = artisandetails;
//reset  user password
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield (0, passwordReset_1.sendPasswordResetEmail)(email, req, res);
        return;
    }
    catch (error) {
        res.status(400).json({ error: error.message });
        return;
    }
});
exports.requestPasswordReset = requestPasswordReset;
const resetPasswordController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, passwordReset_1.resetPassword)(req, res, next);
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
        if (username)
            user.username = username;
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
