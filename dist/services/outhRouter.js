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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const Oauth_1 = require("./Oauth");
const ormConfig_1 = require("../ormConfig");
const users_1 = require("../entities/users");
const router = express_1.default.Router();
// Setup Passport for Google OAuth
(0, Oauth_1.setupPassport)();
// Route to initiate login
router.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { googleId, name, email } = req.user;
        if (!name || !email) {
            console.error("No name or email found in Google OAuth response");
            res
                .status(500)
                .send("Name or email not found in the Google OAuth response.");
            return;
        }
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        // Check if a user with this email already exists
        let emailUser = yield userRepository.findOne({ where: { email } });
        console.log("Email found in database:", emailUser); // Debug line
        if (emailUser) {
            if (emailUser.googleId) {
                // User already linked with Google
                console.log("User already linked with Google:", emailUser);
                res
                    .status(200)
                    .send("Welcome back! You are already registered with Google.");
                return;
            }
            else {
                // User exists but not linked with Google
                console.log("Existing user, but Google not linked:", emailUser);
                res
                    .status(400)
                    .send("User already exists with this email. Please log in manually.");
                return;
            }
        }
        else {
            // No existing user found, create a new one
            console.log("Creating new user with Google info");
            const nameParts = name.split(" ");
            const firstname = nameParts[0];
            const lastname = nameParts.slice(1).join(" ");
            const user = new users_1.User();
            user.googleId = googleId;
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.isVerified = true;
            user.username = lastname;
            user.role = "consumer"; // Default role
            yield userRepository.save(user);
            console.log("New user created:", user);
            req.login(user, (err) => {
                if (err) {
                    console.error("Login Error:", err);
                    res.status(500).send("Failed to log in");
                    return;
                }
                return res.redirect("/profile");
            });
        }
    }
    catch (error) {
        console.error("Google OAuth Error:", error);
        res.status(500).send("An error occurred during Google authentication");
    }
}));
// Profile route to show user info after successful authentication
router.get("/profile", (req, res) => {
    if (req.isAuthenticated()) {
        const user = req.user;
        res.send(`Welcome, ${user.firstname} ${user.lastname}`);
    }
    else {
        res.redirect("/auth/google");
    }
});
exports.default = router;
