"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const products_1 = require("../entities/products");
const category_1 = require("../entities/category");
const ormConfig_1 = require("../ormConfig");
//get Allproducts
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, category } = req.query;
        const productRepository = ormConfig_1.AppDataSource.getRepository(products_1.products);
        const queryBuilder = productRepository.createQueryBuilder("product");
        if (name) {
            queryBuilder.andWhere("product.name ILIKE :name", { name: `%${name}%` });
        }
        if (category) {
            queryBuilder.andWhere("product.category ILIKE :category", {
                category: `%${category}%`,
            });
        }
        const allProducts = yield queryBuilder.getMany();
        res.status(200).json(allProducts);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllProducts = getAllProducts;
//get product by id
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = Number(req.params.id);
        const productRepository = ormConfig_1.AppDataSource.getRepository(products_1.products);
        const product = yield productRepository.findOne({
            where: { id: productId },
            relations: ["category"],
        });
        if (!product) {
            res.status(500).json({ success: false, message: "product not found" });
            return;
        }
        res.send(product);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProductById = getProductById;
// create product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stockQuantity, categoryId, images, availability, } = req.body;
        const productRepository = ormConfig_1.AppDataSource.getRepository(products_1.products);
        const categoryRepository = ormConfig_1.AppDataSource.getRepository(category_1.Category);
        const category = yield categoryRepository.findOne({
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
        yield productRepository.save(product);
        res.status(201).json({
            message: "product added successsfully",
            product,
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.createProduct = createProduct;
//update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prooductId = Number(req.params.id);
        const productRepository = ormConfig_1.AppDataSource.getRepository(products_1.products);
        const product = yield productRepository.findOne({
            where: { id: prooductId },
        });
        if (!product) {
            res.status(404).json({
                message: "product not found",
            });
            return;
        }
        const { name, descriptiion, price, stockQuantity, images, category, availability, } = req.body;
        if (name)
            product.name = name;
        if (descriptiion)
            product.description;
        if (price)
            product.price;
        if (stockQuantity)
            product.stockQuantity;
        if (images)
            product.images;
        if (category)
            product.category;
        if (availability)
            product.availability;
        yield productRepository.save(product);
        res.status(200).json({
            message: "product updated successfully",
            data: product,
        });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProduct = updateProduct;
//delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assumes `req.user` is populated via middleware
        const productId = Number(req.params.id); // Extract product ID from route params
        const productRepository = ormConfig_1.AppDataSource.getRepository(products_1.products);
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return; // Stop further execution
        }
        // Find product by user ID and product ID
        const product = yield productRepository.findOne({
            where: { user: { id: userId }, id: productId },
        });
        if (!product) {
            res.status(404).json({
                message: "Product not found or you are not authorized to delete this product",
            });
            return;
        }
        // Delete the product
        yield productRepository.remove(product);
        res.status(200).json({ message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteProduct = deleteProduct;
