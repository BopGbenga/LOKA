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
        // Correctly split the name to get firstname and lastname
        const nameParts = name.split(" ");
        const firstname = nameParts[0]; // The first part is the firstname
        const lastname = nameParts.slice(1).join(" "); // All other parts make up the lastname
        console.log("Extracted firstname:", firstname); // Log the extracted first name
        console.log("Extracted lastname:", lastname); // Log the extracted last name
        console.log("Extracted email:", email);
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        let emailUser = yield userRepository.findOne({ where: { email } });
        if (emailUser) {
            // If user exists, update their Google information
            emailUser.googleId = googleId;
            emailUser.firstname = firstname;
            emailUser.lastname = lastname;
            // emailUser.username = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
            emailUser.username = lastname;
            emailUser.isVerified = true;
            yield userRepository.save(emailUser);
            // Ensure req.user is set correctly
            req.login(emailUser, (err) => {
                if (err) {
                    console.error("Login Error:", err);
                    res.status(500).send("Failed to log in");
                    return;
                }
                return res.redirect("/profile");
            });
        }
        else {
            // If user doesn't exist, create a new one
            const user = new users_1.User();
            user.googleId = googleId;
            user.firstname = firstname;
            user.lastname = lastname;
            user.email = email;
            user.isVerified = true;
            // user.username = `${firstname.toLowerCase()}.${lastname.toLowerCase()}`;
            user.username = lastname;
            user.role = "consumer"; // Default role
            yield userRepository.save(user);
            // Ensure req.user is set correctly
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
        console.log(user); // Log the user object to check what is stored
        res.send(`Welcome, ${user.firstname} ${user.lastname}`);
    }
    else {
        res.redirect("/auth/google");
    }
});
exports.default = router;