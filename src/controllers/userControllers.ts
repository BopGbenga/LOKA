import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../entities/users";
import { ArtisanProfile } from "../entities/artisans";
// import * as jwt from "jsonwebtoken";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  CreateUserDTO,
  LoginUserDTO,
  CreateArtisanDTO,
} from "../interfaces/user.DTO";
import { AppDataSource } from "../ormConfig";
import nodemailer from "nodemailer";
import { compare } from "bcrypt";
import {
  sendPasswordResetEmail,
  resetPassword,
} from "../services/passwordReset";

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//create a new user
export const createUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstname, lastname, username, email, password } =
      req.body as CreateUserDTO;
    const userRepository = AppDataSource.getRepository(User);

    //check if uername exist
    const existingUsername = await userRepository.findOne({
      where: { username },
    });
    if (existingUsername) {
      res.status(400).json({
        message: "Username is already taken. Please choose a different one.",
      });
      return;
    }

    //check for existing user
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser?.googleId) {
      res.status(400).json({
        message: "This email is already registered through Google OAuth.",
      });
      return;
    }
    if (existingUser) {
      res.status(400).json({
        message: "User with email already exist",
      });
      return;
    }
    const newUser = userRepository.create({
      firstname,
      lastname,
      username,
      email,
      password,
      role: null,
      isVerified: false,
    });
    const savedUser = await userRepository.save(newUser);

    //create email verification token
    const verificationToken = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    // verification link
    const verificationLink = `${req.protocol}://${req.get(
      "host"
    )}/users/verify-email?token=${verificationToken}`;

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: newUser.email,
      subject: "Verify Email Address for Loka",
      html: `<p>Hello ${newUser.username},</p>
                 <p>Use the following link to confirm your email addres:</p>
                 <a href="${verificationLink}">Verify Email</a>`,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError: any) {
      console.error("Error sending verification email:", emailError);
    }

    res.status(201).json({
      message: "user created successfully successfully,verification email sent",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

//verfify email
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query;

    // Check if token exists
    if (typeof token !== "string") {
      res.status(400).json({ message: "Token is required" });
      return;
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "Email is already verified." });
      return;
    }

    user.isVerified = true;
    await userRepository.save(user);

    // Redirect to the frontend verification page
    res.redirect("http://localhost:5174/VerifyEmail");
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

//user login
export const loginUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginUserDTO;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(409).json({
        message: "user not found",
        success: false,
      });
      return;
    }

    // Check if the user has verified their email
    if (user.isVerified === false) {
      res.status(403).json({
        message: "Please verify your email to login",
        success: false,
      });
    }

    const validPassword = await compare(password, user.password as string);
    if (!validPassword) {
      res.status(401).json({
        message: "Email or passsword incorrect",
      });
      return;
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    );
    res.status(200).json({
      message: "login successful",
      success: true,
      token,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
  return;
};

//Role selection
export const selectRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, role } = req.body;

    // Check if role is provided
    if (!role) {
      res.status(400).json({
        message: "Please select a role",
      });
      return;
    }

    // Fetch user from the database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    // Check if user exists
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update the role of the user
    user.role = role;
    await userRepository.save(user);

    // Return success response
    if (role === "buyer") {
      res
        .status(200)
        .json({ message: "Role selected, redirecting to buyer dashboard" });
    } else if (role === "artisan") {
      res.status(200).json({
        message: "Role selected, redirecting to artisan details page",
      });
    }
  } catch (error) {
    console.error("Error selecting role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//create Artisan
export const artisandetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      userId,
      businessName,
      businessDescription,
      businessCategory,
      businessLocation,
      contactInformation,
    } = req.body as CreateArtisanDTO;

    const userRepository = AppDataSource.getRepository(User);
    const artisanProfileRepository =
      AppDataSource.getRepository(ArtisanProfile);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["artisanProfile"],
    });
    if (!user || user.role !== "artisan") {
      res.status(404).json({ message: "Artisan not found." });
      return;
    }

    if (user.artisanProfile) {
      res
        .status(400)
        .json({ message: "Artisan profile already exists for this user." });
      return;
    }

    const artisanProfile = artisanProfileRepository.create({
      businessName,
      businessDescription,
      businessCategory,
      businessLocation,
      contactInformation,
      user,
    });

    await artisanProfileRepository.save(artisanProfile);
    user.artisanProfile = artisanProfile;
    await userRepository.save(user);

    console.log("Artisan profile created and user updated");

    res.status(200).json({
      message: "Artisan profile created successfully",
      artisanProfile,
    });
  } catch (error) {
    console.error("Error saving artisan details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//reset  user password
export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  try {
    await sendPasswordResetEmail(email, req, res);
    return;
  } catch (error: any) {
    res.status(400).json({ error: error.message });
    return;
  }
};
export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await resetPassword(req, res, next);
  } catch (error: any) {
    const errorMessage =
      error?.message || "An error occurred during password reset.";
    res.status(400).json({ error: errorMessage });
  }
};

//update user profile
export const updateUsers: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    const { firstname, lastname, username, email } = req.body as CreateUserDTO;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    if (username) user.username = username;
    // if (email) user.email = email;

    await userRepository.save(user);
    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
