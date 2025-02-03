import { Category } from "../entities/category";
import { AppDataSource } from "../ormConfig";
import { Request, Response } from "express";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, products } = req.body;

    const categoryRepository = AppDataSource.getRepository(Category);

    const exitingCategory = await categoryRepository.findOne({
      where: { name },
    });
    if (exitingCategory) {
      res.status(400).json({
        message: "category already exist",
      });
    }

    const newCategory = categoryRepository.create({
      name,
      description,
      products,
    });
    await categoryRepository.save(newCategory);
    res.status(201).json({
      message: "category added successfully",
      newCategory,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
