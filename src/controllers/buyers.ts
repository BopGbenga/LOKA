import { Request, Response, RequestHandler, NextFunction } from "express";
import { User } from "../entities/users";
import { AppDataSource } from "../ormConfig";
import { category } from "../entities/category";
import { products } from "../entities/products";
import { In, Not } from "typeorm";

//user interest
const userInterest: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = Number(req.params.id);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ["interests"],
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const interestIds = user.interests.map((category) => category.id);
    const productRepository = AppDataSource.getRepository(products);
    const forYouProducts = await productRepository.find({
      where: {
        category: { id: In(interestIds) },
        availability: true,
      },
      relations: ["category", "artisan"],
    });

    const otherProducts = await productRepository.find({
      where: {
        category: { id: Not(In(interestIds)) },
        availability: true,
      },
      relations: ["category", "artisan"],
    });

    res.json({
      forYou: forYouProducts,
      others: otherProducts,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
