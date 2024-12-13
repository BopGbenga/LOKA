import { AppDataSource } from "../ormConfig";
import { User } from "../entities/users";
import bcrypt from "bcrypt";
import { Request, Response, RequestHandler } from "express";
import crypto from "crypto";
import { sendEmail } from "../utils/emailsender";
import { generateResetCode } from "../utils/tokengenerator";
import Joi from "joi";

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
const passwordResetSchema = Joi.object({
  resetCode: Joi.string().required().messages({
    "any.required": '"resetCode" is required',
    "string.empty": '"resetCode" cannot be empty',
  }),
  password: Joi.string()
    .required()
    .messages({
      "any.required": "Password is required.",
      "string.empty": "Password cannot be empty.",
    })
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^ws])[A-Za-zdWS]{8,}$")
    )
    .message(
      "Password must be at least 8 characters long, contain uppercase letters, lowercase letters, numbers, and special characters."
    ),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match.",
      "any.required": "Confirm password is required.",
      "string.empty": "Confirm password cannot be empty.",
    }),
});

export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate password and confirm password with Joi first
    const { error } = passwordResetSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        message: error.details[0].message,
      });
      return;
    }

    const { resetCode, Password, confirmPassword } = req.body;

    if (!resetCode || !Password || !confirmPassword) {
      res.status(400).json({
        message: "Reset code, new password, and confirm password are required",
      });
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

    // Hash the new password and save the user
    user.password = await bcrypt.hash(Password, 10);
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
