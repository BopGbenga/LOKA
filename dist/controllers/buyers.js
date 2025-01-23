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
exports.userInterest = void 0;
const users_1 = require("../entities/users");
const ormConfig_1 = require("../ormConfig");
const products_1 = require("../entities/products");
const typeorm_1 = require("typeorm");
//user interest
const userInterest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({
            where: { id: userId },
            relations: ["interests"],
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const interestIds = user.interests.map((category) => category.id);
        const productRepository = ormConfig_1.AppDataSource.getRepository(products_1.products);
        const forYouProducts = yield productRepository.find({
            where: {
                category: { id: (0, typeorm_1.In)(interestIds) },
                availability: true,
            },
            relations: ["category", "artisan"],
        });
        const otherProducts = yield productRepository.find({
            where: {
                category: { id: (0, typeorm_1.Not)((0, typeorm_1.In)(interestIds)) },
                availability: true,
            },
            relations: ["category", "artisan"],
        });
        res.json({
            forYou: forYouProducts,
            others: otherProducts,
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.userInterest = userInterest;
