import jwt from "jsonwebtoken";
import { User } from "../entities/users";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../ormConfig";
dotenv.config();

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const bearTokenAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const token = authHeader?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "unauthrized" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
    };
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });
    if (!user) {
      res.status(401).json({ message: "user not found" });
      return;
    }
    req.user = { id: user.id, email: user.email };
    next();
  } catch (error) {
    console.error("Authentcaion error:", error);
    res.status(500).json({ message: "internal server error" });
  }
};
