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
exports.createProduct = exports.getProductById = void 0;
const products_1 = require("../entities/products");
const category_1 = require("../entities/category");
const ormConfig_1 = require("../ormConfig");
//get Allproducts
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
    }
    catch (error) { }
});
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
    }
    catch (error) { }
});
exports.createProduct = createProduct;
