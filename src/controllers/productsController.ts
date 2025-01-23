import { products } from "../entities/products";
import { Category } from "../entities/category";
import { Request, Response, RequestHandler, NextFunction } from "express";
import { AppDataSource } from "../ormConfig";
import { CreateProductDto } from "../interfaces/products.Dto";
//get Allproducts
const getAllProducts: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
  } catch (error) {}
};

//get product by id
export const getProductById: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = Number(req.params.id);
    const productRepository = AppDataSource.getRepository(products);
    const product = await productRepository.findOne({
      where: { id: productId },
      relations: ["category"],
    });
    if (!product) {
      res.status(500).json({ success: false, message: "product not found" });
      return;
    }
    res.send(product);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// create product
export const createProduct: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      stockQuantity,
      categoryId,
      images,
      availability,
    } = req.body as CreateProductDto;
    const productRepository = AppDataSource.getRepository(products);
    const categoryRepository = AppDataSource.getRepository(Category);
    const category = await categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found." });
      return;
    }
    const product = productRepository.create({
      name,
      description,
      price,
      stockQuantity,
      images,
      category,
      availability,
    });
  } catch (error) {}
};
