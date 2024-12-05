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
        const email = profile.emails && profile.emails[0]?.value;

        // If no email found in the response, throw an error
        if (!email) {
          console.error("Email not found in Google OAuth response");
          return done(new Error("Email not found"));
        }
        const user: user = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value ?? "No email provided",
        };

        return done(null, user);
      }
    )
  );
  passport.serializeUser((user: any, done) => done(null, user));

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
}
