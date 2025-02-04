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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProducts = void 0;
const joi_1 = __importDefault(require("joi"));
const validateProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required().messages({
            "string.empty": "name cannot be empty",
            "any.required": "name is required",
        }),
        description: joi_1.default.string().required().messages({
            "string.empty": "description cannot be empty",
            "any.required": "description is required",
            "string.base": "invalid type,please provide a valid string",
        }),
        price: joi_1.default.string().required().messages({
            "string.empty": "price cannot be empty",
            "any.required": "price is required",
            "number.base": "invalid type,please provide a valid number",
        }),
        stockQuantity: joi_1.default.number().required().messages({
            "string.empty": "stock quality cannot be empty",
            "any.required": "stock quality is required",
        }),
        category: joi_1.default.string().required().messages({
            "string.empty": "category cannot be empty",
            "any.required": "stock quality is required",
            "string.base": "invalid type,please provide a valid string",
        }),
        image: joi_1.default.string(),
    });
    try {
        yield schema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        const errors = error.details.map((detail) => ({
            field: detail.context.key,
            message: detail.message,
        }));
        res.status(422).json({
            message: "Validation error",
            success: false,
            errors,
        });
    }
});
exports.validateProducts = validateProducts;
