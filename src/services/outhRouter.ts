import express from "express";
import passport from "passport";
import { setupPassport } from "./Oauth";
import { AppDataSource } from "../ormConfig";
import { User } from "../entities/users";

const router = express.Router();

// Setup Passport for Google OAuth
setupPassport();

router.get("/", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Welcome to My App</h1>
        <a href="/auth/google">
          <button style="padding: 10px; background-color: blue; color: white; border: none; border-radius: 5px;">
            Login with Google
          </button>
        </a>
      </body>
    </html>
  `);
});
// Route to start Google authentication
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

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

      const userRepository = AppDataSource.getRepository(User);

      // Check if a user with this email already exists
      let emailUser = await userRepository.findOne({ where: { email } });
      console.log("Email found in database:", emailUser); // Debug line
      if (emailUser) {
        if (emailUser.googleId) {
          // User already linked with Google
          console.log("User already linked with Google:", emailUser);
          res
            .status(200)
            .send("Welcome back! You are already registered with Google.");
          return;
        } else {
          // User exists but not linked with Google
          console.log("Existing user, but Google not linked:", emailUser);
          res
            .status(400)
            .send(
              "User already exists with this email. Please log in manually."
            );
          return;
        }
      } else {
        // No existing user found, create a new one
        console.log("Creating new user with Google info");
        const nameParts = name.split(" ");
        const firstname = nameParts[0];
        const lastname = nameParts.slice(1).join(" ");

        const user = new User();
        user.googleId = googleId;
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.isVerified = true;
        user.username = lastname;
        user.role = "consumer"; // Default role

        await userRepository.save(user);
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
