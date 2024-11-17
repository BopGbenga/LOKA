import { Request, Response, RequestHandler } from "express";
import { User } from "../entities/users";

// import * as jwt from "jsonwebtoken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CreateUserDTO, LoginUserDTO } from "../interfaces/user.DTO";
import { AppDataSource } from "../ormConfig";
import nodemailer from "nodemailer";
import { compare } from "bcrypt";

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
    const { firstname, lastname, username, email, password, role } =
      req.body as CreateUserDTO;
    const userRepository = AppDataSource.getRepository(User);

    //check for existing user
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        message: "User with emai already exist",
      });
      return;
    }
    const newUser = userRepository.create({
      firstname,
      lastname,
      username,
      email,
      password,
      role,
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
    )}/verify-email?token=${verificationToken}`;

    // Send verification email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: newUser.email,
      subject: "Verify Your Email",
      html: `<p>Hello ${newUser.username},</p>
                 <p>Thank you for registering! Please verify your email by clicking on the link below:</p>
                 <a href="${verificationLink}">Verify Email</a>`, // HTML body
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

    // Get the user repository from TypeORM and find the user by ID
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    // If the user doesn't exist, return an error
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // If the user exists, mark them as verified
    user.isVerified = true;
    await userRepository.save(user);

    res.status(200).json({ message: "Email verified successfully" });
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

    const validPassword = await compare(password, user.password);
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
    // if (username) user.lastname = username;
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
