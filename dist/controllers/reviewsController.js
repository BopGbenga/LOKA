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
exports.submtReview = void 0;
const ormConfig_1 = require("../ormConfig");
const order_1 = require("../entities/order");
//submit a review
const submtReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.id;
        if (rating < 1 || rating > 5) {
            res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }
        const order = yield ormConfig_1.AppDataSource.getRepository(order_1.Order).findOne({
            where: { user: { id: userId }, status: "delivered" },
            relations: ["users"],
        });
        if (!order) {
            res.status(403).json({ message: "you can only review ordered product" });
        }
    }
    catch (error) { }
});
exports.submtReview = submtReview;
