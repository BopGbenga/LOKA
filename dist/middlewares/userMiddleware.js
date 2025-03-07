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
exports.artisansField = exports.validateLogin = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const validateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const schema = joi_1.default.object({
        firstname: joi_1.default.string().required().messages({
            "string.empty": "Firstname cannot be empty",
            "any.required": "Firstname is required",
        }),
        lastname: joi_1.default.string().required().messages({
            "string.empty": "Lastname cannot be empty",
            "any.required": "Lastname is required",
        }),
        email: joi_1.default.string().email().required().messages({
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required",
            "string.empty": "Email cannot be empty",
        }),
        username: joi_1.default.string().required().messages({
            "any.required": "username is required",
            "string.empty": "username cannot be empty",
            "string.base": "invalid type,please provide a valid string",
        }),
        password: joi_1.default.string()
            .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d])[A-Za-z\\d\\S]{8,}$"))
            .required()
            .messages({
            "any.required": "Password is required.",
            "string.empty": "Password cannot be empty.",
            "string.pattern.base": "Password must be at least 8 characters long, contain uppercase letters, lowercase letters, numbers, and special characters.",
        }),
        confirmPassword: joi_1.default.string()
            .valid(joi_1.default.ref("password"))
            .required()
            .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required",
            "string.empty": "Confirm password cannot be empty",
        }),
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
exports.validateUser = validateUser;
const validateLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSchema = joi_1.default.object({
            email: joi_1.default.string().email().required().messages({
                "string.email": "provide a vaild email ",
                "any.required": "email is required",
                "string.empty": "email cannot be emoty",
            }),
            password: joi_1.default.string().required().messages({
                "any.required": "password is required",
                "string.empty": "password canoot be empty",
            }),
        });
        yield userSchema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        res.status(422).json({
            message: "validation failed",
            success: false,
            error: error.details ? error.details[0].message : error.message,
        });
        return;
    }
});
exports.validateLogin = validateLogin;
const artisansField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artisanSchema = joi_1.default.object({
            userId: joi_1.default.number().required().messages({
                "any.required": "userId is required",
                "number.base": "userId should be a number",
            }),
            businessName: joi_1.default.string().required().messages({
                "any.required": "businessName is required",
                "string.empty": "field cannot be empty",
                "string.base": "invalid type, please provide a valid string",
            }),
            businessDescription: joi_1.default.string().required().messages({
                "any.required": "businessDescription is required",
                "string.empty": "field cannot be empty",
                "string.base": "invalid type, please provide a valid string",
            }),
            businessCategory: joi_1.default.string().required().messages({
                "any.required": "businessCategory is required",
                "string.empty": "field cannot be empty",
                "string.base": "invalid type, please provide a valid string",
            }),
            // businessLocation: Joi.string().required().messages({
            //   "any.required": "businessLocation is required",
            //   "string.empty": "field cannot be empty",
            // }),
            state: joi_1.default.string().required().messages({
                "any.required": "state is required",
                "string.empty": "field cannot be empty",
                "string.base": "invalid type, please provide a valid string",
            }),
            contactInformation: joi_1.default.string().required().messages({
                "any.required": "contactInformation is required",
                "string.empty": "field cannot be empty",
            }),
        });
        // Validate the request body using Joi
        const { error } = yield artisanSchema.validate(req.body, {
            abortEarly: false,
        });
        // If there are validation errors, map them and send a response
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            res.status(422).json({
                message: "Validation failed",
                success: false,
                errors: errorMessages,
            });
            return;
        }
        // If validation passes, proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.error("Error during validation:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});
exports.artisansField = artisansField;
