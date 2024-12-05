import express from "express";
import passport from "passport";
import { setupPassport } from "./Oauth";
import { AppDataSource } from "../ormConfig";
import { User } from "../entities/users";

const router = express.Router();

// Setup Passport for Google OAuth
setupPassport();

// Route to initiate login
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

      const nameParts = name.split(" ");
      const firstname = nameParts[0];
      const lastname = nameParts.slice(1).join(" ");

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

        req.login(emailUser, (err) => {
          if (err) {
            console.error("Login Error:", err);
            res.status(500).send("Failed to log in");
            return;
          }
          return res.redirect("/profile");
        });
      } else {
        const user = new User();
        user.googleId = googleId;
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.isVerified = true;
        user.username = lastname;
        user.role = "consumer"; // Default role

        await userRepository.save(user);

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
    res.send(`Welcome, ${user.firstname} ${user.lastname}`);
  } else {
    res.redirect("/auth/google");
  }
});

export default router;
