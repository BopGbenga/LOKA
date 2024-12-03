import express from "express";
import passport from "passport";
import { setupPassport } from "./Oauth";
import { AppDataSource } from "../ormConfig";
import { User } from "../entities/users";

const router = express.Router();

// Setup Passport for Google OAuth
setupPassport();

// Route to initiate Google OAuth login
router.get("/auth/google", (req, res) => {
  const authUrl = passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
  res.redirect(authUrl); // This redirects to Google's OAuth consent screen
});

// Google OAuth callback route
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const { googleId, name, email } = req.user as any;

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

      const userRepository = AppDataSource.getRepository(User);

      let emailUser = await userRepository.findOne({ where: { email } });

      if (emailUser) {
        // If user exists, update their Google information
        emailUser.googleId = googleId;
        emailUser.firstname = firstname;
        emailUser.lastname = lastname;
        emailUser.username = lastname;
        emailUser.isVerified = true;

        await userRepository.save(emailUser);

        // Ensure req.user is set correctly
        req.login(emailUser, (err) => {
          if (err) {
            console.error("Login Error:", err);
            res.status(500).send("Failed to log in");
            return;
          }
          return res.redirect("/profile");
        });
      } else {
        // If user doesn't exist, create a new one
        const user = new User();
        user.googleId = googleId;
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.isVerified = true;
        user.username = lastname;
        user.role = "consumer"; // Default role

        await userRepository.save(user);

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
    } catch (error) {
      console.error("Google OAuth Error:", error);
      res.status(500).send("An error occurred during Google authentication");
    }
  }
);

// Profile route to show user info after successful authentication
router.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user as User;
    console.log(user); // Log the user object to check what is stored
    res.send(`Welcome, ${user.firstname} ${user.lastname}`);
  } else {
    res.redirect("/auth/google");
  }
});

export default router;
