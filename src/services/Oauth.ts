import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../entities/users";

require("dotenv").config();

const app = express();
interface user {
  googleId: string;
  name: string;
  email: string;
}

interface Email {
  value: string;
  verified: boolean;
}
// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

export function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: "https://loka-1.onrender.com/auth/google/callback",
        scope: ["profile", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        // Here you can handle the user's information
        const email = profile.emails && profile.emails[0]?.value;

        // Debugging logs for email access
        console.log("Profile emails:", profile.emails); // Logs the emails array
        console.log("Profile email:", profile.emails); // Logs the direct email if available
        console.log("Extracted email:", email); // Logs the email that's being used for the user

        // If no email found in the response, throw an error
        if (!email) {
          console.error("Email not found in Google OAuth response");
          return done(new Error("Email not found"));
        }
        const user: user = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value ?? "No email provided", // Assuming profile contains an email
        };
        console.log("Google OAuth Profile:", user);
        // You can save the user data in your database here
        return done(null, user);
      }
    )
  );
  passport.serializeUser((user: any, done) => done(null, user)); // Store the full user object

  // Deserialize the full user object
  passport.deserializeUser((user: any, done) => {
    done(null, user); // Retrieve and pass the full user object
  });
}
