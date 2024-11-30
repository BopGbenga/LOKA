import { AppDataSource } from "../ormConfig";
import { User } from "../entities/users";
import bcrypt from "bcrypt";
import { Request, Response, RequestHandler } from "express";
import { generateResetToken } from "../utils/tokengenerator";
import { sendEmail } from "../utils/emailsender";

// Function to send reset email
export const sendPasswordResetEmail = async (
  email: string,
  req: Request,
  res: Response
): Promise<void> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });
  console.log(user);

  if (!user) {
    res.status(404).json({
      message: "user not found",
      success: false,
    });
    return;
  }

  const resetToken = generateResetToken();
  user.resetToken = resetToken;
  user.tokenExpiry = new Date(Date.now() + 3600000); // 1 hour

  await userRepository.save(user);

  const resetLink = `${req.protocol}://${req.get(
    "host"
  )}/reset-password?token=${resetToken}`;
  await sendEmail(
    user.email,
    "Password Reset",
    `Click here to reset your password: ${resetLink}`
  );
};

// Controller to handle password reset
export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ message: "Token and new password are required" });
      return;
    }
    if (newPassword.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { resetToken: token } });
    if (!user) {
      res.status(404).json({ message: "Invalid or expired token" });
      return;
    }

    if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
      res.status(400).json({ message: "Token has expired" });
      return;
    }

    console.log("Token expiry:", user.tokenExpiry);

    // Hash the new password and save the user
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.tokenExpiry = null;

    await userRepository.save(user);
    res.status(200).json({ message: "Password reset successful" });
    return;
  } catch (error: any) {
    console.error("Error during password reset:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};
