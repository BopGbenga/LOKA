import { Request, Response, RequestHandler } from "express";
import { User } from "../entities/users";
import * as jwt from "jsonwebtoken";
import { CreateUserDTO } from "../interfaces/user.DTO";
import { AppDataSource } from "../ormConfig";

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
    });
    const savedUser = await userRepository.save(newUser);

    res.status(201).json({
      message: "user created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};
