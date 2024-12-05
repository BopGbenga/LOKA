import { AppDataSource } from "../ormConfig";
import { User } from "../entities/users";
import bcrypt from "bcrypt";
import { Request, Response, RequestHandler } from "express";
import crypto from "crypto";
import { sendEmail } from "../utils/emailsender";
import { generateResetCode } from "../utils/tokengenerator";

// Function to send reset email
export const sendPasswordResetEmail = async (
  email: string,
  req: Request,
  res: Response
): Promise<void> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    res.status(404).json({
      message: "User not found",
      success: false,
    });
    return;
  }

  // Generate the reset code
  const resetCode = generateResetCode();
  user.resetToken = resetCode;
  user.tokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry time

  await userRepository.save(user);

  // Send the reset code via email
  await sendEmail(
    user.email,
    "Password Reset Code",
    `Your password reset code is: ${resetCode}. It will expire in 1 hour.`
  );

  res.status(200).json({
    message: "Password reset code sent to your email",
    success: true,
  });
};

// Controller to handle password reset
export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { resetCode, newPassword, confirmPassword } = req.body;
    if (!resetCode || !newPassword || !confirmPassword) {
      res.status(400).json({
        message:
          "Reset code and new password and Confirm password are required",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { resetToken: resetCode },
    });
    if (!user) {
      res.status(404).json({ message: "Invalid or expired reset code" });
      return;
    }

    if (!user.tokenExpiry || user.tokenExpiry < new Date()) {
      res.status(400).json({ message: "Reset code has expired" });
      return;
    }

    console.log("Reset code expiry:", user.tokenExpiry);

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
