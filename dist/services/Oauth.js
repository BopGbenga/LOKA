"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPassport = setupPassport;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
require("dotenv").config();
const app = (0, express_1.default)();
// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());
function setupPassport() {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: "http://localhost:5000/auth/google/callback",
        scope: ["profile", "email"],
    }, (accessToken, refreshToken, profile, done) => {
        var _a, _b, _c, _d;
        // Here you can handle the user's information
        const email = profile.emails && ((_a = profile.emails[0]) === null || _a === void 0 ? void 0 : _a.value);
        // Debugging logs for email access
        console.log("Profile emails:", profile.emails); // Logs the emails array
        console.log("Profile email:", profile.emails); // Logs the direct email if available
        console.log("Extracted email:", email); // Logs the email that's being used for the user
        // If no email found in the response, throw an error
        if (!email) {
            console.error("Email not found in Google OAuth response");
            return done(new Error("Email not found"));
        }
        const user = {
            googleId: profile.id,
            name: profile.displayName,
            email: (_d = (_c = (_b = profile.emails) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : "No email provided", // Assuming profile contains an email
        };
        console.log("Google OAuth Profile:", user);
        // You can save the user data in your database here
        return done(null, user);
    }));
    passport_1.default.serializeUser((user, done) => done(null, user)); // Store the full user object
    // Deserialize the full user object
    passport_1.default.deserializeUser((user, done) => {
        done(null, user); // Retrieve and pass the full user object
    });
}
