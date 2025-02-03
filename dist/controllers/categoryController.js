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
exports.crateCategory = void 0;
const category_1 = require("../entities/category");
const ormConfig_1 = require("../ormConfig");
const crateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, products } = req.body;
        const categoryRepository = ormConfig_1.AppDataSource.getRepository(category_1.Category);
        const exitingCategory = yield categoryRepository.findOne({
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
        yield categoryRepository.save(newCategory);
        res.status(201).json({
            message: "category added successfully",
            newCategory,
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});
exports.crateCategory = crateCategory;
