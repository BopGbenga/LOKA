import { Request, Response } from "express";
import { AppDataSource } from "../ormConfig";
import { review } from "../entities/review";
import { User } from "../entities/users";
import { products } from "../entities/products";
import { Order } from "../entities/order";

interface AuthRequest extends Request {
  user?: any;
}

//submit a review
export const submtReview = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (rating < 1 || rating > 5) {
      res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const order = await AppDataSource.getRepository(Order).findOne({
      where: { user: { id: userId }, status: "delivered" },
      relations: ["users"],
    });

    if (!order) {
      res.status(403).json({ message: "you can only review ordered product" });
    }

    const reviewRepository = AppDataSource.getRepository(review);
    const productRepository = AppDataSource.getRepository(products);

    const reviews = reviewRepository.create({
      user: { id: userId },
      products: { id: productId },
      rating,
      comment,
    });

    await reviewRepository.save(reviews);
    res.status(201).json({
      message: "Review submitted successfully",
      reviews,
    });
  } catch (error) {
    console.error;
  }
};
