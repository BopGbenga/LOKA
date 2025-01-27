import { products } from "../entities/products";
import { Category } from "../entities/category";
import { Request, Response, RequestHandler, NextFunction } from "express";
import { AppDataSource } from "../ormConfig";
import { CreateProductDto } from "../interfaces/products.Dto";
import { Repository } from "typeorm";

interface AuthRequest extends Request {
  user?: any;
}

//get Allproducts
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, category } = req.query;
    const productRepository: Repository<products> =
      AppDataSource.getRepository(products);

    const queryBuilder = productRepository.createQueryBuilder("product");

    if (name) {
      queryBuilder.andWhere("product.name ILIKE :name", { name: `%${name}%` });
    }

    if (category) {
      queryBuilder.andWhere("product.category ILIKE :category", {
        category: `%${category}%`,
      });
    }

    const allProducts = await queryBuilder.getMany();
    res.status(200).json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
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
    await productRepository.save(product);
    res.status(201).json({
      message: "product added successsfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//update product
export const updateProduct: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const prooductId = Number(req.params.id);
    const productRepository = AppDataSource.getRepository(products);
    const product = await productRepository.findOne({
      where: { id: prooductId },
    });
    if (!product) {
      res.status(404).json({
        message: "product not found",
      });
      return;
    }
    const {
      name,
      descriptiion,
      price,
      stockQuantity,
      images,
      category,
      availability,
    } = req.body;
    if (name) product.name = name;
    if (descriptiion) product.description;
    if (price) product.price;
    if (stockQuantity) product.stockQuantity;
    if (images) product.images;
    if (category) product.category;
    if (availability) product.availability;

    await productRepository.save(product);
    res.status(200).json({
      message: "product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete product
export const deleteProduct: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id; // Assumes `req.user` is populated via middleware
    const productId = Number(req.params.id); // Extract product ID from route params
    const productRepository = AppDataSource.getRepository(products);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return; // Stop further execution
    }

    // Find product by user ID and product ID
    const product = await productRepository.findOne({
      where: { user: { id: userId }, id: productId },
    });

    if (!product) {
      res.status(404).json({
        message:
          "Product not found or you are not authorized to delete this product",
      });
      return;
    }

    // Delete the product
    await productRepository.remove(product);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
